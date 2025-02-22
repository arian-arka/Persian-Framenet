import {FastifyReply, FastifyRequest} from "fastify";

export default abstract class Middleware{
    static make() : Function{
        return async (request : FastifyRequest,reply : FastifyReply) => {
            const f = await (new (this as any)).handle(request,reply)
            console.log('ffffffffffffffffffffff',f)
            return ;
        }
    }
    abstract handle(request : FastifyRequest,reply : FastifyReply) : Promise<any>;

}