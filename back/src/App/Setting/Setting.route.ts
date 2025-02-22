import {FastifyReply, FastifyRequest} from "fastify";
import Route from "../../Core/Class/Route";
import SettingService from "./Setting.service";

export default Route.instance(function (route: Route) {
    route.get('/api/setting/setStatus/:token/:status', async (request: FastifyRequest<{
        Params: { token?: string, status?: string }
    }>, reply: FastifyReply) => {
        const token = process.env.SERVICE_UNAVAILABLE_TOKEN ?? '';
        if (!(!!token))
            return {ok: 'token is not set!.'};
        if (token !== request?.params?.token)
            return {ok: 'invalid'};
        if (!['true', 'false'].includes(request?.params?.status ?? ''))
            return {ok: 'invalid'};
        await SettingService.setSiteStatus(request?.params?.status === 'true')
        return {ok: true};
    }).make();
})