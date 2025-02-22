import {Types} from "mongoose";
import UserInterface from "../User/User.interface";
import {MongoosePaginationInterface} from "../../Core/Singleton/MongoosePaginator";

export type MessageInterface = {
    _id: Types.ObjectId,
    issuer: Types.ObjectId|UserInterface,
    issuedFor?: Types.ObjectId|UserInterface,
    isFor : number,
    ref?: string,
    refText?: string,
    message?: string,
    openedAt?:Date,
    seen?: Date,
    updatedAt: Date,
    createdAt: Date,
}
export interface PaginateMessageInterface extends MongoosePaginationInterface{
    isFor?: number,
    opened?: boolean,
}
