import {Schema, model} from "mongoose";
import {LexicalUnitInterface} from "./LexicalUnit.interface";

export const LexicalUnitSchema = new Schema<LexicalUnitInterface>({
    frame: {
        type: Schema.Types.ObjectId ,
        ref : 'frame',
    },
    taggedSentenceCount:{
        type : Number,
        default : 0,
    },
    order:Number,
    name: String,
    type: Number,
    definition: {
        type : String,
        default : null,
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})
LexicalUnitSchema.index({frame: 1,name:'text'})
export const LexicalUnitModel = model('lexicalUnit', LexicalUnitSchema);