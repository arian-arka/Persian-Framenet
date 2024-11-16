import UserInterface from "./User.interface";
import {PaginatedInterface, PaginationInterface} from "./Pagination.interface";

export type MessageInterface = {
    _id: string,
    issuer: string|UserInterface,
    issuedFor?: string|UserInterface,
    isFor : number,
    ref?: string,
    refText?: string,
    message?: string,
    seen?: Date,
    updatedAt: Date,
    createdAt: Date,
}

export interface PaginateMessageInterface extends PaginationInterface{
    isFor?: number,
}

export interface MessagePaginatedInterface extends PaginatedInterface<MessageInterface>{}