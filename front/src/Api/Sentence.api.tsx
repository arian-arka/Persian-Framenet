import Api from "../Core/Api/Api";
import {
    EditSentenceInterface,
    PaginateSentenceInterface,
    SentenceInterface,
    SentencePaginatedInterface, StoreSentenceInterface
} from "../Type/Sentence.interface";
import StoreSentenceValidation from "../Validation/Sentence/StoreSentence.validation";
import EditSentenceValidation from "../Validation/Sentence/EditSentence.validation";
import {string} from "yup";
import {TaggedSentenceInterface} from "../Type/TaggedSentence.interface";
import {FullFrameInterface} from "../Type/Frame.interface";
import CsrfApi from "./Csrf.api";


class SentenceApi extends CsrfApi {
    constructor() {
        super();
    }
    tagged(sentence:string){
        return this._fetch<TaggedSentenceInterface[]>({
            method: `GET`,
            url: `/api/sentence/tagged/${sentence}`,
        });
    }

    list(data: PaginateSentenceInterface) {
        return this._fetch<SentencePaginatedInterface>({
            method: `POST`,
            url: `/api/sentence/list`,
            headers: {"Content-Type": "application/json",},
            body: data
        })
    }

    show(sentence: string) {
        return this._fetch<SentenceInterface>({
            method: `GET`,
            url: `/api/sentence/${sentence}`,
        });
    }

    delete(sentence: string) {
        return this._fetch<any>({
            method: `DELETE`,
            url: `/api/sentence/${sentence}`,
        });
    }

    store(data: StoreSentenceInterface) {
        return this._fetch<SentenceInterface>({
            method: `POST`,
            url: `/api/sentence/store`,
            body: data,
            headers: {"Content-Type": "application/json",},
            validation: StoreSentenceValidation
        });
    }

    edit(sentence: string, data: EditSentenceInterface) {
        return this._fetch<SentenceInterface>({
            method: `PUT`,
            url: `/api/sentence/${sentence}`,
            body: data,
            headers: {"Content-Type": "application/json",},
            validation: EditSentenceValidation
        });
    }

}

export default SentenceApi;