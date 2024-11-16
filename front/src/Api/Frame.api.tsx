import FrameInterface, {
    EditFrameInterface, FramePaginatedInterface,
    FullFrameInterface, PaginateFrameInterface,
    PublishFrameInterface,
    StoreFrameInterface
} from "../Type/Frame.interface";
import StoreFrameValidation from "../Validation/Frame/StoreFrame.validation";
import EditFrameValidation from "../Validation/Frame/EditFrame.validation";
import PublishFrameValidation from "../Validation/Frame/PublishFrame.validation";
import {FRAME_STATUS} from "../Constant/Frame";
import CsrfApi from "./Csrf.api";


class FrameApi extends CsrfApi {
    constructor() {
        super();
    }
    softDelete(frame:string,status:boolean) {
        return this._fetch({
            method: `PUT`,
            url: `/api/frame/softDelete/${frame}/${status ? 'true':'false'}`,
            headers: {"Content-Type": "application/json",},
            body: {},
        })
    }
    store(data: StoreFrameInterface) {
        return this._fetch<FrameInterface>({
            method: `POST`,
            url: `/api/frame/store`,
            body: data,
            headers: {"Content-Type": "application/json",},
            validation: StoreFrameValidation
        });
    }
    duplicate(frame:string) {
        return this._fetch<FrameInterface>({
            method: `POST`,
            url: `/api/frame/duplicate/${frame}`,
            body: {},
            headers: {"Content-Type": "application/json",},
        });
    }
    edit(frame:string,data: EditFrameInterface) {
        return this._fetch<FrameInterface>({
            method: `PUT`,
            url: `/api/frame/${frame}`,
            body: data,
            headers: {"Content-Type": "application/json",},
            validation: EditFrameValidation
        });
    }
    publish(frame:string,data : PublishFrameInterface){
        return this._fetch<FrameInterface>({
            method: `PUT`,
            url: `/api/frame/publish/${frame}`,
            body: data,
            headers: {"Content-Type": "application/json",},
            validation: PublishFrameValidation
        });
    }
    status(frame:string,status:number){
        return this._fetch<FrameInterface>({
            method: `PUT`,
            url: `/api/frame/status/${frame}`,
            body: {status},
            headers: {"Content-Type": "application/json",},
        });
    }
    changeStatusToEditing(frame:string){
        return this.status(frame,FRAME_STATUS['editing']);
    }
    changeStatusToUnchanged(frame:string){
        return this.status(frame,FRAME_STATUS['unchanged']);
    }
    changeStatusToWaiting(frame:string){
        return this.status(frame,FRAME_STATUS['waiting']);
    }
    delete(frame: string){
        return this._fetch<any>({
            method: `DELETE`,
            url: `/api/frame/${frame}`,
        });
    }
    full(frame: string){
        return this._fetch<FullFrameInterface>({
            method: `GET`,
            url: `/api/frame/${frame}`,
        });
    }
    inheritanceTree(){
        return this._fetch<any>({
            method: `GET`,
            url: `/api/tree/inheritance`,
        });
    }
    list(search : PaginateFrameInterface){
        return this._fetch<FramePaginatedInterface>({
            method:`POST`,
            url:`/api/frame/list`,
            headers: {"Content-Type": "application/json",},
            body:search
        })
    }
    withoutWaiting(name : string,lang = null){
        return this._fetch<FramePaginatedInterface>({
            method:`POST`,
            url:`/api/frame/list/withoutWaiting`,
            headers: {"Content-Type": "application/json",},
            body:{
                lang,
                name,
                page:1,
                limit:200,
                linkPerPage:1,
            }
        })
    }

    searchMirror(name : string,lang = null){
        return this._fetch<FramePaginatedInterface>({
            method:`POST`,
            url:`/api/frame/list`,
            headers: {"Content-Type": "application/json",},
            body:{
                lang,
                name,
                page:1,
                limit:200,
                linkPerPage:1,
            }
        })
    }
}

export default FrameApi;