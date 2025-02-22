import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import cookie from '@fastify/cookie';
import {FastifyRequest} from "fastify";

export interface SupportPluginOptions {
    // Specify Support plugin options here
}

export default fp<SupportPluginOptions>(async (fastify, opts) => {
    await  fastify.register(require('@fastify/cors'),(instance) => {
        return (req : FastifyRequest, callback : any) => {
            callback(null, {
                origin: true,
                credentials : true,
            })
        }
    })

    await fastify.register(fastifyJwt,{
        secret : process.env.JWT_TOKEN as string,
        cookie: {
            cookieName: 'token',
            signed : true,
        },
    });

    await  fastify.register(cookie)

    await fastify.register(require("@fastify/csrf-protection"),{
        cookieOpts:{signed: false}
    })


});


declare module 'fastify' {
    export interface FastifyInstance {
        csrfProtection(...args:any[]) : any,
    }


    export interface FastifyReply {
        generateCsrf(...args:any[]) : any,
    }
}



