import Route from "../Core/Class/Route";
import {FastifyReply, FastifyRequest} from "fastify";
import ReportClass from "./Report/Report.class";

export default Route.instance(function (route: Route) {
    route.get('/api/csrf', async (request: FastifyRequest, reply: FastifyReply) => {
        return await reply.generateCsrf();
    }).make();
    route.get('/api/test1', async (request: FastifyRequest, reply: FastifyReply) => {
        const users = [
            '6483770c5573c95c1be3f17f',
            '6483770c5573c95c1be3f180',
            '6483770d5573c95c1be3f184',
            '6483770d5573c95c1be3f186',
            '6483770e5573c95c1be3f18a',
        ];
        return await ReportClass.waitingTaggedSentencesOfLogs(100,users);
    }).make();
})