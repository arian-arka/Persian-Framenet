import {ElementInterface} from "./Element.interface";
import FrameInterface from "./Frame.interface";
import {LexicalUnitInterface} from "./LexicalUnit.interface";
import {SentenceInterface} from "./Sentence.interface";
import UserInterface from "./User.interface";
import {PaginatedInterface, PaginationInterface} from "./Pagination.interface";

export interface TaggedSentenceInterface {
    _id: string
    propBankTags: (number | null)[],
    frameNetTags: ({
        tagType: number,
        element?: string | ElementInterface
    })[],
    sentence: string | SentenceInterface,
    frame?: string | FrameInterface,
    lexicalUnit?: string | LexicalUnitInterface,
    frameHelper?:string,
    lexicalUnitHelper?:string,
    description?:string,
    lexicalUnitHint?:string,
    status: number,
    issuer?: string | UserInterface,
    updatedAt: Date,
    createdAt: Date,
}

export interface StoreTaggedSentenceInterface {
    propBankTags: (number | null)[],
    frameNetTags: ({
        tagType: number,
        element?: string
    })[],
    frame?: string,
    description?:string,
    lexicalUnitHint?: string,
    lexicalUnit?: string,
}

export interface EditTaggedSentenceInterface {
    propBankTags: (number | null)[],
    frameNetTags: ({
        tagType: number,
        element?: string
    })[],
    frame?: string,
    description?:string,
    lexicalUnitHint?: string,
    lexicalUnit?: string,
}

export interface ChangeTaggedSentenceStatusInterface {
    status: number,
}

export interface PublishTaggedSentenceInterface {
    status: number,
    message?: string,
}

export interface FullTaggedSentenceInterface extends TaggedSentenceInterface {
    message?: string,
}

export interface PaginateTaggedSentenceInterface extends PaginationInterface {
    words?: string[],
    status?: number,
    lexicalUnit?: string,
    frame?: string,
}


export interface TaggedSentencePaginatedInterface extends PaginatedInterface<TaggedSentenceInterface> {
}

