import {MongooseService} from "../../Core/Class/MongooseService";
import {
    FullTaggedSentenceInterface,
    PaginateTaggedSentenceInterface,
    TaggedSentenceInterface
} from "./TaggedSentence.interface";
import {TaggedSentenceModel} from "./TaggedSentence.model";
import MessageService from "../Message/Message.service";
import {Types} from "mongoose";
import {TAGGED_SENTENCE_STATUS} from "./TaggedSentence.constant";
import FrameService from "../Frame/Frame.service";
import LexicalUnitService from "../LexicalUnit/LexicalUnit.service";
import ElementService from "../Element/Element.service";
import SentenceService from "../Sentence/Sentence.service";
/*import {UserModel} from "../User/User.model";
import {LexicalUnitModel} from "../LexicalUnit/LexicalUnit.model";
import {FrameModel} from "../Frame/Frame.model";*/
import UserService from "../User/User.service";
import Str from "../../Core/Singleton/Str";

export default new class TaggedSentenceService extends MongooseService<TaggedSentenceInterface> {
    constructor() {
        super(TaggedSentenceModel);
    }

    async deleteForSentence(sentence: string | Types.ObjectId) {
        return await this.deleteMany({sentence});
    }

    async findFullOrFail(_id: string | null | undefined): Promise<FullTaggedSentenceInterface> {
        let taggedSentence: any = await this.findOrFail(_id);
        let data: any = taggedSentence.toObject();

        const frame = taggedSentence.frame ? await FrameService.find(taggedSentence.frame.toString()) : null;
        const lexicalUnit = taggedSentence.lexicalUnit ? await LexicalUnitService.find(taggedSentence.lexicalUnit.toString()) : null;
        data.frame = frame;
        data.issuer = taggedSentence.issuer ? await UserService.find(taggedSentence.issuer.toString()) : null;
        data.reviewer = taggedSentence.reviewer ? await UserService.find(taggedSentence.reviewer.toString()) : null;
        data.lexicalUnit = lexicalUnit;
        const newTags = [];
        for (let index in taggedSentence.frameNetTags) {
            const tag = taggedSentence.frameNetTags[index];
            if (tag.element) {
                const el = await ElementService.find(tag.element.toString());
                newTags.push({
                    tagType: tag.tagType,
                    element: el
                })
            } else newTags.push(tag);
        }
        data.sentence = await SentenceService.find(taggedSentence.sentence.toString());
        data.frameNetTags = newTags;
        data.message = await MessageService.messageOfTaggedSentence(taggedSentence);

        return data;
    }

    async list(data: PaginateTaggedSentenceInterface) {
        let query: any = {};

        if (data.lang)
            query['lang'] = data.lang;

        if (data.frame)
            query['frameName'] = Str.safeString(data.frame)

        if (data.lexicalUnit)
            query['lexicalUnitName'] = Str.safeString(data.lexicalUnit)

        if (data.status)
            query['status'] = data.status

        if (data.lexicalUnitHelper)
            query['lexicalUnitHelper'] = Str.safeString(data.lexicalUnitHelper)

        if (data.frameHelper)
            query['frameHelper'] = Str.safeString(data.frameHelper)

        if (data.lexicalUnitHint)
            query['lexicalUnitHint'] = Str.safeString(data.lexicalUnitHint)

        if (data.issuer)
            query['issuer'] = new Types.ObjectId(data.issuer)

        if (data.user)
            query['issuer'] = new Types.ObjectId(data.user)

        if (data.words && data.words.length > 0) {
            if (Str.isValidObjectId(data.words.join('')))
                query['_id'] = new Types.ObjectId(data.words.join(''));
            else {
                query = {
                    '$or': [
                        {'words': {'$regex': data.words.join(' ')},},
                        {
                            'frameName': {
                                '$exists': true,
                                '$regex': `${Str.safeString(data.words.join(' '))}`,
                                '$options': 'i'
                            },
                        },
                        {
                            'frameHelper': {
                                '$exists': true,
                                '$regex': `${Str.safeString(data.words.join(' '))}`,
                                '$options': 'i'
                            },
                        },
                        {
                            'lexicalUnitHelper': {
                                '$exists': true,
                                '$regex': `${Str.safeString(data.words.join(' '))}`,
                                '$options': 'i'
                            },
                        },
                    ],
                    ...query,
                };
            }
        }

        const d: any = await this.paginate<PaginateTaggedSentenceInterface>({
            data,
            query,
            sort: {updatedAt: -1},
            populate: ['sentence'],
            isAggregate: false,
        });

        for (let r of d.data) {
            if (Array.isArray(r.frameNetTags) && r.frameNetTags.length > 0) {
                for (let els of r.frameNetTags) {
                    if (els.element) {
                        els.element = await ElementService.find(els.element.toString());
                    }
                }
            }

            if (r.issuer)
                r.issuer = await UserService.find(r.issuer.toString());
            if (r.reviewer)
                r.reviewer = await UserService.find(r.reviewer.toString());

            delete r?.elements;

            delete r?.words;
        }

        return d;
    }

    async removeUserFromTaggedSentences(issuer: Types.ObjectId | string): Promise<boolean> {
        if (!await this.updateMany({issuer, status: {'$ne': TAGGED_SENTENCE_STATUS['published']}}, {
            issuer: null,
            status: TAGGED_SENTENCE_STATUS['unchanged'],
        })) return false;

        return await this.updateMany({issuer, status: TAGGED_SENTENCE_STATUS['published']}, {issuer: null})
    }

    async makeEmptyForSentences(sentence: Types.ObjectId | string): Promise<boolean> {
        return await this.makeEmpty({sentence});
    }

    async makeEmpty(search: any): Promise<boolean> {
        return await this.updateMany(search, {
            propBankTags: [],
            frameNetTags: [],
            frame: null,
            lexicalUnit: null,
            status: TAGGED_SENTENCE_STATUS['unchanged'],
            issuer: null,
            reviewer: null,
            lexicalUnitName: null,
            frameName: null,
        })
    }
}