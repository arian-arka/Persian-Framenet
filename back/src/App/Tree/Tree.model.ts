import {Schema, model} from "mongoose";
import {TreeInterface} from "./Tree.interface";

export const TreeSchema = new Schema<TreeInterface>({
    name:String,
    tree: {
        type: Schema.Types.Mixed,
        default: null,
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})
TreeSchema.index({id: 1})
export const TreeModel = model('tree', TreeSchema);