import {Types} from "mongoose";
import FrameInterface from "../Frame/Frame.interface";

export default interface FrameRelationInterface {
    _id: Types.ObjectId
    name: string,
    fromFrame?: FrameInterface | Types.ObjectId,
    toFrame?: FrameInterface | Types.ObjectId,

    createdAt:Date,
    updatedAt:Date,

}

export interface StoreFrameRelationInterface{
    name: string,
    fromFrame : string,
    toFrame : string,
}

