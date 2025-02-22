import {Schema, model} from "mongoose";
import {HelperInterface} from "./Helper.interface";

export const HelperSchema = new Schema<HelperInterface>({
    id: String,
    data: {
        type: Schema.Types.Mixed,
        default: null,
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})
HelperSchema.index({id: 1})
export const HelperModel = model('helper', HelperSchema);