import FrameInterface from "./Frame.interface";

export type ElementInterface = {
    _id: string,
    frame: FrameInterface|string,
    name: string,
    type: number,
    abbreviation?: string,
    color: string,//hex
    definition: string,
    semanticType?: string,
    excludes?: string,
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