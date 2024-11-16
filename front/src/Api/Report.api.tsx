import {
    PaginateUserLogInterface,
    UserLogPaginatedInterface
} from "../Type/User.interface";
import CsrfApi from "./Csrf.api";

export default class ReportApi extends CsrfApi {
    waitingTaggedSentencesOfLogs(users : []) {
        return this._fetch<UserLogPaginatedInterface>({
            method: `POST`,
            url: `/api/report/waitingTaggedSentencesOfLogs`,
            headers: {"Content-Type": "application/json",},
            body: {users},
        })
    }

    waitingTaggedSentences(users : []) {
        return this._fetch<UserLogPaginatedInterface>({
            method: `POST`,
            url: `/api/report/waitingTaggedSentences`,
            headers: {"Content-Type": "application/json",},
            body: {users},
        })
    }
}