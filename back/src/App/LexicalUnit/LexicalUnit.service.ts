import {MongooseService} from "../../Core/Class/MongooseService";
import {LexicalUnitModel} from "./LexicalUnit.model";
import {LexicalUnitInterface, PaginateLexicalUnitInterface} from "./LexicalUnit.interface";
import {Document, Types} from "mongoose";
import ElementService from "../Element/Element.service";
import taggedSentenceService from "../TaggedSentence/TaggedSentence.service";
import Str from "../../Core/Singleton/Str";
import FrameService from "../Frame/Frame.service";

// import Str from "../../Core/Singleton/Str";

export default new class LexicalUnitService extends MongooseService<LexicalUnitInterface> {
    constructor() {
        super(LexicalUnitModel);
    }

    async ofFrame(frame: string | Types.ObjectId) {
        return await this._model.find({frame}).sort({name: 1}).collation({locale: 'fa'}).exec();
    }

    async reorder(lexicalUnit: LexicalUnitInterface, after: LexicalUnitInterface | null) {
        if (!after) {
            const firstLexicalUnit = await this._model.findOne({frame: lexicalUnit.frame}).sort({order: -1});
            if (!firstLexicalUnit)
                return;
            const order = firstLexicalUnit.order - 1;
            await this.update(lexicalUnit._id, {order});
        } else {
            await this.updateMany({frame: lexicalUnit.frame, order: {'$gt': after.order}},
                {
                    '$inc': {'order': 1}
                }
            )
            await this.update(lexicalUnit._id, {order: after.order + 1});
        }
    }

    async maxOrder(frame: string | Types.ObjectId): Promise<number> {
        const el = await this._model.findOne({frame}).sort({order: -1}).exec();
        return el?.order ?? 0;
    }

    async create<s = any>(data: s | any): Promise<Document<any, any, any> & LexicalUnitInterface> {
        const order = await this.maxOrder(data.frame) + 1;
        return await super.create({...data, order});
    }

    async sentences(lexicalUnit: Types.ObjectId | string) {

        const all = await taggedSentenceService._model.find({lexicalUnit})
            .populate('issuer')
            .populate('reviewer')
            .limit(5000)
            .sort({status : 1,updatedAt : -1})
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

    async sorted(frame: string | Types.ObjectId) {
        return await this._model.find({frame}).sort({order: 1}).exec();
    }

    async search(data: PaginateLexicalUnitInterface) {
        const query: any = {};

        if (!!data.type || data.type === 0)
            query['type'] = data.type;
        const sort: any = {};
        if (data.name) {
            if (data.name.length > 2 && data.name[0] === '"' && data.name[data.name.length - 1] === '"') {
                query['name'] = data.name.substring(1, data.name.length - 1);
                sort['name'] = 1;
            } else {
                // query['name'] = {'$regex': '^' + Str.safeString(data.name), '$options': 'i'}
                query['name'] = {'$regex': Str.safeString(data.name), '$options': 'i'}
                sort['updatedAt'] = -1;
            }
            // query['$text'] = {
            //     // '$search': settings?.query?.phrase ? `\"${Str.safeString(data.name)}\"` : Str.safeString(data.name),
            //     '$search': `\"${Str.safeString(data.name)}\"`,
            //     '$caseSensitive': false
            // };
        }
        console.log(query);
        const d: any = await this.paginate<PaginateLexicalUnitInterface>({
            data,
            query,
            sort,
            populate: ['frame']
        });
        return d;
    }


    async forTagging(frame: string | Types.ObjectId) {
        const f = await FrameService.findOrFail(frame);

        let lexicalUnits: any = await this._model.find({
            frame,
            // 'name': {'$regex': /^[^a-zA-Z*]+$/i , '$options':'i'}
            // /^[^a-zA-Z*]+$/i
        }).sort({order: 1}).exec();

        const mirrorLexicalUnits = f.mirror ? await this._model.find({
            "frame": f.mirror as Types.ObjectId,
        }).sort({order: 1}).exec() : [];

        let data: any = [];
        let i = 0;
        for (i = 0; i < lexicalUnits.length && i < mirrorLexicalUnits.length; i++) { // @ts-ignore
            if (/^[^a-zA-Z*]+$/i.test(lexicalUnits[i].name))
                data.push({...lexicalUnits[i]['_doc'], 'mirror': mirrorLexicalUnits[i]});
        }
        for (i; i < lexicalUnits.length; i++) {
            if (/^[^a-zA-Z*]+$/i.test(lexicalUnits[i].name))
                data.push({...lexicalUnits[i]['_doc']});
        }

        data = data.sort((el1: any, el2: any) => el1.name.localeCompare(el2.name));

        return data;
    }
}