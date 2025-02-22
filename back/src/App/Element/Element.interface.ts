import {Types} from "mongoose";
import FrameInterface from "../Frame/Frame.interface";

export type ElementInterface = {
    _id: Types.ObjectId,
    frame: FrameInterface|Types.ObjectId,
    name: string,
    order : number
    type: number,
    abbreviation?: string,
    color: string,//hex
    definition: string,
    semanticType?: string,
    excludes?: string,
    updatedAt: Date,
    createdAt: Date,
}

export interface StoreElementInterface {
    name: string,
    type: number,
    abbreviation?: string,
    color: string,//hex
    definition: string,
    semanticType?: string,
    excludes?: string,
}

export interface EditElementInterface {
    name: string,
    type: number,
    abbreviation?: string,
    color: string,//hex
    definition: string,
    semanticType?: string,
    excludes?: string,
}

export interface ReorderElementInterface{
    element:string,
    after?:string,
}