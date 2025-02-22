import {Types} from "mongoose";
import LogService from "../Log/Log.service";
import {TAGGED_SENTENCE_STATUS} from "../TaggedSentence/TaggedSentence.constant";
import TaggedSentenceService from "../TaggedSentence/TaggedSentence.service";

export default class ReportClass {
    static async waitingTaggedSentencesOfLogs(period: number, users?: (string | Types.ObjectId)[]) {
        const query: any = users && users.length ? {'issuer': {'$in': users.map((u) => new Types.ObjectId(u))}} : {};
        if (period === 1) {
            const firstDay = new Date();
            firstDay.setHours(0);
            firstDay.setMinutes(0);
            firstDay.setSeconds(0);
            const lastDay = new Date();
            query['$and'] = [
                {'createdAt': {'$gte': firstDay, '$lte': lastDay},},
            ];
        } else if (period === 2) {//weekly
            let today = new Date();
            const firstDay = (new Date(today.setDate(today.getDate() - today.getDay())));
            firstDay.setHours(0);
            firstDay.setMinutes(0);
            firstDay.setSeconds(0);
            const lastDay = new Date();
            query['$and'] = [
                {'createdAt': {'$gte': firstDay, '$lte': lastDay},},
            ];
        } else if (period === 3) {//monthly
            let today = new Date();
            let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            firstDay.setHours(0);
            firstDay.setMinutes(0);
            firstDay.setSeconds(0);
            const lastDay = new Date();
            query['$and'] = [
                {'createdAt': {'$gte': firstDay, '$lte': lastDay},},
            ];
        } else if (period === 4) {//yearly
            let today = new Date();
            let firstDay = new Date(today.getFullYear(), 0, 1);
            firstDay.setHours(0);
            firstDay.setMinutes(0);
            firstDay.setSeconds(0);
            const lastDay = new Date();
            query['$and'] = [
                {'createdAt': {'$gte': firstDay, '$lte': lastDay},},
            ];
        } else query['$and'] = []
        query['$and'] = [...query['$and'],
            {
                'action': 43,
                'additionalInfo.status': TAGGED_SENTENCE_STATUS['waiting'],
            }

        ]
        const result = await LogService._model.aggregate([
            {
                '$match': query
            },
            {
                '$group': {
                    '_id': {'ref': "$ref"},
                    'count': {'$sum': 1}
                }
            }, {'$count': "total"}

        ]).exec();
        return result.length ? result[0].total : 0;
    }


    static async waitingTaggedSentences(users?: (string | Types.ObjectId)[]) {
        const query: any = users && users.length ? {'issuer': {'$in': users.map((u) => new Types.ObjectId(u))}} : {};
        query['status'] = TAGGED_SENTENCE_STATUS['waiting'];
        return await TaggedSentenceService._model.countDocuments(query).exec();
    }
}