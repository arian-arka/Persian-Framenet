import {MongooseService} from "../../Core/Class/MongooseService";
import {ElementModel} from "./Element.model";
import {ElementInterface} from "./Element.interface";
import {Document, Types} from "mongoose";

export default new class ElementService extends MongooseService<ElementInterface> {
    constructor() {
        super(ElementModel);
    }

    async reorder(element: ElementInterface, after: ElementInterface | null) {
        if (!after) {
            const firstElement = await this._model.findOne({frame: element.frame}).sort({order: -1});
            if (!firstElement)
                return;
            const order = firstElement.order - 1;
            await this.update(element._id, {order});
        } else {
            await this.updateMany({frame: element.frame, order: {'$gt': after.order}},
                {
                    '$inc': {'order': 1}
                }
            )
            await this.update(element._id, {order: after.order + 1});
        }
    }

    async maxOrder(frame: string | Types.ObjectId): Promise<number> {
        const el = await this._model.findOne({frame}).sort({order: -1}).exec();
        return el?.order ?? 0;
    }

    async create<s = any>(data: s | any): Promise<Document<any, any, any> & ElementInterface> {
        const order = await this.maxOrder(data.frame) + 1;
        return await super.create({...data, order});
    }

    async sorted(frame: string | Types.ObjectId){
        return await this._model.find({frame}).sort({order:1}).exec();
    }
}