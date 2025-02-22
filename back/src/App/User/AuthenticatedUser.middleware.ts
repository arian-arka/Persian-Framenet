import {FastifyReply, FastifyRequest} from "fastify";
import UserInterface from "./User.interface";
import Unauthorized from "../../Core/Response/400/Unauthorized";
import UserService from "./User.service";
import Middleware from "../../Core/Class/Middleware";

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { _id: string } // payload type is used for signing and verifying
        user: UserInterface
    }
}
export class AuthenticatedUser extends Middleware{
    constructor() {
        super();
    }
    async handle(request: FastifyRequest, reply: FastifyReply): Promise<any> {
        const token = request.cookies?.token ?? '';
        console.log('coooooooooooooooooooooooooooooooooooookies',request.cookies)
        if(token.length === 0)
            throw Unauthorized.forMessage('Unauthenticated');

        let payload
        try{
            payload = request.jwt.verify<{ _id: string }>(token);
        }catch (e){
            throw Unauthorized.forMessage('Unauthenticated');
        }

        if(!payload)
            throw Unauthorized.forMessage('Unauthenticated');
        const user = await UserService.find(payload._id);

        if(!user || !user.lastLogin || (user.lastLogout && user.lastLogout < new Date())){
            reply.clearCookie('token');
            throw Unauthorized.forMessage('Unauthenticated');
        }
        request.user = user;
    }
}
export class UnAuthenticatedUser extends Middleware{
    constructor() {
        super();
    }
    async handle(request: FastifyRequest, reply: FastifyReply): Promise<any> {
        const token = request.cookies?.token ?? '';
        console.log(request.cookies);
        let authenticated = false;

        if( token.length > 0){
            try{
                const payload = request.jwt.verify<{ _id: string }>(token);
                if(!payload)
                    return;
                const user = await UserService.find(payload._id);

                if(!user || !user.lastLogin || (user?.lastLogout && user.lastLogout < new Date()))
                    return;

                authenticated = true;
            }catch (e){}
        }

        if(authenticated)
            throw Unauthorized.forMessage('Authenticated');

    }
}

