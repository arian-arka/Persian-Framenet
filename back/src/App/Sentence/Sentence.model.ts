import {Schema, model} from "mongoose";
import {SentenceInterface} from "./Sentence.interface";

export const SentenceSchema = new Schema<SentenceInterface>({
    words: String,
    lang:{
        type:Number,
        default:null,
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})
SentenceSchema.index({words: 'text'})
export const SentenceModel = model('sentence', SentenceSchema);