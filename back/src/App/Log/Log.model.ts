import {Schema, model} from "mongoose";
import {LogInterface} from "./Log.interface";

export const LogSchema = new Schema<LogInterface>({
    description: String,
    action: Number,
    issuer: {
        type: Schema.Types.ObjectId ,
        ref : 'user',
        default: null,
    },
    additionalInfo : {
        type : Schema.Types.Mixed,
        default : null,
    },
    ref: {
        type: Schema.Types.ObjectId ,
        default: null,
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})
LogSchema.index({issuer: 1,action:1})
export const LogModel = model('log', LogSchema);