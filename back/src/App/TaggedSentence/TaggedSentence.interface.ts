import { Types} from "mongoose";
import {LexicalUnitInterface} from "../LexicalUnit/LexicalUnit.interface";
import FrameInterface from "../Frame/Frame.interface";
import {SentenceInterface} from "../Sentence/Sentence.interface";
import {ElementInterface} from "../Element/Element.interface";
import UserInterface from "../User/User.interface";
import {MongoosePaginationInterface} from "../../Core/Singleton/MongoosePaginator";

export interface TaggedSentenceInterface {
    _id: Types.ObjectId
    lang?:number,
    propBankTags: (number|null)[],
    frameNetTags: ({
        tagType: number,
        element?: Types.ObjectId | ElementInterface
    })[],
    sentence: Types.ObjectId | SentenceInterface,
    frame?: Types.ObjectId | FrameInterface,
    lexicalUnit?: Types.ObjectId | LexicalUnitInterface,
    lexicalUnitHelper?:string,
    frameHelper?:string,
    description?:string,
    status: number,
    words: string,
    lexicalUnitHint?:string,
    issuer?: Types.ObjectId | UserInterface,
    reviewer?: Types.ObjectId | UserInterface,
    frameName?:string,
    lexicalUnitName?:string,
    updatedAt: Date,
    createdAt: Date,
}


export interface StoreTaggedSentenceInterface{
    propBankTags: (number|null)[],
    frameNetTags: ({
        tagType: number,
        element?: string
    })[],
    description?:string,
    lexicalUnitHint?:string,
    frame?: string,
    lexicalUnit?: string,
}
export interface EditTaggedSentenceInterface{
    propBankTags: (number|null)[],
    frameNetTags: ({
        tagType: number,
        element?: string
    })[],
    description?:string,
    lexicalUnitHint?:string,
    frame?: string,
    lexicalUnit?: string,
}
export interface ChangeTaggedSentenceStatusInterface {
    status: number,
}
export interface PublishTaggedSentenceInterface {
    status: number,
    message?: string,
}
export interface FullTaggedSentenceInterface extends TaggedSentenceInterface{
    message?:string,
}
export interface PaginateTaggedSentenceInterface extends MongoosePaginationInterface{
    lang?:number,
    issuer?:string|undefined,
    user?:string|undefined|null,
    words? : string[],
    status?: number,
    lexicalUnit? : string,
    frame? : string,
    lexicalUnitHelper?:string,
    frameHelper?:string,
    lexicalUnitHint?:string,
}
