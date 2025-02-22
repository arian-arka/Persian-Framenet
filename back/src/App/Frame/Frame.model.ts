import {Schema, model} from "mongoose";
import FrameInterface from "./Frame.interface";
import {FRAME_STATUS} from "./Frame.contant";

export const FrameSchema = new Schema<FrameInterface>({
    name:  String,
    lang: Number,
    definition: String,
    semanticType: {type : String,nullable : true},
    status: {type:Number,default:FRAME_STATUS['unchanged']},
    mirror: {
        type: Schema.Types.ObjectId ,
        ref : 'frame',
        default: null,
    },
    issuer: {
        type: Schema.Types.ObjectId ,
        ref : 'user',
        default: null,
    },
    deletedAt : {
        type : Date,
        default:null
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})
FrameSchema.index({name: 'text'})
export const FrameModel = model('frame', FrameSchema);