import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import {Types} from "mongoose";
import FrameService from "../../App/Frame/Frame.service";
import LogClass from "../../App/Log/Log.class";
import FrameRelationInterface from "../../App/FrameRelation/FrameRelation.interface";
import {LOG_TYPE} from "../../App/Log/Log.constants";
export default class FrameRelationDeletionListener extends Listener {
    async dispatch(data: {
        relation: FrameRelationInterface,
        user: UserInterface
    }): Promise<any> {
        const fromFrame = await FrameService.find(data.relation.fromFrame as Types.ObjectId);
        const toFrame = await FrameService.find(data.relation.toFrame as Types.ObjectId);
        await LogClass.make({
            issuer:data.user._id,
            action:LOG_TYPE['delete frameRelation'],
            description:`قالب معنایی ( ${fromFrame?._id} | ${fromFrame?.name} ) - رابطه ( ${toFrame?.name} | ${toFrame?._id} )`,
        })
    }
}