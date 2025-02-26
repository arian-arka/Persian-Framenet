import {TaggedSentenceModel} from "../TaggedSentence/TaggedSentence.model";
import FrameService from "../Frame/Frame.service";

export default new class ReportService {
    async sample1() {
        //lang = ?
        //status = ?
        // deletedAt =
        return await TaggedSentenceModel.aggregate([
            {
                $match: {
                    lang: 2,
                }
            },
            {
                $group: {
                    _id: "$frame",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]).exec();
    }

    async sample2() {
        //lang = ?
        //status = ?
        // deletedAt =
        return await TaggedSentenceModel.aggregate([
            {
                $match: {
                    lang: 2,
                    status: 30,
                }
            },
            {
                $group: {
                    _id: "$frame",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]).exec();
    }

    async sample3() {
        //lang = ?
        //status = ?
        // deletedAt =
        return await TaggedSentenceModel.aggregate([
            {
                $match: {
                    lang: 2,
                    $or: [
                        {
                            status: 50,
                        },
                        {
                            status: 70,
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: "$frame",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $lookup: {
                    from: "frames",
                    localField: "_id",
                    foreignField: "_id",
                    as: "frame"
                }
            },

        ]).exec();
    }

    async sample4() {
        const all: any = {
            1: new Set(),
            2: new Set(),
            3: new Set(),
            4: new Set(),
            5: new Set(),
        };
        let lastId = null;
        let totalItems : any = [];
        while (true) {
            const items : any = await TaggedSentenceModel.find(lastId ? {_id: {$gt: lastId},lang:2} : {lang:2},{_id:1,status:1,frame:1})
                .sort({_id: 'asc'}).limit(5000).exec();
            if (!items.length)
                break;
            lastId = items.at(items.length - 1)._id;
            totalItems = [...totalItems,...items];
        }
        for (const s of totalItems) {
            if (!s.frame)
                continue;
            all[1].add(s.frame?.toString() ?? '');
            if (s.status === 30)
                all[2].add(s.frame?.toString() ?? '');
            else if ([50, 70].includes(s.status))
                all[3].add(s.frame?.toString() ?? '');

            if(! [30, 50, 70].includes(s.status) )
                all[4].add(s.frame?.toString() ?? '');

            if([30, 50, 70].includes(s.status) )
                all[5].add(s.frame?.toString() ?? '');
        }
        all['total'] = all[5].size;
        all['finalized'] = all[2].size;
        all['editing'] = all[3].size;
        all['finalized_without_editing'] = Array.from(all[2]).filter(e => !all[3].has(e));
        all['finalized_without_editing_length'] = all['finalized_without_editing'].length;

        all['editing_without_finalized'] = Array.from(all[3]).filter(e => !all[2].has(e));

        for(let i=0;i<all['editing_without_finalized'].length;i++)
            all['editing_without_finalized'][i] = await FrameService.find(all['editing_without_finalized'][i] as string,['mirror']);

        all['editing_without_finalized'] = all['editing_without_finalized'].map((e : any) => [e.name,e.mirror?.name ?? '*']);
        all['editing_without_finalized_length'] = all['editing_without_finalized'].length;


        // all[1]=Array.from(all[1]);
        // all[2]=Array.from(all[2]);
        // all[3]=Array.from(all[3]);

        return {

            total:all['total'],
            finalized:all['finalized'],
            editing:all['editing'],

            editing_without_finalized_length:all['editing_without_finalized_length'],
            finalized_without_editing_length:all['finalized_without_editing_length'],

            editing_without_finalized:all['editing_without_finalized'],
        };
    }
}