import {FastifyRequest} from "fastify";
import MessageService from "./Message.service";
import ListMessagesValidation from "./Validation/ListMessages.validation";
import {PaginateMessageInterface} from "./Message.interface";
import {Types} from "mongoose";
import Unauthorized from "../../Core/Response/400/Unauthorized";

export default class MessageController{
    constructor() {
    }

    async notifications(request : FastifyRequest){
        return {
            messages : await MessageService.notifications(request.user._id,5),
            count : await MessageService.unreadCount(request.user._id),
        }
    }
    async list(request : FastifyRequest){
        const validation = await ListMessagesValidation.forBody<PaginateMessageInterface>(request);
        await MessageService.makeSeen(request.user._id);
        return await MessageService.list(validation.data(),request.user._id);
    }

    async open(request: FastifyRequest<{ Params?: { message?: string | null | undefined } }>){
        const message = await MessageService.findOrFail(request?.params?.message);
        if(request.user._id.toString() !== (message.issuedFor as Types.ObjectId).toString())
            throw Unauthorized.forMessage('');
        await MessageService.update(message._id,{'openedAt' : new Date()});
        return {};
    }

}