import fp from 'fastify-plugin'
import Validator from "../Core/Class/Validator";
import {JSONSchemaType} from "ajv";
import fastifyJwt = require('@fastify/jwt');
import Framework from "../Core/Framework";
export interface SupportPluginOptions {
    // Specify Support plugin options here
}

export default fp<SupportPluginOptions>(async (fastify, opts) => {

    await fastify.decorateRequest ('validate', function<schema> (data : any,rules : JSONSchemaType<schema>) {
        return (new Validator<schema>()).validate(data,rules);
    })
    await fastify.decorateRequest ('jwt', fastify.jwt);

    await fastify.decorateRequest('gate',async (gate : string,...args:any[]) => await Framework.Gate.check(gate,...args))

});


declare module 'fastify' {
    export interface FastifyRequest {
        validate<schema>(data : any,rules : JSONSchemaType<schema>): Validator<schema>,
        jwt : fastifyJwt.JWT,
        gate(gate : string,...args:any[]) : any,
    }

}
