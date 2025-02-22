import {Types} from "mongoose";
import {MongoosePaginationInterface} from "../../Core/Singleton/MongoosePaginator";

export default interface UserInterface {
    _id: Types.ObjectId
    name: string,
    email: string,
    password: string,
    privileges: number[],
    isSuperAdmin: boolean,
    lastLogout?: Date,
    lastLogin?: Date,
    suspendedAt?: Date,
    updatedAt: Date,
    createdAt: Date,
}

export interface RegisterUserInterface {
    name: string,
    email: string,
    password: string,
}

export interface UpdateProfileInterface {
    name: string,
    email: string,
    oldPassword: string,
    newPassword?: string,
}

export interface UpdateUserInterface {
    _id : string,
    name: string,
    email: string,
    password?: string,
}

export interface GrantUserInterface {
    _id : string,
    grant: boolean,
    privileges: number[],
}

export interface LoginUserInterface {
    email: string,
    password: string,
}

export interface PaginateUserInterface extends MongoosePaginationInterface{
    name?: string,
    email?: string,
    suspended?: boolean,
}
