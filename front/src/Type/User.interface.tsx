import {PaginatedInterface, PaginationInterface} from "./Pagination.interface";

export default interface UserInterface {
    _id: string,
    name: string,
    email: string,
    password: string,
    privileges: number[],
    isSuperAdmin: boolean,
    lastLogout?: Date,
    lastLogin?: Date,
    suspendedAt: Date,
    updatedAt: Date,
    createdAt: Date,
}

export interface UserLogInterface{
    _id: string,
    issuer: {
        _id: string,
        name: string,
    },
    action : number,
    description : string,
    ref?:string,
    updatedAt: Date,
    createdAt: Date,
}
export interface RegisterUserInterface {
    name: string,
    email: string,
    password: string,
    isSuperAdmin : boolean
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
export interface PaginateUserInterface extends PaginationInterface{
    name?: string,
    email?: string,
}

export interface UserPaginatedInterface extends PaginatedInterface<UserInterface>{}

export interface PaginateUserLogInterface extends PaginationInterface{
    issuer : string,
    type?:number,
    period?:number,
}

export interface UserLogPaginatedInterface extends PaginatedInterface<UserLogInterface>{}

