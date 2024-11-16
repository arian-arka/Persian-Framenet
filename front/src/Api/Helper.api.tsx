import CsrfApi from "./Csrf.api";

export default class HelperApi extends CsrfApi {
    matchSentence(data: {
        count : number,
        sentence : string,
        lexicalUnit : string,
    }) {
        return this._fetch<{
            '_id' : string,
            'words' : string,
            'frame' : string,
            'lexicalUnit' : string,
            'ratio' : number,
        }[]>({
            method: `POST`,
            url: `/api/helper/match/sentence`,
            headers: {"Content-Type": "application/json",},
            body: data,
        })
    }
    matchFrame(data: {
        sentence : string,
        lexicalUnit : string,
    }) {
        return this._fetch<{ content : string }>({
            method: `POST`,
            url: `/api/helper/match/frame`,
            headers: {"Content-Type": "application/json",},
            body: data,
        })
    }
}