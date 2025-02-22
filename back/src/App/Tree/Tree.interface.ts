import {Types} from "mongoose";

export type TreeInterface = {
    _id: Types.ObjectId,
    name:string,
    tree:any,
}
