import {FastifyRequest} from "fastify";
import StoreFrameValidation from "./Validation/StoreFrame.validation";
import FrameService from "./Frame.service";
import FrameInterface, {
    ChangeFrameStatusInterface,
    EditFrameInterface,
    PaginateFrameInterface, PublishFrameInterface,
    StoreFrameInterface
} from "./Frame.interface";
import {FRAME_STATUS} from "./Frame.contant";
import EditFrameValidation from "./Validation/EditFrame.validation";
import InternalServerError from "../../Core/Response/500/InternalServerError";
import FrameEvent from "../../Event/Frame.event";
import FrameDeletionEvent from "../../Event/FrameDeletion.event";
import ListFrameValidation from "./Validation/ListFrame.validation";
import ChangeFrameStatusValidation from "./Validation/ChangeFrameStatus.validation";
import Unauthorized from "../../Core/Response/400/Unauthorized";
import MessageClass from "../Message/Message.class";
import PublishFrameValidation from "./Validation/PublishFrame.validation";
import UserService from "../User/User.service";
import {Types} from "mongoose";
import FrameStatusEvent from "../../Event/FrameStatus.event";
import random from "../../Core/Singleton/Random";
import {USER_PRIVILEGES} from "../User/User.contant";

export default class FrameController {
    constructor() {
    }
    async duplicate(request: FastifyRequest<{ Params?: { frame?: string | null | undefined } }>) {
        const frame = await FrameService.findOrFail(request?.params?.frame);
        const user = request.user;

        await request.gate('Frame.softDelete', request.user,frame);

        await request.gate('Frame.store', user);

        const newFrame = await FrameService.duplicate(frame,`${new Date().getTime()}-${random.string(4)}`);

        await MessageClass.forFrame(newFrame,user,{
            createEditDelete : 'create'
        })

        await FrameEvent.fire({frame, user: user})

        return newFrame;
    }
    async store(request: FastifyRequest) {
        const user = request.user;

        await request.gate('Frame.store', user);

        const validation = await StoreFrameValidation.forBody<StoreFrameInterface>(request);

        const frame = await FrameService.create({...validation.data(),issuer : user._id});
        await MessageClass.forFrame(frame,user,{
            createEditDelete : 'create'
        })
        await FrameEvent.fire({frame, user: user})

        return frame;
    }
    async edit(request: FastifyRequest<{ Params?: { frame?: string | null | undefined } }>) {
        const user = request.user;
        await request.gate('Frame.edit', user);

        const frame = await FrameService.findOrFail(request?.params?.frame);

        await request.gate('Frame.softDelete', request.user,frame);

        const validation = await EditFrameValidation.forBody<EditFrameInterface,FrameInterface>(request,frame);

        const updatedFrame = await FrameService.updateAndGet(frame._id, {
            ...validation.data(),
            issuer: user._id,
            status: FRAME_STATUS['editing']
        })

        await MessageClass.forFrame(updatedFrame as FrameInterface,user,{
            createEditDelete : 'edit'
        })

        await FrameEvent.fire({'frame':updatedFrame, user})

        return updatedFrame;
    }
    async publish(request: FastifyRequest<{ Params?: { frame?: string | null | undefined, } }>){
        const validation = await PublishFrameValidation.forBody<PublishFrameInterface>(request);
        const user = request.user;

        if(![FRAME_STATUS['published'],FRAME_STATUS['refused']].includes(validation.data().status))
            throw Unauthorized.forMessage('Cant publish with this status');

        await request.gate('Frame.status',user,validation.data().status);

        const frame = await FrameService.findOrFail(request?.params?.frame);

        await request.gate('Frame.softDelete', request.user,frame);

        const updatedFrame = await FrameService.updateAndGet(frame._id,{status : validation.data().status});

        if(!updatedFrame)
            throw InternalServerError.instance('Could not update');

        const issuedFor = await UserService.find(frame.issuer as Types.ObjectId);
        if(! (frame.issuer as Types.ObjectId).equals(request.user._id as Types.ObjectId))
            await MessageClass.forFramePublish(updatedFrame,user,{
            issuedFor ,
            message : validation.data().message
        })

        await FrameStatusEvent.fire({'frame':updatedFrame, user,'previousStatus':frame.status});

        return updatedFrame
    }
    async status(request: FastifyRequest<{ Params?: { frame?: string | null | undefined } }>) {

        const validation = await ChangeFrameStatusValidation.forBody<ChangeFrameStatusInterface>(request);

        if([FRAME_STATUS['published'],FRAME_STATUS['refused']].includes(validation.data().status))
            throw Unauthorized.forMessage('Cant publish with this status');

        const frame = await FrameService.findOrFail(request?.params?.frame);

        await request.gate('Frame.softDelete', request.user,frame);

        await request.gate('Frame.status', request.user, frame,validation.data().status);

        const updatedFrame = await FrameService.updateAndGet(frame._id, validation.data().status === FRAME_STATUS['unchanged'] ? {
            issuer: null,
            ...validation.data()
        } :{...validation.data(),issuer : request.user._id})

        if (!updatedFrame)
                throw InternalServerError.instance('Could not edit the frame.');

        await FrameStatusEvent.fire({'frame':updatedFrame, user:request.user,'previousStatus':frame.status});

        return updatedFrame;
    }
    async softDelete(request: FastifyRequest<{ Params?: { frame?: string | null | undefined,status?: string | null | undefined } }>) {
        await request.gate('Frame.delete', request.user);
        const frame = await FrameService.findOrFail(request?.params?.frame);
        const shouldDelete = request.params?.status === 'true';
        const updatedFrame = await FrameService.updateAndGet(frame._id,{deletedAt:shouldDelete ? new Date() : null});
        await MessageClass.forFrame(updatedFrame as FrameInterface,request.user,{createEditDelete:'delete'});
        await FrameDeletionEvent.fire({'frame':updatedFrame,user:request.user,soft:shouldDelete});
        return {};
    }
    async destroy(request: FastifyRequest<{ Params?: { frame?: string | null | undefined } }>) {
        await request.gate('Frame.delete', request.user);
        const frame = await FrameService.findOrFail(request?.params?.frame);
        await MessageClass.forFrame(frame as FrameInterface,request.user,{createEditDelete:'delete'});
        await FrameDeletionEvent.fire({frame,user:request.user});
        await FrameService.delete(frame._id);
        return {};
    }
    async show(request: FastifyRequest<{ Params?: { frame?: string | null | undefined } }>){
        await request.gate('Frame.show',request.user);
        const frame = await FrameService.findFullOrFail(request?.params?.frame);
        await request.gate('Frame.softDelete', request.user,frame);
        return frame;
    }
    async list(request: FastifyRequest ) {
        const user = request.user;

        await request.gate('Frame.list',user);

        const validation = await ListFrameValidation.forBody<PaginateFrameInterface>(request);

        return await FrameService.list({...validation.data(),issuer:validation.data().issuer==='1' ? user._id.toString() : undefined},user.isSuperAdmin || user.privileges.includes(USER_PRIVILEGES['delete frame']));
    }
    async withoutWaiting(request: FastifyRequest ) {
        const user = request.user;

        await request.gate('Frame.list',user);

        const validation = await ListFrameValidation.forBody<PaginateFrameInterface>(request);

        return await FrameService.listWithoutWaiting({...validation.data(),issuer:validation.data().issuer==='1' ? user._id.toString() : undefined},user.isSuperAdmin || user.privileges.includes(USER_PRIVILEGES['delete frame']));
    }
}