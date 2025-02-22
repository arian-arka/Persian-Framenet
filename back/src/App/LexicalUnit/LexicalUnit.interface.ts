import {Types} from "mongoose";
import FrameInterface from "../Frame/Frame.interface";
import {MongoosePaginationInterface} from "../../Core/Singleton/MongoosePaginator";

export type LexicalUnitInterface = {
    _id: Types.ObjectId,
    frame: FrameInterface|Types.ObjectId,
    name: string,
    order:number,
    type: number,
    definition?: string,
    taggedSentenceCount:number,
    updatedAt: Date,
    createdAt: Date,
}

export interface StoreLexicalUnitInterface {
    name: string,
    type: number,
    definition?: string,
}

export interface EditLexicalUnitInterface {
    name: string,
    type: number,
    definition?: string,
}
export interface ReorderLexicalUnitInterface{
    lexicalUnit:string,
    after?:string,
}
export interface PaginateLexicalUnitInterface extends MongoosePaginationInterface{
    name?: string,
    type?: number,
}
