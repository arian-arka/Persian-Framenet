import {HydratedDocument, Model,Query} from "mongoose";
import BadRequest from "../Response/400/BadRequest";

export interface MongoosePaginationInterface {
    page: number,
    linkPerPage: number,
    limit: number,
    sort?: number,
}

export interface PaginatedInterface<schema> {
    pagination: {
        pages: number[]
        next: number,
        current: number,
        previous: number,
        total: number,
        totalSoFar: number,
        lastPage: number,
        firstPage: number,
        end: boolean
    }
    data: (HydratedDocument<schema, {}, {}>)[]
}

class MongoosePaginator {

    generatePages(page: number, linkPerPage: number, lastPage: number): number[] {
        const pages = [];
        let i;
        if (page > 0) {
            const half = Math.floor(linkPerPage / 2);
            let diff = half - page + 1;
            if (diff < 0)
                diff = 0;
            for (i = diff; i < half; i++) {
                let tmpPage = page - half + i;
                if (tmpPage > 0)
                    pages.push(tmpPage);
            }
            pages.push(page);
            let j = 1;
            for (i = i + 1; i < linkPerPage + diff; i++) {
                let tmpPage = page + j++;
                if (tmpPage <= lastPage)
                    pages.push(tmpPage);
            }
        }
        return pages;
    }

    async make<schema>(
        model: Model<schema, {}, {}, {}, any>,
        settings: MongoosePaginationInterface,
        query: any,
        sort : any|undefined=undefined,
        isAggregate: boolean = false,
        populate: (string|any)[] = []
    ): Promise<PaginatedInterface<schema>> {
        console.log('query',query);
        const skip: number = (settings.page - 1) * settings.limit;
        const _q = isAggregate ? [...query,
            ... sort ? [{'$sort' : sort}] : [],
            {
                '$skip': skip
            },
            {
                '$limit': settings.limit
            },
        ] : query;




        let all;

        if(isAggregate){
            all =  await model.aggregate([
                ...query,
                {
                    $count: "___total___"
                }
            ]).exec();
            all = all.length === 0 ? 0 : all[0].___total___;
        }else all = await model.countDocuments(query).exec();

        const lastPage: number = all <= settings.limit ? 1 : ((all % settings.limit === 0 ? 0 : 1) + Math.floor(all / settings.limit));

        if (lastPage < settings.page)
            throw BadRequest.forMessage('Bad pagination');

        const q = isAggregate ? model.aggregate(_q) : model.find(_q)
        if(sort && !isAggregate){
            q.sort(sort);
        }

        if(q instanceof Query)
            for(let p of populate)
                q.populate(p);

        q.limit(settings.limit).skip(skip);

        const data = await q.exec();

        const current: number = lastPage === 1 ? 1 : settings.page;
        const next: number = lastPage > 1 && settings.page < lastPage ? settings.page + 1 : 0;
        const previous: number = settings.page > 1 ? settings.page - 1 : 0;
        const total: number = all;
        const totalSoFar: number = skip + data.length;
        const firstPage: number = 1;
        const end: boolean = settings.page === lastPage;

        return {
            data,
            pagination: {
                pages: this.generatePages(settings.page, settings.linkPerPage, lastPage),
                next,
                current,
                previous,
                total,
                totalSoFar,
                firstPage,
                lastPage,
                end,
            }
        };
    }

    properties() {
        return {
            page: {type: "number", min: 1},
            linkPerPage: {type: "number", min: 3},
            limit: {type: "number", min: 10},
            sort: {type: "number", min: 0, max: 20},
        };
    }

    required() {
        return ['query', 'page', 'sort', 'limit', 'linkPerPage'];
    }
}

export default new MongoosePaginator;