import MessageService from "./Message.service";
import UserInterface from "../User/User.interface";
import {MESSAGE_FOR} from "./Message.constants";
import FrameInterface from "../Frame/Frame.interface";
import {TaggedSentenceInterface} from "../TaggedSentence/TaggedSentence.interface";
import SentenceService from "../Sentence/Sentence.service";
import Framework from "../../Core/Framework";
import {FRAME_STATUS} from "../Frame/Frame.contant";
import {TAGGED_SENTENCE_STATUS} from "../TaggedSentence/TaggedSentence.constant";
import {LexicalUnitInterface} from "../LexicalUnit/LexicalUnit.interface";
import UserService from "../User/User.service";
import {ElementInterface} from "../Element/Element.interface";
import FrameService from "../Frame/Frame.service";
import {Types} from "mongoose";

export default class MessageClass {
    static async forFrame(frame: FrameInterface, user: UserInterface, data: {
        issuedFor?: UserInterface | null | undefined,
        message?: string,
        createEditDelete: 'create'|'edit'|'delete',
    }) {
        const w = data.createEditDelete === 'create' ? 'ساخت' : (data.createEditDelete === 'edit' ? 'ویرایش' : 'حذف');
        const users = await UserService._model.find({'_id': {'$ne': user._id}}).limit(30).exec();
        for (let u of users)
            await MessageService.create({
                ...data,
                issuer: user?._id ?? null,
                isFor: MESSAGE_FOR['frame'],
                ref: frame._id,
                refText: `${frame.name}(${frame.lang}) : ${w} قالب معنایی`,
                issuedFor: u._id
            });
    }

    static async forElement(element: ElementInterface, user: UserInterface, data: {
        issuedFor?: UserInterface | null | undefined,
        message?: string,
        createEditDelete: 'create'|'edit'|'delete',
    }) {
        const frame = await FrameService.find(element.frame as Types.ObjectId);
        const w = data.createEditDelete === 'create' ? 'ساخت' : (data.createEditDelete === 'edit' ? 'ویرایش' : 'حذف');
        const users = await UserService._model.find({'_id': {'$ne': user._id}}).limit(30).exec();
        for (let u of users)
            await MessageService.create({
                ...data,
                issuer: user?._id ?? null,
                isFor: MESSAGE_FOR['element'],
                ref: element._id,
                refText: `${element.name}(${frame?.name}) : ${w} جزء معنایی `,
                issuedFor: u._id
            });
    }

    static async forLexicalUnit(lexicalUnit: LexicalUnitInterface, user: UserInterface, data: {
        issuedFor?: UserInterface | null | undefined,
        message?: string,
        createEditDelete: 'create'|'edit'|'delete',
    }) {
        const frame = await FrameService.find(lexicalUnit.frame as Types.ObjectId);
        const w = data.createEditDelete === 'create' ? 'ساخت' : (data.createEditDelete === 'edit' ? 'ویرایش' : 'حذف');
        const users = await UserService._model.find({'_id': {'$ne': user._id}}).limit(30).exec();
        for (let u of users)
            await MessageService.create({
                ...data,
                issuer: user?._id ?? null,
                isFor: MESSAGE_FOR['lexicalUnit'],
                ref: lexicalUnit._id,
                refText: `${lexicalUnit.name}(${frame?.name}) : ${w} واحد واژگانی `,
                issuedFor: u._id
            });
    }

    static async forFramePublish(frame: FrameInterface, user: UserInterface, data: {
        issuedFor?: UserInterface | null | undefined,
        message?: string
    }) {
        return await MessageService.create({
            ...data,
            issuer: user?._id ?? null,
            isFor: MESSAGE_FOR['frame'],
            ref: frame._id,
            refText: `${frame.name}(${frame.lang}) : ${Framework.Language.generate(`frame.status.${Object.keys(FRAME_STATUS)[Object.values(FRAME_STATUS).indexOf(frame.status)]}`)}`
        });
    }

    static async forTaggedSentence(taggedSentence: TaggedSentenceInterface, user: UserInterface, data: {
        issuedFor?: UserInterface | null | undefined,
        message?: string
    }) {
        const sentence = await SentenceService.findOrFail(taggedSentence.sentence?._id ?? taggedSentence.sentence);
        return await MessageService.create({
            ...data,
            issuer: user?._id ?? null,
            isFor: MESSAGE_FOR['taggedSentence'],
            ref: taggedSentence._id,
            refText: `${sentence.words} : ${Framework.Language.generate(`taggedSentence.status.${Object.keys(TAGGED_SENTENCE_STATUS)[Object.values(TAGGED_SENTENCE_STATUS).indexOf(taggedSentence.status)]}`)}`
        });
    }
}