import {FastifyRequest} from "fastify";
import StoreElementValidation from "./Validation/StoreElement.validation";
import {
    EditElementInterface,
    ElementInterface,
    ReorderElementInterface,
    StoreElementInterface
} from "./Element.interface";
import FrameService from "../Frame/Frame.service";
import ElementService from "./Element.service";
import ElementEvent from "../../Event/Element.event";
import ElementDeletionEvent from "../../Event/ElementDeletion.event";
import EditElementValidation from "./Validation/EditElement.validation";
import ReorderElementValidation from "./Validation/ReorderElement.validation";
import {Types} from "mongoose";
import BadRequest from "../../Core/Response/400/BadRequest";
import MessageClass from "../Message/Message.class";

export default class ElementController {
    constructor() {
    }
    async store(request: FastifyRequest<{ Params?: { frame?: string | null | undefined } }>) {
        const user = request.user;
        await request.gate('Element.store', user);

        const frame = await FrameService.findOrFail(request?.params?.frame);

        const validation = await StoreElementValidation.forBody<StoreElementInterface>(request);

        const element = await ElementService.create({
            ...validation.data(),
            'frame' : frame._id
        });
        await MessageClass.forElement(element,user,{createEditDelete:'create'});
        await ElementEvent.fire({element , user})

        return element;
    }
    async edit(request: FastifyRequest<{ Params?: { element?: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Element.edit', user);

        const element = await ElementService.findOrFail(request?.params?.element);

        const validation = await EditElementValidation.forBody<EditElementInterface>(request);

        const updatedElement = await ElementService.updateAndGet(element._id,validation.data());
        await MessageClass.forElement(updatedElement as ElementInterface,user,{createEditDelete:'edit'});
        await ElementEvent.fire({'element' : updatedElement , user})

        return updatedElement;
    }
    async destroy(request: FastifyRequest<{ Params?: { element?: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Element.delete', user);

        const element = await ElementService.findOrFail(request?.params?.element);
        await MessageClass.forElement(element as ElementInterface,user,{createEditDelete:'delete'});
        await ElementDeletionEvent.fire({element , user})

        await ElementService.delete(element._id);

        return {};
    }
    async show(request: FastifyRequest<{ Params?: { element?: string | null | undefined } }>){
        const user = request.user;
        await request.gate('Frame.show', user);
        return await ElementService.findOrFail(request?.params?.element);
    }
    async list(request: FastifyRequest<{ Params?: { frame?: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Frame.show',user);

        const frame = await FrameService.findOrFail(request?.params?.frame);

        return await ElementService.sorted(frame._id);
    }

    async reorder(request: FastifyRequest){
        const user = request.user;

        await request.gate('Element.edit', user);

        const validation = await ReorderElementValidation.forBody<ReorderElementInterface>(request);

        const element = await ElementService.findOrFail(validation.data().element),
            after = await ElementService.find(validation.data().after);

        if(after && !(element.frame as Types.ObjectId).equals(after.frame as Types.ObjectId))
            throw BadRequest.forMessage('Irrelevant elements.');

        await ElementService.reorder(element,after);

        await ElementEvent.fire({'element' : element , user})

        return {};

    }
}