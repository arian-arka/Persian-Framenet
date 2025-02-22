import {FastifyRequest} from "fastify";
import StoreTaggedSentenceValidation from "./Validation/StoreTaggedSentence.validation";
import {
    ChangeTaggedSentenceStatusInterface, EditTaggedSentenceInterface,
    PaginateTaggedSentenceInterface, PublishTaggedSentenceInterface,
    StoreTaggedSentenceInterface
} from "./TaggedSentence.interface";
import TaggedSentenceService from "./TaggedSentence.service";
import {TAGGED_SENTENCE_STATUS} from "./TaggedSentence.constant";
import TaggedSentenceEvent from "../../Event/TaggedSentence.event";
import SentenceService from "../Sentence/Sentence.service";
import InternalServerError from "../../Core/Response/500/InternalServerError";
import {SentenceInterface} from "../Sentence/Sentence.interface";
import ChangeTaggedSentenceStatusValidation from "./Validation/ChangeTaggedSentenceStatus.validation";
import ListTaggedSentenceValidation from "./Validation/ListTaggedSentence.validation";
import Unauthorized from "../../Core/Response/400/Unauthorized";
import UserService from "../User/User.service";
import {Types} from "mongoose";
import MessageClass from "../Message/Message.class";
import PublishTaggedSentenceValidation from "./Validation/PublishTaggedSentence.validation";
import EditTaggedSentenceValidation from "./Validation/EditTaggedSentence.validation";
import TaggedSentenceStatusEvent from "../../Event/TaggedSentenceStatus.event";
import FrameService from "../Frame/Frame.service";
import LexicalUnitService from "../LexicalUnit/LexicalUnit.service";
import {USER_PRIVILEGES} from "../User/User.contant";

export default class TaggedSentenceController {
    constructor() {
    }

