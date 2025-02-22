import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import FrameService from "../../App/Frame/Frame.service";
import {Types} from "mongoose";
import LogClass from "../../App/Log/Log.class";
import FrameRelationInterface from "../../App/FrameRelation/FrameRelation.interface";
import {LOG_TYPE} from "../../App/Log/Log.constants";
export default class FrameRelationEditionListener extends Listener {
    async dispatch(data: {
        relation: FrameRelationInterface,
        user: UserInterface
    }): Promise<any> {
        const fromFrame = await FrameService.find(data.relation.fromFrame as Types.ObjectId);
        const toFrame = await FrameService.find(data.relation.toFrame as Types.ObjectId);
        await LogClass.make({
            ref:data.relation._id,
            issuer:data.user._id,
            action:data.relation.createdAt.getTime() === data.relation.updatedAt.getTime() ? LOG_TYPE['store frameRelation'] : LOG_TYPE['edit frameRelation'],
            description:`قالب معنایی ( ${fromFrame?._id} | ${fromFrame?.name} ) - رابطه ( ${toFrame?.name} | ${toFrame?._id} )`,
        })
    }
}