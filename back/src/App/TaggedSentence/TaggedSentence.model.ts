import {Schema, model} from "mongoose";
import {TaggedSentenceInterface} from "./TaggedSentence.interface";

export const TaggedSentenceSchema = new Schema<TaggedSentenceInterface>({
    words: String,
    propBankTags: [{
        type: String,
        default: null,
    }],
    lang:{
        type:Number,
        default:null,
    },
    frameNetTags: [
        {
            tagType: Number,
            element: {
                type: Schema.Types.ObjectId,
                ref: 'element',
                default: null,
            },
        }
    ],
    sentence: {
        type: Schema.Types.ObjectId,
        ref: 'sentence',
    },
    frame: {
        type: Schema.Types.ObjectId,
        ref: 'frame',
        default: null,
    },
    lexicalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'lexicalUnit',
        default: null,
    },
    frameHelper: {
        type: String,
        default: null,
    },
    lexicalUnitHint: {
        type: String,
        default: null,
    },
    lexicalUnitHelper: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    frameName: {
        type: String,
        default: null,
    },
    lexicalUnitName: {
        type: String,
        default: null,
    },
    status: Number,
    issuer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    }, reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})
TaggedSentenceSchema.index({
    sentence: 1, frame: 1, lexicalUnit: 1, status: 1, words: 'text',
    frameName:1,lexicalUnitName:1,
})
export const TaggedSentenceModel = model('taggedSentence', TaggedSentenceSchema);