import { Types } from "mongoose";
import {MongoosePaginationInterface} from "../../Core/Singleton/MongoosePaginator";

export interface SentenceInterface {
    _id :Types.ObjectId
    words: string,
    lang?:number,
    createdAt: Date,
    updatedAt: Date,
}

export interface StoreSentenceInterface {
    words: string[],
}

export interface EditSentenceInterface {
    words: string[],
}

export interface PaginateSentenceInterface extends MongoosePaginationInterface{
    words?: string[],
    lang?:number,
}
