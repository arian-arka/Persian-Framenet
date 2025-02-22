import {MongooseService} from "../../Core/Class/MongooseService";
import {Types} from "mongoose";
import FrameRelationInterface from "./FrameRelation.interface";
import {FrameRelationModel} from "./FrameRelation.model";
import {FRAME_RELATION_NAME} from "./FrameRelation.constant";

export default new class FrameRelationService extends MongooseService<FrameRelationInterface> {
    constructor() {
        super(FrameRelationModel);
    }

    async list(frame:Types.ObjectId | string) : Promise<{[key:string]:FrameRelationInterface}> {
        const all : any = {};
        for(let name of FRAME_RELATION_NAME)
            all[name] = await this.all({
                fromFrame:frame,
                name
            },[
                {path : 'toFrame',select : ['name','_id']}
            ]);
        return all;
    }

}