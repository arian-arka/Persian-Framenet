import {FastifyRequest} from "fastify";

import {
    EditLexicalUnitInterface, LexicalUnitInterface, PaginateLexicalUnitInterface, ReorderLexicalUnitInterface,
    StoreLexicalUnitInterface
} from "./LexicalUnit.interface";
import FrameService from "../Frame/Frame.service";
import EditLexicalUnitValidation from "./Validation/EditLexicalUnit.validation";
import StoreLexicalUnitValidation from "./Validation/StoreLexicalUnit.validation";
import LexicalUnitService from "./LexicalUnit.service";
import LexicalUnitEvent from "../../Event/LexicalUnit.event";
import LexicalUnitDeletionEvent from "../../Event/LexicalUnitDeletion.event";
import {Types} from "mongoose";
import BadRequest from "../../Core/Response/400/BadRequest";
import ReorderLexicalUnitValidation from "./Validation/ReorderLexicalUnit.validation";

import ListLexicalUnitValidation from "./Validation/ListLexicalUnit.validation";
import MessageClass from "../Message/Message.class";

export default class LexicalUnitController {
    constructor() {
    }

    async storeForTaggedSentence(request: FastifyRequest<{ Params?: { frame?: string | null | undefined } }>) {
        const user = request.user;
        await request.gate('TaggedSentence.editAndStore', user);

        const frame = await FrameService.findOrFail(request?.params?.frame);
        const validation = await StoreLexicalUnitValidation.forBody<StoreLexicalUnitInterface>(request, frame);

        const lexicalUnit = await LexicalUnitService.create({
            ...validation.data(),
            'frame': frame._id
        });
        await MessageClass.forLexicalUnit(lexicalUnit,user,{createEditDelete:'create'});
        await LexicalUnitEvent.fire({lexicalUnit, user})
        return lexicalUnit;
    }

    async store(request: FastifyRequest<{ Params?: { frame?: string | null | undefined } }>) {
        const user = request.user;
        await request.gate('LexicalUnit.store', user);

        const frame = await FrameService.findOrFail(request?.params?.frame);
        const validation = await StoreLexicalUnitValidation.forBody<StoreLexicalUnitInterface>(request,frame);

        const lexicalUnit = await LexicalUnitService.create({
            ...validation.data(),
            'frame': frame._id
        });
        await MessageClass.forLexicalUnit(lexicalUnit,user,{createEditDelete:'create'});
        await LexicalUnitEvent.fire({lexicalUnit, user});

        return lexicalUnit;
    }

    async edit(request: FastifyRequest<{ Params: { lexicalUnit: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('LexicalUnit.edit', user);

        const lexicalUnit = await LexicalUnitService.findOrFail(request.params.lexicalUnit);

        const validation = await EditLexicalUnitValidation.forBody<EditLexicalUnitInterface>(request, {
            frame: {_id: lexicalUnit.frame},
            lexicalUnit
        });

        const updatedLexicalUnit = await LexicalUnitService.updateAndGet(lexicalUnit._id, validation.data());
        await MessageClass.forLexicalUnit(updatedLexicalUnit as LexicalUnitInterface,user,{createEditDelete:'edit'});
        await LexicalUnitEvent.fire({'lexicalUnit': updatedLexicalUnit, user})

        return updatedLexicalUnit;
    }

    async destroy(request: FastifyRequest<{ Params: { lexicalUnit: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('LexicalUnit.delete', user);

        const lexicalUnit = await LexicalUnitService.findOrFail(request.params.lexicalUnit);
        await MessageClass.forLexicalUnit(lexicalUnit,user,{createEditDelete:'delete'});
        await LexicalUnitDeletionEvent.fire({lexicalUnit, user})

        await LexicalUnitService.delete(lexicalUnit._id);

        return {};
    }

    async show(request: FastifyRequest<{ Params: { lexicalUnit: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Frame.show', user);

        return await LexicalUnitService.findOrFail(request.params.lexicalUnit);
    }

    async search(request: FastifyRequest) {
        const user = request.user;

        await request.gate('Frame.show', user);

        const validation = await ListLexicalUnitValidation.forBody<PaginateLexicalUnitInterface>(request);

        return await LexicalUnitService.search(validation.data());
    }

    async list(request: FastifyRequest<{ Params: { frame: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Frame.show', user);

        const frame = await FrameService.findOrFail(request.params.frame);

        return await LexicalUnitService.sorted(frame._id);
    }

    async ofFrame(request: FastifyRequest<{ Params: { frame: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Frame.show', user);

        const frame = await FrameService.findOrFail(request.params.frame);

        return await LexicalUnitService.ofFrame(frame._id);
    }

    async forTagging(request: FastifyRequest<{ Params: { frame: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Frame.show', user);

        const frame = await FrameService.findOrFail(request.params.frame);

        return await LexicalUnitService.forTagging(frame._id);
    }


    async reorder(request: FastifyRequest) {
        const user = request.user;

        await request.gate('LexicalUnit.edit', user);

        const validation = await ReorderLexicalUnitValidation.forBody<ReorderLexicalUnitInterface>(request);

        const lexicalUnit = await LexicalUnitService.findOrFail(validation.data().lexicalUnit),
            after = await LexicalUnitService.find(validation.data().after);

        if (after && !(lexicalUnit.frame as Types.ObjectId).equals(after.frame as Types.ObjectId))
            throw BadRequest.forMessage('Irrelevant lexicalUnits.');

        await LexicalUnitService.reorder(lexicalUnit, after);
        await LexicalUnitEvent.fire({lexicalUnit, user});
        return {};
    }

    async annotation(request: FastifyRequest<{ Params: { lexicalUnit: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Frame.show', user);

        const lexicalUnit = await LexicalUnitService.findOrFail(request.params.lexicalUnit);

        const sentences = await LexicalUnitService.sentences(lexicalUnit._id);

        const frame = await FrameService.findFullOrFail(lexicalUnit.frame.toString());

        return {sentences, frame, lexicalUnit};
    }

}