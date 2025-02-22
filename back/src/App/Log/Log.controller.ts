import {FastifyRequest} from "fastify";
import ListLogValidation from "./Validation/ListLog.validation";
import {PaginateAllLogInterface} from "./Log.interface";
import LogService from "./Log.service";

export default class LogController {
    constructor() {
    }

    async list(request: FastifyRequest) {
        const validation = await ListLogValidation.forBody<PaginateAllLogInterface>(request);

        return await LogService.list(validation.data());
    }
}