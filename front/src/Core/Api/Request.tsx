import {Schema} from "yup";
import Log from "../Log";
import {Ok} from "./Response/Ok";
import {BadRequest} from "./Response/BadRequest";
import {InternalServerError} from "./Response/InternalServerError";
import {Redirect} from "./Response/Redirect";
import {NetworkError} from "./Response/NetworkError";
import Response from "./Response/Response";

export default class Request<ResponseSchema> {
    private _baseUrl: string | undefined = undefined;

    private _preventQueryParameterBinding: boolean = false;

    private _url: string;

    private _headers: { [key: string]: any } = {};

    private _body: any;

    private _method: string = 'GET';

    private _cache: string = 'no-cache';

    constructor(url: string) {
        this._url = url;
    }

    static forUrl<ResponseSchema>(url: string): Request<ResponseSchema> {
        return new Request<ResponseSchema>(url);
    }

    static get<ResponseSchema>(url: string): Request<ResponseSchema> {
        return Request.forUrl<ResponseSchema>(url).setMethod('GET');
    }

    static post<ResponseSchema>(url: string): Request<ResponseSchema> {
        return Request.forUrl<ResponseSchema>(url).setMethod('POST');
    }

    static put<ResponseSchema>(url: string): Request<ResponseSchema> {
        return Request.forUrl<ResponseSchema>(url).setMethod('PUT');
    }

    static delete<ResponseSchema>(url: string): Request<ResponseSchema> {
        return Request.forUrl<ResponseSchema>(url).setMethod('DELETE');
    }

    setMethod(method: string): Request<ResponseSchema> {
        this._method = method.toUpperCase();
        return this;
    }

    setCache(cache: string): Request<ResponseSchema> {
        this._cache = cache;
        return this;
    }

    setUrl(url: string): Request<ResponseSchema> {
        this._url = url;
        return this;
    }

    setHeader(key: string, value: any): Request<ResponseSchema> {
        this._headers[key] = value;
        return this;
    }

    preventQueryParameterBinding(prevent: boolean = true): Request<ResponseSchema> {
        this._preventQueryParameterBinding = prevent;
        return this;
    }

    baseUrl(base: string | undefined): Request<ResponseSchema> {
        this._baseUrl = base;
        return this;
    }

    setHeaders(headers: { [key: string]: any }): Request<ResponseSchema> {
        this._headers = {...this._headers, ...headers};
        return this;
    }

    setBody(body: any): Request<ResponseSchema> {
        this._body = body;
        return this;
    }

    url(): string {
        return this._url;
    }

    headers(): { [key: string]: any } {
        return this._headers;
    }

    body(): any {
        return this._body;
    }

    cache(): string {
        return this._cache;
    }

    method(): string {
        return this._method;
    }

    gatherOptions() {
        const options: any = {
            method: this.method(),
            headers: this.headers(),
            cache: this.cache(),
            credentials: 'same-origin',
            // credentials: 'include',
        };
        const url = new URL(this.url(), this._baseUrl);

        if (this._method.toLowerCase() !== 'get' && this._method.toLowerCase() !== 'head') {
            if (!(this.body() instanceof FormData)) {
                    if (this.body() !== undefined && this.body() !== null && this.body() !== '')
                        options['body'] = JSON.stringify(this.body());
            } else
                options['body'] = this.body();
        } else if (!this._preventQueryParameterBinding && typeof this.body() === 'object') {
            const parameters = this.body();
            for (let key in parameters)
                url.searchParams.set(key, parameters[key]);
        }
        return {options, 'url': url.toString()};
    }

    async validate(schema: Schema, customValidation: Function | undefined = undefined): Promise<boolean | { key: string, message: string }> {
        return schema.validate(this.body()).then(async () => {
            if (typeof customValidation === 'function')
                return await customValidation(this.body());
            return true;
        }).catch(function (err) {
            return {
                key: err.path,
                message: 'params' in err ? err.message : err.message.substring(err.message.indexOf(err.path) + err.path.length).trim(),
            };
        });
    }

    async make(validation: undefined | { schema: Schema, custom?: Function } = undefined): Promise<Ok<ResponseSchema>> {
        if (validation) {
            const validator = await this.validate(validation.schema, validation?.custom);
            if (typeof validator === 'object') {
                const res = new BadRequest(new Headers, 400, {
                    message: validator.message,
                    data: {},
                    errors: {[validator.key]: validator.message,}
                }, false);
                res.isRealRequest = false;
                throw res;
            }
            this._body = validation.schema.cast(this._body);
        }

        const all = this.gatherOptions();

        console.log(`Making ${all.url.toString()}`, all.options);

        try {
            const res = await fetch(all.url.toString(), all.options);
            const jsonBody = await res.json();
            const status = res.status;
            if (status > 499) throw new InternalServerError(res.headers, res.status, jsonBody);
            else if (status > 399) throw new BadRequest(res.headers, res.status, jsonBody);
            else if (status > 299) throw new Redirect(res.headers, res.status, await res.url);
            else if (status > 199) {
                return new Ok<ResponseSchema>(res.headers, res.status, jsonBody);
            } else throw new InternalServerError(res.headers, res.status, undefined);

        } catch (e) {
            if (e instanceof Response)
                throw e;
            throw new NetworkError(e as Error);
        }
    }


}

