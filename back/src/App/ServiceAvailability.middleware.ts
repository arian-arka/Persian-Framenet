import {FastifyReply, FastifyRequest} from "fastify";
import Middleware from "../Core/Class/Middleware";
import SettingService from "./Setting/Setting.service";
import ServiceUnavailable from "../Core/Response/500/ServiceUnavailable";

export class ServiceAvailability extends Middleware{
    constructor() {
        super();
    }
    async handle(request: FastifyRequest, reply: FastifyReply): Promise<any> {
        if(await SettingService.isSiteDown())
            throw ServiceUnavailable.instance('Site is down.');
    }
}

