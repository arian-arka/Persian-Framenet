import UserInterface from "./User.interface";
import {PaginatedInterface, PaginationInterface} from "./Pagination.interface";
import {LexicalUnitInterface} from "./LexicalUnit.interface";
import {ElementInterface} from "./Element.interface";

export default interface FrameInterface {
    _id: string,
    name: string,
    lang: number,
    definition: string,
    semanticType?: string,
    status: number,
    mirror?: FrameInterface | string,
    issuer?: UserInterface | string,
    deletedAt?: Date,
    updatedAt: Date,
    createdAt: Date,
}

export interface FrameRelationInterface {
    _id: string,
    name: string,
    fromFrame?: FrameInterface | string,
    toFrame?: FrameInterface | string,
    createdAt: Date,
    updatedAt: Date,
}

export interface FullFrameInterface extends FrameInterface {
    message?: string,
    elements: ElementInterface[],
    lexicalUnits: LexicalUnitInterface[],

    relations: { [key: string]: FrameRelationInterface },
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

export interface PaginateFrameInterface extends PaginationInterface {
    name?: string,
    lang?: number,
    status?: number,
}

export interface FramePaginatedInterface extends PaginatedInterface<FrameInterface> {
}