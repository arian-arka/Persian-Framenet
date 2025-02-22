import {MongooseService} from "../../Core/Class/MongooseService";
import {LogModel} from "./Log.model";
import {LogInterface, PaginateLogInterface} from "./Log.interface";

export default new class LogService extends MongooseService<LogInterface> {
    constructor() {
        super(LogModel);
    }

    async list(data: PaginateLogInterface) {
        const query: any = {};

        if (!!data.issuer)
            query['issuer'] = data.issuer;

        if (!!data.type)
            query['action'] = data.type;

        if (data.period === 1) {//today
            const firstDay = new Date();
            firstDay.setHours(0);
            firstDay.setMinutes(0);
            firstDay.setSeconds(0);
            const lastDay = new Date();
            query['$and'] = [
                {'createdAt': {'$gte': firstDay},},
                {'createdAt': {'$lte': lastDay},},
            ];
        } else if (data.period === 2) {//weekly
            let today = new Date();
            const firstDay = (new Date(today.setDate(today.getDate() - today.getDay())));
            firstDay.setHours(0);
            firstDay.setMinutes(0);
            firstDay.setSeconds(0);
            const lastDay = new Date();
            query['$and'] = [
                {'createdAt': {'$gte': firstDay},},
                {'createdAt': {'$lte': lastDay},},
            ];
        } else if (data.period === 3) {//monthly
            let today = new Date();
            let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            firstDay.setHours(0);
            firstDay.setMinutes(0);
            firstDay.setSeconds(0);
            const lastDay = new Date();
            query['$and'] = [
                {'createdAt': {'$gte': firstDay},},
                {'createdAt': {'$lte': lastDay},},
            ];
        } else if (data.period === 4) {//yearly
            let today = new Date();
            let firstDay = new Date(today.getFullYear(), 0, 1);
            firstDay.setHours(0);
            firstDay.setMinutes(0);
            firstDay.setSeconds(0);
            const lastDay = new Date();
            query['$and'] = [
                {'createdAt': {'$gte': firstDay},},
                {'createdAt': {'$lte': lastDay},},
            ];
        }
        return await this.paginate<PaginateLogInterface>({
            data,
            query,
            sort: {updatedAt: -1},
            populate: [{path: 'issuer', select: ['name', '_id']}]
        })
    }



}