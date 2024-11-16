import FrameInterface from "./Frame.interface";
import {PaginatedInterface, PaginationInterface} from "./Pagination.interface";

export type LexicalUnitInterface = {
    _id: string,
    frame: FrameInterface|string,
    name: string,
    type: number,
    definition: string,
    sentenceCount?:number,
}

export interface StoreLexicalUnitInterface {
    name: string,
    type: number,
    definition: string,
}

export interface EditLexicalUnitInterface {
    name: string,
    type: number,
    definition: string,
}
export interface PaginateLexicalUnitInterface extends PaginationInterface{
    name?: string,
    type?: number,
}

export interface LexicalUnitPaginatedInterface extends PaginatedInterface<LexicalUnitInterface>{
}