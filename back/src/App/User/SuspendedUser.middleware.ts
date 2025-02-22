import {FastifyReply, FastifyRequest} from "fastify";
import Unauthorized from "../../Core/Response/400/Unauthorized";
import Middleware from "../../Core/Class/Middleware";


export class SuspendedUser extends Middleware{
    constructor() {
        super();
    }
    async handle(request: FastifyRequest, reply: FastifyReply): Promise<any> {
        if(!!request.user?.suspendedAt)
            throw Unauthorized.forMessage('Suspended');
    }
}

