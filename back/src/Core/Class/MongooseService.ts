import {Document, FilterQuery, HydratedDocument, Schema, Model, Types, DefaultSchemaOptions} from "mongoose";
import NotFound from "../Response/400/NotFound";
import MongoosePaginator, {MongoosePaginationInterface, PaginatedInterface} from "../Singleton/MongoosePaginator";
import UserInterface from "../../App/User/User.interface";
import Str from "../Singleton/Str";

export class MongooseService<modelInterface> {
    // @ts-ignore
    readonly _model: Model<modelInterface, {}, {}, {}, Schema<modelInterface, Model<UserInterface, modelInterface, any, any, any>, {}, {}, {}, {}, DefaultSchemaOptions, modelInterface>>

    // @ts-ignore
    constructor(model: Model<modelInterface, {}, {}, {}, Schema<modelInterface, Model<UserInterface, modelInterface, any, any, any>, {}, {}, {}, {}, DefaultSchemaOptions, modelInterface>>) {
        this._model = model;
    }

    async find(_id: string | undefined | null | Types.ObjectId, populate: (string | any)[] = []): Promise<HydratedDocument<modelInterface, {}, {}> | null> {
        if (!Str.isValidObjectId(_id))
            return null;
        const q = this._model.findById(_id);
        for (let p of populate)
            q.populate(p);
        return await q.exec();
    }

    async findOrFail(_id: string | undefined | null | Types.ObjectId, populate: (string | any)[] = []): Promise<HydratedDocument<modelInterface, {}, {}>> {
        const obj = await this.find(_id);
        if (!obj)
            throw NotFound.forMessage('Not Found');
        return obj;
    }

    async delete(_id: string | undefined | null | Types.ObjectId): Promise<boolean> {
        return (await this._model.deleteOne({_id}).exec()).acknowledged;
    }

    async update<schema = modelInterface>(_id: string | undefined | null | Types.ObjectId, data: schema | any): Promise<boolean> {
        return (await this._model.updateOne({_id}, data).exec()).acknowledged;
    }

    async updateAndGet<schema = modelInterface>(_id: string | undefined | null | Types.ObjectId, data: schema | any): Promise<HydratedDocument<modelInterface, {}, {}> | null> {
        if (await this.update<schema>(_id, data))
            return await this.find(_id);
        return null;
    }
    async paginate<searchSchema extends MongoosePaginationInterface>(options: {
        data: searchSchema,
        query: any,
        sort?: any,
        isAggregate?: boolean,
        populate?: (string | any)[]
    }): Promise<PaginatedInterface<modelInterface>> {
        return await MongoosePaginator.make<modelInterface>(this._model, options.data, options.query, options.sort ?? undefined, options?.isAggregate ?? false, options?.populate ?? [])
    }
    async all<s>(search: FilterQuery<s> | any, populate: (string | any)[] = []): Promise<HydratedDocument<modelInterface, {}, {}>[]> {
        const q = this._model.find(search);
        for (let p of populate)
            q.populate(p);
        return await q.exec();
    }
    async deleteMany<s>(search: FilterQuery<s> | any): Promise<boolean> {
        return (await this._model.deleteMany(search).exec()).acknowledged;
    }

    async updateMany<s, r>(search: FilterQuery<s> | any, replace: r | any): Promise<boolean> {
        return (await this._model.updateMany(search, replace).exec()).acknowledged;
    }

    async create<s>(data: s): Promise<
        Document<any, any, any> & modelInterface
    > {
        return await (new this._model(data)).save();
    }

    async exists(search: FilterQuery<any>): Promise<boolean> {
        return await this._model.exists(search) !== null;
    }


}