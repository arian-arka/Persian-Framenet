import fp from 'fastify-plugin'
export default fp(async (fastify, opts) => {
    await fastify.register(require('./plugins'));
    await fastify.register(require('./decorators'));
    await fastify.register(require('./hooks'));

});

