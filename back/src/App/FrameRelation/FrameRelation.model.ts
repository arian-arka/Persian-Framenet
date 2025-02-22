import {Schema, model} from "mongoose";
import FrameRelationInterface from "./FrameRelation.interface";
export const FrameRelationSchema = new Schema<FrameRelationInterface>({
    name:  String,
    fromFrame: {
        type: Schema.Types.ObjectId ,
        ref : 'frame',
        default: null,
    },
    toFrame: {
        type: Schema.Types.ObjectId ,
        ref : 'frame',
        default: null,
    },
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})
export const FrameRelationModel = model('frameRelation', FrameRelationSchema);