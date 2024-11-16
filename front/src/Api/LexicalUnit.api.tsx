import Api from "../Core/Api/Api";
import {object, string, number, date, InferType, array, boolean} from 'yup';
import Language from "../Core/Language";
import {
    EditLexicalUnitInterface,
    LexicalUnitInterface, LexicalUnitPaginatedInterface,
    PaginateLexicalUnitInterface,
    StoreLexicalUnitInterface
} from "../Type/LexicalUnit.interface";
import StoreLexicalUnitValidation from "../Validation/LexicalUnit/StoreLexicalUnit.validation";
import EditLexicalUnitValidation from "../Validation/LexicalUnit/EditLexicalUnit.validation";
import {TaggedSentenceInterface} from "../Type/TaggedSentence.interface";
import {FramePaginatedInterface, FullFrameInterface, PaginateFrameInterface} from "../Type/Frame.interface";
import CsrfApi from "./Csrf.api";


class LexicalUnitApi extends CsrfApi {
    constructor() {
        super();
    }

    list(frame: string) {
        return this._fetch<LexicalUnitInterface[]>({
            method: 'POST',
            url: `/api/lexicalUnit/list/${frame}`,
        });
    }
    ofFrame(frame: string) {
        return this._fetch<LexicalUnitInterface[]>({
            method: 'POST',
            url: `/api/lexicalUnit/ofFrame/${frame}`,
        });
    }
    forTagging(frame: string) {
        return this._fetch<LexicalUnitInterface[]>({
            method: 'POST',
            url: `/api/lexicalUnit/forTagging/${frame}`,
        });
    }

    show(lexicalUnit: string) {
        return this._fetch<LexicalUnitInterface>({
            method: `GET`,
            url: `/api/lexicalUnit/${lexicalUnit}`,
        });
    }

    delete(lexicalUnit: string) {
        return this._fetch<any>({
            method: `DELETE`,
            url: `/api/lexicalUnit/${lexicalUnit}`,
        });
    }

    storeForTaggedSentence(frame: string, data: StoreLexicalUnitInterface) {

        return this._fetch<LexicalUnitInterface>({
            method: `POST`,
            url: `/api/lexicalUnit/storeForTaggedSentence/${frame}`,
            body: data,
            validation: StoreLexicalUnitValidation,
            headers: {"Content-Type": "application/json",},
        });
    }
    store(frame: string, data: StoreLexicalUnitInterface) {

        return this._fetch<LexicalUnitInterface>({
            method: `POST`,
            url: `/api/lexicalUnit/store/${frame}`,
            body: data,
            validation: StoreLexicalUnitValidation,
            headers: {"Content-Type": "application/json",},
        });
    }

    edit(lexicalUnit: string, data: EditLexicalUnitInterface) {
        return this._fetch<LexicalUnitInterface>({
            method: `PUT`,
            url: `/api/lexicalUnit/${lexicalUnit}`,
            body: data,
            validation: EditLexicalUnitValidation,
            headers: {"Content-Type": "application/json",},
        });
    }


    annotation(lexicalUnit: string) {
        return this._fetch<{
            sentences: TaggedSentenceInterface[],
            frame: FullFrameInterface,
            lexicalUnit: LexicalUnitInterface
        }>({
            method: `GET`,
            url: `/api/lexicalUnit/annotation/${lexicalUnit}`,
        });
    }

    reorder(orders: [string, string]) {
        return this._fetch<any>({
            method: `PUT`,
            url: `/api/lexicalUnit/reorder`,
            body: {
                lexicalUnit: orders[0],
                after: orders[1],
            },
            headers: {"Content-Type": "application/json",},
        });
    }

    search(search: PaginateLexicalUnitInterface) {
        return this._fetch<LexicalUnitPaginatedInterface>({
            method: `POST`,
            url: `/api/lexicalUnit/search`,
            headers: {"Content-Type": "application/json",},
            body: search
        })
    }
}

export default LexicalUnitApi;