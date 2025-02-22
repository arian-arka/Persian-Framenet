import {FastifyReply, FastifyRequest} from "fastify";
import RegisterUserValidation from "./Validation/RegisterUser.validation";
import {
    GrantUserInterface,
    LoginUserInterface,
    PaginateUserInterface,
    RegisterUserInterface, UpdateProfileInterface,
    UpdateUserInterface
} from "./User.interface";
import UserService from "./User.service";
import Hash from "../../Core/Singleton/Hash";
import LoginUserValidation from "./Validation/LoginUser.validation";
import BadRequest from "../../Core/Response/400/BadRequest";
import Framework from "../../Core/Framework";
import {JWT_EXPIRATION_TIME} from "./User.contant";
import InternalServerError from "../../Core/Response/500/InternalServerError";
import GrantUserValidation from "./Validation/GrantUser.validation";
import ListUserValidation from "./Validation/ListUser.validation";
import UserEvent from "../../Event/User.event";
import UserDeletionEvent from "../../Event/UserDeletion.event";
import UpdateUserValidation from "./Validation/UpdateUser.validation";
import UpdateProfileValidation from "./Validation/UpdateProfile.validation";
import Unauthorized from "../../Core/Response/400/Unauthorized";
import ListUserLogValidation from "./Validation/ListUserLog.validation";
import {PaginateLogInterface} from "../Log/Log.interface";
import LogService from "../Log/Log.service";

export default class UserController {
    constructor() {
    }
    async registerTest(request: FastifyRequest<{ Params?: { token?: string | null | undefined } }>) {
        const envToken = process?.env?.REGISTER_TOKEN;
        if(typeof envToken === 'string'){
            if(envToken.length === 0 )
                throw Unauthorized.forMessage();
            if(envToken !== request?.params?.token)
                throw Unauthorized.forMessage();
        }else throw Unauthorized.forMessage();

        const validation = await RegisterUserValidation.forRequest<RegisterUserInterface>(request);
        const user = await UserService.registerTest({
            ...validation.data(),
            password: await Hash.make(validation.data().password),
            isSuperAdmin : true,
        });
        await UserEvent.fire({user});
        return user;
    }
    async register(request: FastifyRequest) {
        await request.gate('User.register', request.user);
        const validation = await RegisterUserValidation.forRequest<RegisterUserInterface>(request);
        const user = await UserService.register({
            ...validation.data(),
            password: await Hash.make(validation.data().password)
        });
        await UserEvent.fire({user});
        return user;
    }

    async updateProfile(request: FastifyRequest) {
        const user = request.user;
        const validation = await UpdateProfileValidation.forBody<UpdateProfileInterface>(request, user);

        if (!await Hash.check(user.password, validation.data().oldPassword))
            throw BadRequest.forErrors(Framework.Language.pair('oldPassword', 'validation.user.oldPassword'));

        const newData = {
            password: validation.data().newPassword ? await Hash.make(validation.data().newPassword as string) : user.password,
            name: validation.data().name,
            email: validation.data().email,
        };

        return await UserService.updateAndGet(user._id, newData);
    }

    async updateUser(request: FastifyRequest) {
        const validation = await UpdateUserValidation.forBody<UpdateUserInterface>(request);
        const targetUser = await UserService.findOrFail(validation.data()._id);
        await request.gate('User.edit', request.user, targetUser);
        const password = validation.data().password ? await Hash.make(validation.data().password as string) : targetUser.password;
        return await UserService.updateAndGet(targetUser._id, {
            ...validation.data(),
            password
        });
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        const validation = await LoginUserValidation.forRequest<LoginUserInterface>(request);
        const user = await UserService.findByMail(validation.data().email);

        if (!user || !await Hash.check(user.password, validation.data().password))
            throw BadRequest.forMessage(Framework.Language.generate('validation.user.invalidLogin'));

        if (!await UserService.login(user._id))
            throw InternalServerError.instance('Database while log user in');

        const token = request.jwt.sign({_id: user._id.toString()}, {expiresIn: JWT_EXPIRATION_TIME});

        reply.setCookie('token', token, {
            secure: !Framework.debug, // send cookie over HTTPS only
            httpOnly: true,
            path: '/',
            sameSite: true // alternative CSRF protection
        });
        console.log('12312312331231312312312312312233131313123323');
        return user;
    }

    async logout(request: FastifyRequest, reply: FastifyReply) {
        if (!(await UserService.logout(request.user._id)))
            throw new InternalServerError('Could not logout');

        reply.clearCookie('token');

        return {};
    }

    async currentUser(request: FastifyRequest) {
        return request.user;
    }

    async grant(request: FastifyRequest) {
        const validation = await GrantUserValidation.forRequest<GrantUserInterface>(request);

        const targetUser = await UserService.find(validation.data()._id);
        if (!targetUser)
            throw BadRequest.forErrors(Framework.Language.pair('_id', 'validation.user.invalidUser'));

        await request.gate('User.edit', request.user, targetUser);

        if (!await UserService.grant(validation.data()))
            throw InternalServerError.instance('Could not grant user');

        await UserEvent.fire({user: await UserService.find(targetUser._id)})
        return {};
    }

    async grantAll(request: FastifyRequest<{ Params?: { user?: string | null | undefined,grant?: string | null | undefined } }>) {
        const targetUser = await UserService.findOrFail(request?.params?.user);

        await request.gate('User.edit', request.user, targetUser);

        if (!await UserService.grantAll(targetUser,request.params?.grant === 'true'))
            throw InternalServerError.instance('Could not grant user');

        await UserEvent.fire({user: await UserService.find(targetUser._id)})
        return {};
    }

    async suspend(request: FastifyRequest<{ Params?: { user?: string | null | undefined,grant?: string | null | undefined } }>) {
        const targetUser = await UserService.findOrFail(request?.params?.user);
        await request.gate('User.edit', request.user, targetUser);

        if (!await UserService.suspend(targetUser._id,request.params?.grant === 'true'))
            throw InternalServerError.instance('Could not grant user');

        await UserEvent.fire({user: await UserService.find(targetUser._id)});

        return {};
    }

    async list(request: FastifyRequest) {
        const validation = await ListUserValidation.forRequest<PaginateUserInterface>(request);
        return await UserService.list(validation.data());
    }

    async delete(request: FastifyRequest<{ Params?: { user?: string | null | undefined } }>) {
        const user = request.user;

        const targetUser = await UserService.findOrFail(request?.params?.user);

        await request.gate('User.delete', user, targetUser);

        await UserDeletionEvent.fire({user: await UserService.find(targetUser._id)})

        await UserService.delete(targetUser._id);

        return user;
    }

    async user(request: FastifyRequest<{ Params?: { user?: string | null | undefined } }>) {
        const user = request.user;

        const targetUser = await UserService.findOrFail(request?.params?.user);

        await request.gate('User.show', user, targetUser);

        return targetUser;
    }

    async log(request: FastifyRequest){
        const validation = await ListUserLogValidation.forRequest<PaginateLogInterface>(request);
        console.log('validation',validation.data());
        return await LogService.list(validation.data());
    }

}