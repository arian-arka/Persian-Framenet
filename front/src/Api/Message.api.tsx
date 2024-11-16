import Api from "../Core/Api/Api";
import {MessageInterface, MessagePaginatedInterface, PaginateMessageInterface} from "../Type/Message.interface";
import CsrfApi from "./Csrf.api";

export default class MessageApi extends CsrfApi {
    notifications(){
        return this._fetch<{
            messages : MessageInterface[],
            count : number,
        }>({
            method : 'GET',
            url : '/api/message/notifications'
        })
    }
    open(_id){
        return this._fetch<any>({
            method:'POST',
            body:{},
            url:`/api/message/open/${_id}`,
            headers: {"Content-Type": "application/json",},
        });
    }
    list(data : PaginateMessageInterface){
        return this._fetch<MessagePaginatedInterface>({
            method:'POST',
            url:`/api/message/list`,
            body : data,
            headers: {"Content-Type": "application/json",},
        });
    }
}