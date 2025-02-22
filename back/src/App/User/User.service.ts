import {MongooseService} from "../../Core/Class/MongooseService";
import {UserModel} from "./User.model";
import UserInterface, {GrantUserInterface, PaginateUserInterface, RegisterUserInterface} from "./User.interface";
import {Document, Types} from "mongoose";
import Str from "../../Core/Singleton/Str";
import {USER_PRIVILEGES} from "./User.contant";

export default new class UserService extends MongooseService<UserInterface> {
    constructor() {
        super(UserModel);
    }

    async registerTest(data : { email:string,name:string,password:string,isSuperAdmin?:boolean }){
        return await this.create<RegisterUserInterface>(data);
    }


    async register(data: RegisterUserInterface) {
        return await this.create<RegisterUserInterface>(data);
    }

    async emailExists(email: string,exceptId : string|Types.ObjectId|null|undefined = undefined) {
        if(exceptId)
            return await this.exists({email,_id:{'$ne' : exceptId}});
        return await this.exists({email});
    }

    async findByMail(email: string): Promise<(Document<unknown, any, UserInterface> & Omit<UserInterface & Required<{ _id: Types.ObjectId }>, never>) | null> {
        return await this._model.findOne({email}).exec();
    }

    async login(_id: Types.ObjectId | string | null | undefined): Promise<boolean> {
        return await this.update(_id, {lastLogin: new Date(), lastLogout: null});
    }

    async logout(_id: Types.ObjectId | string | null | undefined): Promise<boolean> {
        return await this.update(_id, {lastLogout: new Date()});
    }

    async grantAll(user:UserInterface,status:boolean){
        if (!status)
            return (await UserModel.updateOne({_id: user._id}, {
                '$pull': {
                    'privileges': {'$in': Object.values(USER_PRIVILEGES)}
                }
            }).exec()).acknowledged;
        return (await UserModel.updateOne({_id: user._id}, {
            '$addToSet': {
                'privileges': {'$each': Object.values(USER_PRIVILEGES)}
            }
        }).exec()).acknowledged;
    }

    async grant(data: GrantUserInterface): Promise<boolean> {
        if (!data.grant)
            return (await UserModel.updateOne({_id: data._id}, {
                '$pull': {
                    'privileges': {'$in': data.privileges}
                }
            }).exec()).acknowledged;
        return (await UserModel.updateOne({_id: data._id}, {
            '$addToSet': {
                'privileges': {'$each': data.privileges}
            }
        }).exec()).acknowledged;
    }

    async list(data: PaginateUserInterface) {
        const query: any = {
        };
        if(data.suspended !== null && data.suspended!== undefined) {
            if(data.suspended)
                query['suspendedAt'] = {'$ne': null};
            else
                query['suspendedAt'] = null;
        }
        if (data.name) {
            query['name'] = {'$regex': Str.safeString(data.name), '$options': 'i'}
        }

        if (data.email) {
            query['$text'] = {
                // '$search': settings?.query?.phrase ? `\"${Str.safeString(data.name)}\"` : Str.safeString(data.name),
                '$search': Str.safeString(data.email),
                '$caseSensitive': false
            };
        }
        return await this.paginate<PaginateUserInterface>({
            data,
            query,
            sort: {
                name: 1
            }
        })
    }

    async canUser(_id: Types.ObjectId | string | null | undefined, status: number, canOnNonExistence = true): Promise<boolean> {
        const user = await this.find(_id);
        return !user ? canOnNonExistence : user.privileges.includes(status);
    }

    async suspend(_id:Types.ObjectId|string,status:boolean){
        return await this.update(_id, {suspendedAt: status ? new Date() : null});
    }
};