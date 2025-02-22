import {Schema, model} from "mongoose";
import {ElementInterface} from "./Element.interface";

export const ElementSchema = new Schema<ElementInterface>({
    frame: {
        type: Schema.Types.ObjectId ,
        ref : 'frame',
    },
    name: String,
    order: Number,
    type: Number,
    abbreviation: {
        type: String ,
        default: null,
    },
    definition: String,
    color: String,
    semanticType: {
        type: String ,
        default: null,
    },
    excludes: {
        type: String ,
        default: null,
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})
ElementSchema.index({frame: 1})
export const ElementModel = model('element', ElementSchema);