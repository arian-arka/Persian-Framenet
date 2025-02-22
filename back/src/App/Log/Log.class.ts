import {Types} from "mongoose";
import LogService from "./Log.service";

export default class LogClass {
    static async make(props : {
        issuer : Types.ObjectId|string,
        action : number,
        additionalInfo?: { [key:string] : number|string|null },
        description : string,
        ref?: string|Types.ObjectId|null
    }){
        return await LogService.create(props);
    }
}