import {FastifyReply} from "fastify";

export default class Response<T> {

    protected _headers: { [key: string]: string } = {};

    protected _data: T | any = undefined;
    constructor() {

    }
    status(): number {
        return 200;
    }

    headers(): { [key: string]: any } {
        return this._headers;
    }

    data(): T {
        return this._data;
    }

    setHeader(key: string, value: any): Response<T> {
        this._headers[key] = value;
        return this;
    }

    getHeader(key: string): any {
        return key in this._headers ? this._headers[key] : undefined;
    }

    hasHeader(key: string, strict = false): boolean {
        if (strict)
            return (key in this._headers) && (this._headers[key] !== undefined && this._headers[key] !== null && this._headers[key] !== '');
        return key in this._headers;
    }

    setData(data: T): Response<T> {
        this._data = data;
        return this;
    }

    getData(): T {
        return this._data;
    }

    fastifyReply(reply: FastifyReply): FastifyReply {
        reply.status(this.status());

        reply.headers(this.headers());

        reply.send(this.data());

        return reply;
    }

    static instance<T = any>(...args: any[]): Response<T> | any {
        return new this<T>();
    }

}




