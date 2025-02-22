import { Types } from "mongoose";

export interface SettingInterface {
    _id :Types.ObjectId
    name : string,
    body : any,
}