    async store(request: FastifyRequest<{ Params?: { sentence?: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('TaggedSentence.store', user);

        const sentence = await SentenceService.findOrFail(request?.params?.sentence);

        const validation = await StoreTaggedSentenceValidation.forBody<StoreTaggedSentenceInterface>(request,sentence);

        const taggedSentence = await TaggedSentenceService.create({
            ...validation.data(),
            'words' : sentence.words,
            'sentence' : sentence._id,
            status : TAGGED_SENTENCE_STATUS['unchanged'],
            frameName : !!validation.data().frame ? ((await FrameService.find(validation.data().frame))?.name ?? null ) : null,
            lexicalUnitName : !!validation.data().lexicalUnit ? ((await LexicalUnitService.find(validation.data().lexicalUnit))?.name ?? null ) : null,
        })

        await TaggedSentenceEvent.fire({taggedSentence, user,isNew:true})

        return taggedSentence;
    }

    async edit(request: FastifyRequest<{ Params?: { taggedSentence?: string | null | undefined } }>) {
        const user = request.user;

        const taggedSentence = await TaggedSentenceService.findOrFail(request?.params?.taggedSentence );

        await request.gate('TaggedSentence.edit', user,taggedSentence);

        const validation = await EditTaggedSentenceValidation.forBody<EditTaggedSentenceInterface,SentenceInterface>(request,await SentenceService.find(taggedSentence.sentence as Types.ObjectId) as SentenceInterface);

        const updatedTaggedSentence = await TaggedSentenceService.updateAndGet(taggedSentence._id, {
            ...validation.data(),
            reviewer : null,
            issuer: user._id,
            status: TAGGED_SENTENCE_STATUS['waiting'],
            frameName : !!validation.data()?.frame ? ((await FrameService.find(validation.data().frame))?.name ?? null ) : null,
            lexicalUnitName : (!!validation.data()?.lexicalUnit && !!validation.data()?.frame) ? ((await LexicalUnitService.find(validation.data().lexicalUnit))?.name ?? null ) : null,
        })

        await TaggedSentenceEvent.fire({previousTaggedSentence:taggedSentence,'taggedSentence':updatedTaggedSentence, user})

        return await TaggedSentenceService.findFullOrFail(request?.params?.taggedSentence);
    }

    async publish(request: FastifyRequest<{ Params?: { taggedSentence?: string | null | undefined, } }>){
        const validation = await PublishTaggedSentenceValidation.forBody<PublishTaggedSentenceInterface>(request);
        const user = request.user;

        if(![TAGGED_SENTENCE_STATUS['published'],TAGGED_SENTENCE_STATUS['refused']].includes(validation.data().status))
            throw Unauthorized.forMessage('Cant publish with this status');

        const taggedSentence = await TaggedSentenceService.findOrFail(request?.params?.taggedSentence);

        await request.gate('TaggedSentence.status',user,validation.data().status,taggedSentence);

        const updatedTaggedSentence = await TaggedSentenceService.updateAndGet(taggedSentence._id,{
            status : validation.data().status,
            reviewer : user._id
        });

        if(!updatedTaggedSentence)
            throw InternalServerError.instance('Could not update');

        const issuedFor = await UserService.find(taggedSentence.issuer as Types.ObjectId);
        if(! (updatedTaggedSentence.issuer as Types.ObjectId).equals(updatedTaggedSentence.reviewer as Types.ObjectId))
            await MessageClass.forTaggedSentence(updatedTaggedSentence,user,{
                issuedFor ,
                message : validation.data().message
            })

        await TaggedSentenceStatusEvent.fire({'taggedSentence':updatedTaggedSentence, user,'previousStatus':taggedSentence.status})

        return updatedTaggedSentence;
    }

    async status(request: FastifyRequest<{ Params?: { taggedSentence?: string | null | undefined } }>) {
        const validation = await ChangeTaggedSentenceStatusValidation.forBody<ChangeTaggedSentenceStatusInterface>(request);

        if([TAGGED_SENTENCE_STATUS['published'],TAGGED_SENTENCE_STATUS['refused']].includes(validation.data().status))
            throw Unauthorized.forMessage('Cant publish with this status');

        const taggedSentence = await TaggedSentenceService.findOrFail(request?.params?.taggedSentence);

        await request.gate('TaggedSentence.status', request.user,validation.data().status,taggedSentence);

        const updatedTaggedSentence = await TaggedSentenceService.updateAndGet(taggedSentence._id, validation.data().status === TAGGED_SENTENCE_STATUS['unchanged'] ? {
            ...validation.data(),
            issuer : null,
            reviewer : null,
        } : validation.data())

        if (!updatedTaggedSentence)
            throw InternalServerError.instance('Could not edit the tagged Sentence.');

        await TaggedSentenceStatusEvent.fire({'taggedSentence':updatedTaggedSentence, user:request.user,'previousStatus':taggedSentence.status})

        return updatedTaggedSentence;
    }

    async destroy(request: FastifyRequest<{ Params?: { taggedSentence?: string | null | undefined } }>) {
        await request.gate('TaggedSentence.delete', request.user,);

        const taggedSentence = await TaggedSentenceService.findOrFail(request?.params?.taggedSentence );

        await TaggedSentenceEvent.fire({taggedSentence,user:request.user});

        await TaggedSentenceService.delete(taggedSentence._id);

        return taggedSentence;
    }

    async show(request: FastifyRequest<{ Params?: { taggedSentence?: string | null | undefined } }>){
        await request.gate('TaggedSentence.show',request.user);

        let taggedSentence = await TaggedSentenceService.findFullOrFail(request?.params?.taggedSentence);

        if(taggedSentence.status === TAGGED_SENTENCE_STATUS['unchanged'] && ( request.user.isSuperAdmin || request.user.privileges.includes(USER_PRIVILEGES['edit tagged sentence']))){
            await TaggedSentenceService.update(taggedSentence._id, {
                status : TAGGED_SENTENCE_STATUS['editing'],
                issuer: request.user._id,
            })
            const updatedTaggedSentence = await TaggedSentenceService.findFullOrFail(taggedSentence._id.toString());
            await TaggedSentenceStatusEvent.fire({'taggedSentence':updatedTaggedSentence, user:request.user,'previousStatus':taggedSentence.status})
            return updatedTaggedSentence;
        }

        return taggedSentence;
    }

    async list(request: FastifyRequest ) {
        const user = request.user;

        await request.gate('TaggedSentence.list',user);

        const validation = await ListTaggedSentenceValidation.forBody<PaginateTaggedSentenceInterface>(request);

        return await TaggedSentenceService.list({...validation.data() ,issuer:validation.data()?.issuer === '1' ? user._id.toString() : undefined});
    }
}