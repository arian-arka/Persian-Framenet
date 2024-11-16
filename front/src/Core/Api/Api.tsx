import {BadRequest} from "./Response/BadRequest";
import {InternalServerError} from "./Response/InternalServerError";
import {NetworkError} from "./Response/NetworkError";
import {Redirect} from "./Response/Redirect";
import {Schema} from "yup";
import Request from "./Request";
import {Ok} from "./Response/Ok";
import Config from "../../Config";
import Response from "./Response/Response";
import {useToast} from "../../Component/Toast";
import {useLocalData} from "../LocalData";

interface ForeverType<ResponseSchema> {
    ok(r: Ok<ResponseSchema>): void,

    bad?(r: BadRequest): void,

    tooManyRequests?(r: BadRequest): void,

    unAuthenticated?(r: BadRequest): void,

    forbidden?(r: BadRequest): void,

    notFound?(r: BadRequest): void,

    redirect?(r: Redirect): void,

    internalServerError?(r: InternalServerError): void,

    networkError?(r: NetworkError): undefined | boolean,

    def?(r: Response<any>): undefined | boolean,
}

export default class Api {
    protected navigation;
    protected baseUrl;
    protected toast;
    protected localData;

    protected csrf;

    constructor(csrf) {
        this.baseUrl = Config.baseUrl;
        this.csrf = csrf;
        console.log('csrf1',csrf);
        this.toast = useToast();
        this.localData = useLocalData();
    }

    _badRequest(response: BadRequest) {

        // if (response.status === 429)
        //     this.toast.warning(Language.get('toast.tooManyRequests'))
        // else if (response.status === 404)
        //     (useNavigate())(Config.notFoundUrl);
        // else if (response.status === 401){
        //     Log.success('asdfasfsdfs',this.localData.localData());
        //     this.localData.remove('email');
        // }
        // else if (response.status === 403)
        //     this.toast.warning(Language.get('toast.forbidden'))
    }

    _internalServerError(response: InternalServerError) {

    }

    _networkError(response: NetworkError) {

    }

    _redirect(response: Redirect) {
        // this.navigation(response.url());
    }

    _fetch<ResponseSchema>(options: {
        method: string,
        headers?: any,
        url: string,
        body?: any,
        validation?: {
            schema: Schema,
            custom?: Function
        }
    }): {
        fetch(): Promise<Ok<ResponseSchema>>,
        forever(props: ForeverType<ResponseSchema>): Promise<any>,
    } {
        const fetch = async (): Promise<Ok<ResponseSchema>> => {
            try {
                const csrf = await this.csrf();
                if(!(!!csrf))
                    throw new BadRequest(new Headers,419,{errors:{'csrf':'خطا در ارزیابی کاربر.'}},false);
                return await (
                    Request.forUrl<ResponseSchema>(options.url)
                        .baseUrl(this.baseUrl)
                        .setMethod(options.method)
                        .setHeaders({...options?.headers ?? {},'x-csrf-token' : csrf})
                        //.setHeaders({...options?.headers ?? {}})
                        .setBody(options?.body)
                )
                    .make(options.validation);
            } catch (e) {
                console.log(e);
                if (e instanceof BadRequest)
                    this._badRequest(e);
                else if (e instanceof InternalServerError)
                    this._internalServerError(e);
                else if (e instanceof NetworkError)
                    this._networkError(e);
                else if (e instanceof Redirect)
                    this._redirect(e);
                throw e;
            }
        }

        const forever : any = async (props: ForeverType<ResponseSchema>, maxRefresh = 5) => {
            if(maxRefresh === 0)
                return undefined;
            try{
                const _r = await fetch();
                props.ok(_r);
            }catch (e) {
                if (e instanceof BadRequest) {
                    if (e.status === 403 && props?.forbidden) props.forbidden(e);
                    else if (e.status === 401 && props?.unAuthenticated) props.unAuthenticated(e);
                    else if (e.status === 404 && props?.notFound) props.notFound(e);
                    else if (e.status === 400 && props?.bad) props.bad(e);
                    else if (e.status === 429 && props?.tooManyRequests) props.tooManyRequests(e);
                    else if (props.def) props.def(e);
                    else this._badRequest(e);
                    throw (new NetworkError(new Error('خطا در شبکه')));
                } else if (e instanceof InternalServerError)
                    return await forever(props,maxRefresh-1);
                else if (e instanceof NetworkError)
                    return await forever(props,maxRefresh-1);
            }
            return undefined;
        }

        return {fetch, forever};
    }

}

//429 tooManyRequests

export function isUnauthenticated(e: any): boolean {
    return e instanceof BadRequest && e.status === 401;
}

export function isBadRequest(e: any): boolean {
    return e instanceof BadRequest && e.status === 400;
}

export function isUnauthorized(e: any): boolean {
    return e instanceof BadRequest && e.status === 403;
}
