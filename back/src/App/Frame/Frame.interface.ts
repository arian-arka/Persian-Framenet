import {Types} from "mongoose";
import UserInterface from "../User/User.interface";
import {MongoosePaginationInterface} from "../../Core/Singleton/MongoosePaginator";
import {ElementInterface} from "../Element/Element.interface";
import { LexicalUnitInterface } from "../LexicalUnit/LexicalUnit.interface";

export default interface FrameInterface {
    _id: Types.ObjectId
    name: string,
    lang: number,
    definition: string,
    semanticType?: string,
    status: number,
    mirror?: FrameInterface | Types.ObjectId,
    issuer?: UserInterface | Types.ObjectId,
    deletedAt?: Date,
    updatedAt: Date,
    createdAt: Date,
}
export interface FullFrameInterface extends FrameInterface{
    message?: string,
    elements : ElementInterface[],
    lexicalUnits : LexicalUnitInterface[],
}
export interface StoreFrameInterface {
    name: string,
    lang: number,
    semanticType?: string,
    definition: string,
    mirror?: string,
}
export interface EditFrameInterface {
    name: string,
    lang: number,
    semanticType?: string,
    definition: string,
    mirror?: string,
}
export interface ChangeFrameStatusInterface {
    status: number,
}
export interface PublishFrameInterface {
    status: number,
    message?: string,
}
export interface PaginateFrameInterface extends MongoosePaginationInterface{
    issuer?: string|undefined,
    name?: string,
    lang?: number,
    status?: number,
}
