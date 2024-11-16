import  {
    PaginateUserLogInterface,
     UserLogPaginatedInterface
} from "../Type/User.interface";
import CsrfApi from "./Csrf.api";

export default class LogApi extends CsrfApi {
    list(data: PaginateUserLogInterface) {
        return this._fetch<UserLogPaginatedInterface>({
            method: `POST`,
            url: `/api/log/list`,
            headers: {"Content-Type": "application/json",},
            body: data,
        })
    }
}