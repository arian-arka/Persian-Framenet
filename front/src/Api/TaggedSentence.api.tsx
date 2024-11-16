import Api from "../Core/Api/Api";
import {
    EditTaggedSentenceInterface,
    FullTaggedSentenceInterface,
    PaginateTaggedSentenceInterface,
    PublishTaggedSentenceInterface,
    StoreTaggedSentenceInterface,
    TaggedSentenceInterface,
    TaggedSentencePaginatedInterface
} from "../Type/TaggedSentence.interface";
import PublishFrameValidation from "../Validation/Frame/PublishFrame.validation";
import CsrfApi from "./Csrf.api";

class TaggedSentenceApi extends CsrfApi {
    constructor() {
        super();
    }

    show(taggedSentence: string){
        return this._fetch<FullTaggedSentenceInterface>({
            method: `GET`,
            url: `/api/taggedSentence/${taggedSentence}`,
        });
    }

    delete(taggedSentence: string){
        return this._fetch<any>({
            method: `DELETE`,
            url: `/api/taggedSentence/${taggedSentence}`,
        });
    }

    store(sentence:string,data: StoreTaggedSentenceInterface) {

        return this._fetch<TaggedSentenceInterface>({
            method: `POST`,
            url: `/api/taggedSentence/store/${sentence}`,
            body: data,
            headers: {"Content-Type": "application/json",},
            // validation: {schema}
        });
    }

    edit(taggedSentence:string,data: EditTaggedSentenceInterface) {

        return this._fetch<TaggedSentenceInterface>({
            method: `PUT`,
            url: `/api/taggedSentence/${taggedSentence}`,
            body: data,
            headers: {"Content-Type": "application/json",},
            // validation: {schema}
        });
    }

    list(search : PaginateTaggedSentenceInterface){
        return this._fetch<TaggedSentencePaginatedInterface>({
            method:`POST`,
            url:`/api/taggedSentence/list`,
            headers: {"Content-Type": "application/json",},
            body:search
        })
    }

    publish(taggedSentence:string,data : PublishTaggedSentenceInterface){
        return this._fetch<TaggedSentenceInterface>({
            method: `PUT`,
            url: `/api/taggedSentence/publish/${taggedSentence}`,
            body: data,
            headers: {"Content-Type": "application/json",},
            validation: PublishFrameValidation
        });
    }
    status(taggedSentence:string,status:number){
        return this._fetch<TaggedSentenceInterface>({
            method: `PUT`,
            url: `/api/taggedSentence/status/${taggedSentence}`,
            body: {status},
            headers: {"Content-Type": "application/json",},
        });
    }
}

export default TaggedSentenceApi;