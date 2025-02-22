import {MongooseService} from "../../Core/Class/MongooseService";
import {PaginateSentenceInterface, SentenceInterface} from "./Sentence.interface";
import {SentenceModel} from "./Sentence.model";
import {Types} from "mongoose";
import taggedSentenceService from "../TaggedSentence/TaggedSentence.service";
import ElementService from "../Element/Element.service";
import Str from "../../Core/Singleton/Str";
// import Str from "../../Core/Singleton/Str";

export default new class SentenceService extends MongooseService<SentenceInterface> {
    constructor() {
        super(SentenceModel);
    }


    async tagged(sentence: Types.ObjectId | string) {
        const all = await taggedSentenceService._model.find({sentence})
            .populate('issuer')
            .populate('reviewer')
            .limit(5000)
            .sort({
                'lexicalUnitName':1,
                'lexicalUnitHelper':1,
                // 'updatedAt': -1
            })
            .exec();
        for (const r of all) {
            if (Array.isArray(r.frameNetTags) && r.frameNetTags.length > 0) {
                for (let els of r.frameNetTags) {
                    if (els.element) {
                        // @ts-ignore
                        els.element = await ElementService.find(els.element.toString());
                    }
                }
            }
        }
        return all;
    }


    async wordsExists(words: string[], exceptId: Types.ObjectId | string | null | undefined = undefined): Promise<boolean> {
        if (exceptId)
            return await this.exists({
                _id: {'$ne': exceptId},
                words
            });
        return await this.exists({'words':words.join(' ')});
    }

    async list(data: PaginateSentenceInterface) {
        const query: any = {};
        console.log('data:',data);
        if(data.lang)
            query['lang'] = data.lang;

        if (data.words && data.words.length > 0) {
            if (Str.isValidObjectId(data.words.join('')))
                query['_id'] = data.words.join('');
            else
                query['words'] = {'$regex': Str.safeString(data.words.join(' '))};
        }
        console.log(query);
        // query['$text'] = {
        //     // '$search': settings?.query?.phrase ? `\"${Str.safeString(data.name)}\"` : Str.safeString(data.name),
        //     '$search': `\"${Str.safeString(data.words.join(' '))}\"`,
        //     '$caseSensitive': false
        // };

        return await this.paginate<PaginateSentenceInterface>({
            data,
            query,
            sort: {
                updatedAt: 1
            }
        })
    }
}