import {Schema, model} from "mongoose";
import {MessageInterface} from "./Message.interface";

export const MessageSchema = new Schema<MessageInterface>({
    message: {type:String,default:null},
    isFor: Number,
    ref: {
        type: Schema.Types.ObjectId,
        default: null,
    },
    seen: {
        type: Date,
        default: null
    },
    refText: {
        type: String,
        default: null,
    },
    issuer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
    issuedFor: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
    openedAt:{
        type:Schema.Types.Date,
        default:null,
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});
/*
*
First, add those fields against which Equality queries are run.
The next fields to be indexed should reflect the Sort order of the query.
The last fields represent the Range of data to be accessed.
* */

MessageSchema.index({issuer: 1, issuedFor: 1, ref: 1, isFor: 1});
export const MessageModel = model('message', MessageSchema);