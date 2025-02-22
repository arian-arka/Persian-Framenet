import {FastifyRequest} from "fastify";

import FrameService from "../Frame/Frame.service";
import StoreFrameRelationValidation from "./Validation/StoreFrameRelation.validation";
import {StoreFrameRelationInterface} from "./FrameRelation.interface";
import FrameRelationService from "./FrameRelation.service";

export default class FrameRelationController {
    constructor() {
    }

    async store(request: FastifyRequest) {
        const user = request.user;

        await request.gate('Frame.edit', user);

        const validation = await StoreFrameRelationValidation.forBody<StoreFrameRelationInterface>(request);

        return await FrameRelationService.create(validation.data());
    }

    async edit(request: FastifyRequest<{ Params: { relaiton: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Frame.edit', user);

        const relation = await FrameRelationService.findOrFail(request.params.relaiton);

        const validation = await StoreFrameRelationValidation.forBody<StoreFrameRelationInterface>(request);

        return await FrameRelationService.updateAndGet(relation._id, validation.data());
    }

    async destroy(request: FastifyRequest<{ Params: { relaiton: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Frame.edit', user);

        const relation = await FrameRelationService.findOrFail(request.params.relaiton);

        await FrameRelationService.delete(relation._id);

        return {};
    }

    async show(request: FastifyRequest<{ Params: { relaiton: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Frame.edit', user);

        return await FrameRelationService.findOrFail(request.params.relaiton);
    }

    async list(request: FastifyRequest<{ Params: { frame: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Frame.show', user);

        const frame = await FrameService.findOrFail(request.params.frame);

        return await FrameRelationService.all({frame: frame._id});
    }
}