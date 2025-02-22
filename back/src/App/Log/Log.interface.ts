import {Types} from "mongoose";
import UserInterface from "../User/User.interface";
import {MongoosePaginationInterface} from "../../Core/Singleton/MongoosePaginator";

export type LogInterface = {
    _id: Types.ObjectId,
    issuer?: Types.ObjectId|UserInterface,
    action : number,
    description : string,
    additionalInfo?: { [key:string] : number|string|null },
    ref?:Types.ObjectId,
    updatedAt: Date,
    createdAt: Date,
}
export interface PaginateAllLogInterface extends MongoosePaginationInterface{
    type?:number|undefined,
    period?:number,
}
export interface PaginateLogInterface extends MongoosePaginationInterface{
    issuer?: string|undefined,
    type?:number|undefined,
    period?:number,
}
