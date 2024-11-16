import {PaginatedInterface, PaginationInterface} from "./Pagination.interface";

export interface SentenceInterface {
    _id :string
    words: string,
}

export interface StoreSentenceInterface {
    words: string[],
}

export interface EditSentenceInterface {
    words: string[],
}

export interface PaginateSentenceInterface extends PaginationInterface{
    words?: string[],
}

export interface SentencePaginatedInterface extends PaginatedInterface<SentenceInterface>{}