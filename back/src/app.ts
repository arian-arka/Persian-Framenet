import {AutoloadPluginOptions} from '@fastify/autoload';
import {FastifyError, FastifyPluginAsync, FastifyReply, FastifyRequest} from 'fastify';
import Framework from "./Core/Framework";
import Route, {GlobalRouteMiddleware} from "./Core/Class/Route";
import Response from "./Core/Class/Response";
import InternalServerError from "./Core/Response/500/InternalServerError";
import * as fastifyStatic from "@fastify/static";
import Path from "./Core/Singleton/Path";
import SettingService from "./App/Setting/Setting.service";


export type AppOptions = {
    // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;


// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {


    //fastify plugins,decorators,hooks,...
    await fastify.register(require('./Fastify/index'));

    //framework
    await Framework.needsFastify(fastify);

    //handling errors
    function unhandledErrors(error: FastifyError, reply: FastifyReply) {
        console.log('< ------------------ ERROR ------------------ >')
        console.log('* Unhandled error : ');
        console.log(error);
        console.log('< ------------------ ERROR ------------------ >');
        fastify.log.error(error);
        InternalServerError.instance('Internal server error').fastifyReply(reply);
    }

    fastify.setErrorHandler(function (error: any | FastifyError, request: FastifyRequest, reply: FastifyReply) {
        if (error instanceof Response) {
            console.log('< ------------------ CUSTOM ERROR ------------------ >')
            console.log('* response : ');
            console.log(error);
            console.log('< ------------------ CUSTOM ERROR ------------------ >');

            error.fastifyReply(reply)
        } else if (error.code === "FST_CSRF_INVALID_TOKEN")
            reply.status(419).send("csrf mismatch");
        else
            unhandledErrors(error, reply);
    })

    await fastify.register(fastifyStatic, {
        root: Path.srcPath('../public',),
        //root: Path.srcPath('../public',),
        prefix: '/', // optional: default '/',
    })
    //bootstrap routes

    GlobalRouteMiddleware.add((request: FastifyRequest, reply: FastifyReply, done: any) => {
        console.log(request.method);
        if (!['GET', 'HEAD'].includes(request.method))
            return fastify.csrfProtection(request, reply, done);
        done();
    });


    await Route.readAll(fastify);


    await fastify.setNotFoundHandler(async (req, res) => {
        if (await SettingService.isSiteDown())
            res.status(503).send('Service unavailable');
        else res.sendFile('index.html');
        await res;
    })

};

export default app;

export {app, options}
