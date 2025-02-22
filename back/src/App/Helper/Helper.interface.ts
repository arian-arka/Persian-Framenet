import {Types} from "mongoose";

export type HelperInterface = {
    _id: Types.ObjectId,
    id : string,
    data : any|null,
    updatedAt: Date,
    createdAt: Date,
}
