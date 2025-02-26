import {MongooseService} from "../../Core/Class/MongooseService";
import FrameInterface, {FullFrameInterface, PaginateFrameInterface} from "./Frame.interface";
import {FrameModel} from "./Frame.model";
import {Types} from "mongoose";
import {FRAME_STATUS} from "./Frame.contant";
import ElementService from "../Element/Element.service";
import LexicalUnitService from "../LexicalUnit/LexicalUnit.service";
import MessageService from "../Message/Message.service";
import FrameRelationService from "../FrameRelation/FrameRelation.service";
import Str from "../../Core/Singleton/Str";
import {TAGGED_SENTENCE_STATUS} from "../TaggedSentence/TaggedSentence.constant";

export default new class FrameService extends MongooseService<FrameInterface> {
    constructor() {
        super(FrameModel);
    }

    async updateStatusToEditing(_id: string | Types.ObjectId, issuer: string | Types.ObjectId): Promise<boolean> {
        return await this.update(_id, {status: FRAME_STATUS['editing'], issuer});
    }

    async list(data: PaginateFrameInterface, withSoftDelete: boolean) {
        let query: any = {};

        if (!withSoftDelete)
            query['$or'] = [
                {'deletedAt': {'$exists': false}},
                {'deletedAt': {$eq: null}},
            ];

        if (!!data.issuer)
            query['issuer'] = {$eq: data.issuer};

        if (data.lang)
            query['lang'] = {$eq: data.lang};

        if (data.status)
            query['status'] = {$eq: data.status};
        const sort: any = {};
        if (data.name) {
            if (Str.isValidObjectId(data.name)) {
                query['_id'] = {$eq: new Types.ObjectId(data.name)};
                sort['name'] = 1;
            } else {
                if (data.name.length > 2 && data.name[0] === '"' && data.name[data.name.length - 1] === '"') {
                    query['name'] = {
                        '$eq': Str.safeString(data.name.substring(1, data.name.length - 1)),
                    };
                    sort['name'] = 1;
                } else {
                    query['name'] = {'$regex': Str.safeString(data.name), '$options': 'i'};
                    sort['updatedAt'] = -1;
                }
            }
            // query['$text'] = {
            //     // '$search': settings?.query?.phrase ? `\"${Str.safeString(data.name)}\"` : Str.safeString(data.name),
            //     '$search': `\"${Str.safeString(data.name)}\"`,
            //     '$caseSensitive': false
            // };
        } else sort['name'] = 1;
        /*const sorts: any = [
            {name: 1},
            {name: -1},
            {lang: 1},
            {lang: -1},
            {status: 1},
            {status: -1},
            {createdAt: 1},
            {createdAt: -1},
        ];*/
        query = [{$match: query}];

        query = [...query,
            {
                $lookup: {
                    from: "taggedsentences",
                    localField: "_id",
                    foreignField: "frame",
                    let: {
                        frameId: "$_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                status: { $eq: 30 },
                                lang: { $eq: 2 }
                            }
                        }
                    ],
                    as: "matched_sentences"
                }
            },
            ...(data.hasPublishedSentence !== undefined && data.hasPublishedSentence !== null ?
                    [{$match: {"matched_sentences.0": {$exists: data.hasPublishedSentence ? true : false}}}] :
                    []
            ),
            {
                $project: {
                    frame_data: "$$ROOT",
                    sentence_count: {
                        $size: '$matched_sentences',
                    }
                }
            },

            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            "$frame_data", {count: "$sentence_count"}
                        ]
                    }
                }
            },
            { $lookup: {from: 'frames', localField: 'mirror', foreignField: '_id', as: 'mirror'}},
            {$set: {'mirror': {$first: '$mirror'}}}
        ];


        return await this.paginate<PaginateFrameInterface>({
            data,
            query,
            // sort,
            isAggregate: true,
            //sort: data.sort ? sorts[data.sort + 1] : {},
            //populate: ['mirror', {path: 'issuer', select: ['name', '_id']}]
        })
    }

    async listWithoutWaiting(data: PaginateFrameInterface, withSoftDelete: boolean) {
        const query: any = {
            status: {'$ne': TAGGED_SENTENCE_STATUS.waiting}
        };

        if (!withSoftDelete)
            query['$or'] = [
                {'deletedAt': {'$exists': false}},
                {'deletedAt': null},
            ];

        if (!!data.issuer)
            query['issuer'] = data.issuer;

        if (data.lang)
            query['lang'] = data.lang;

        // if (data.status)
        //     query['status'] = data.status;
        const sort: any = {};
        if (data.name) {
            if (Str.isValidObjectId(data.name))
                query['_id'] = new Types.ObjectId(data.name);
            else {
                if (data.name.length > 2 && data.name[0] === '"' && data.name[data.name.length - 1] === '"') {
                    query['name'] = {
                        '$eq': Str.safeString(data.name.substring(1, data.name.length - 1)),
                    };
                    sort['name'] = 1;
                } else {
                    query['name'] = {'$regex': Str.safeString(data.name), '$options': 'i'};
                    sort['updatedAt'] = -1;
                }
            }
            // query['$text'] = {
            //     // '$search': settings?.query?.phrase ? `\"${Str.safeString(data.name)}\"` : Str.safeString(data.name),
            //     '$search': `\"${Str.safeString(data.name)}\"`,
            //     '$caseSensitive': false
            // };
        }
        // const sorts: any = [
        //     {name: 1},
        //     {name: -1},
        //     {lang: 1},
        //     {lang: -1},
        //     {status: 1},
        //     {status: -1},
        //     {createdAt: 1},
        //     {createdAt: -1},
        // ];


        return await this.paginate<PaginateFrameInterface>({
            data,
            query,
            sort,
            //sort: data.sort ? sorts[data.sort + 1] : {},
            populate: ['mirror', {path: 'issuer', select: ['name', '_id']}]
        })
    }

    async removeUserFromFrames(issuer: Types.ObjectId | string): Promise<boolean> {
        if (!await this.updateMany({issuer, status: {'$ne': FRAME_STATUS['published']}}, {
            issuer: null,
            status: FRAME_STATUS['unchanged'],
        })) return false;

        return await this.updateMany({issuer, status: FRAME_STATUS['published']}, {issuer: null})
    }

    async findFullOrFail(_id: string | null | undefined, getMirror = true): Promise<FullFrameInterface> {
        const f = await this.findOrFail(_id);

        let data: any = f.toObject();
        data.elements = await ElementService.sorted(f._id);
        data.lexicalUnits = await LexicalUnitService.sorted(f._id);
        data.relations = await FrameRelationService.list(f._id);
        if (!data.mirror || !getMirror) {
            data.message = await MessageService.messageOfFrame(f);
            return data;
        }
        data.mirror = await this.findFullOrFail(f?.mirror ? f.mirror.toString() : null, false);
        return data;
    }

    async duplicate(oldFrame: FrameInterface, newName: string) {
        const newFrame = await this.create({
            name: newName,
            lang: oldFrame.lang,
            definition: oldFrame.definition,
            semanticType: oldFrame.semanticType,
            status: FRAME_STATUS['unchanged'],
            mirror: oldFrame.mirror
        });
        const elements = await ElementService.all({frame: oldFrame._id});
        for (let el of elements)
            await ElementService.create({
                frame: newFrame._id,
                name: el.name,
                type: el.type,
                abbreviation: el.abbreviation,
                color: el.color,
                definition: el.definition,
                semanticType: el.semanticType,
                excludes: el.excludes,
            });
        const lexicalUnits = await LexicalUnitService.all({frame: oldFrame._id});
        for (let le of lexicalUnits)
            await LexicalUnitService.create({
                frame: newFrame._id,
                name: le.name,
                type: le.type,
                definition: le.definition,
            });

        return newFrame;
    }

}