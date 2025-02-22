import {FastifyInstance, FastifyPluginAsync} from "fastify";
import Framework from "../Framework";
import Loader from "../Singleton/Loader";
import Path from "../Singleton/Path";
export class SingleRoute{
    prefix: string = '';

    private _data: {
        url: string,
        method: string,
        handler: Function | undefined,
        preHandler: (Function)[]
    } = {
        'url': '',
        'method': 'GET',
        'handler': undefined,
        'preHandler': []
    };

    constructor(fastify: FastifyInstance) {
        this._fastify = fastify;
    }

    private _fastify: FastifyInstance;

    method(name: string): SingleRoute {
        this._data.method = name;
        return this;
    }

    url(address: string): SingleRoute {
        this._data.url = address;
        return this;
    }
    handler(handler: string | [string, string] | Function): SingleRoute {
        this._data.handler = Framework.Controller.generateFastifyHandler(handler);
        return this;
    }

    middleware(handlers: Function | Function []): SingleRoute {
        if(Array.isArray(handlers))
            this._data.preHandler = [...this._data.preHandler, ...handlers];
        else
            this._data.preHandler = [...this._data.preHandler, handlers];
        return this;
    }

    make(): void {
        //console.log(`making(${this.prefix}${this._data.url})`, this._data);
        // @ts-ignore
        this._fastify.route(this._data);
    }


}

export default class Route{
    _addPrefix (p : string) : Route{this.__prefix=p;return this;};

    private __prefix: string = '';
    private _prefix: string = '';

    private _middlewares: (Function)[] = [];

    private _fastify: FastifyInstance;
    public fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this._fastify = fastify;
        this.fastify = fastify;
    }
    middleware(handlers:  Function | Function[]): Route {
        if(Array.isArray(handlers))
            this._middlewares = [...this._middlewares,...handlers];
        else
            this._middlewares = [...this._middlewares,handlers];
        return this;
    }

    group(callback: Function) {

        const isAsync = callback.constructor.name === 'AsyncFunction';
        const prefix = this._prefix;
        const outSide = this;
        if (isAsync) {
            this._fastify.register(async function (app, _) {
                return await callback((new Route(app)).middleware(outSide._middlewares)._addPrefix(outSide.__prefix))
            }, (prefix.length > 0) ? {prefix} : {})
        } else {
            this._fastify.register(function (app, _, done) {
                callback((new Route(app)).middleware(outSide._middlewares)._addPrefix(outSide.__prefix))
                done();
            }, (prefix.length > 0) ? {prefix} : {})
        }

    }

    prefix(prefix: string): Route {
        this._prefix = prefix;
        this.__prefix += prefix;
        return this;
    }

    callMethod(method: string, url: string, handler: string | [string, string] | Function): SingleRoute {
        const r = (new SingleRoute(this._fastify)).method(method).url(url).middleware(this._middlewares).handler(handler);
        r.prefix = this.__prefix;

        return r;
    }

    get(url: string, handler: string |[string, string] | Function): SingleRoute {
        return this.callMethod('GET', url, handler);
    }
    post(url: string, handler: string |[string, string] | Function): SingleRoute {
        return this.callMethod('POST', url, handler);
    }

    put(url: string, handler: string |[string, string] | Function): SingleRoute {
        return this.callMethod('PUT', url, handler);
    }
    delete(url: string, handler: string |[string, string] | Function): SingleRoute {
        return this.callMethod('DELETE', url, handler);
    }

    static instance(routes: Function) {
        const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
           await routes((new Route(fastify)).middleware(GlobalRouteMiddleware.all()));
        }
        return root;
    }

    static readAll(fastify : FastifyInstance){
        Loader.js(Path.appPath(),(name:string, ext:string, newDir: string) => {
            fastify.register(require(newDir))
        },'route');
    }
}

export class GlobalRouteMiddleware{
    static _globalMiddleware: (Function)[] = [];
    static add(handlers: Function | Function[]) {
        if(Array.isArray(handlers))
            GlobalRouteMiddleware._globalMiddleware = [...GlobalRouteMiddleware._globalMiddleware,...handlers];
        else
            GlobalRouteMiddleware._globalMiddleware = [...GlobalRouteMiddleware._globalMiddleware,handlers];

        return GlobalRouteMiddleware;
    }

    static all(): (Function)[] {
        return GlobalRouteMiddleware._globalMiddleware;
    }
}