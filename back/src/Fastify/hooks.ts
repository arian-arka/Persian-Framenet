import Framework from "../Core/Framework";
import fp from 'fastify-plugin'

export interface SupportPluginOptions {
    // Specify Support plugin options here
}

export default fp<SupportPluginOptions>(async (fastify, opts) => {

    fastify.addHook('onClose',async () => await Framework.Connection.closeAll());

});

declare module 'fastify' {
    export interface FastifyInstance {}
}
