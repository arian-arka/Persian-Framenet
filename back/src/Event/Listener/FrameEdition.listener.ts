import Listener from "../../Core/Class/Listener";
import FrameInterface from "../../App/Frame/Frame.interface";
import UserInterface from "../../App/User/User.interface";
import {FRAME_STATUS} from "../../App/Frame/Frame.contant";
import LogClass from "../../App/Log/Log.class";
import {LOG_TYPE} from "../../App/Log/Log.constants";
import TaggedSentenceService from "../../App/TaggedSentence/TaggedSentence.service";
export default class FrameEditionListener extends Listener{
    async dispatch(data : {
        frame : FrameInterface,
        user : UserInterface
    }): Promise<any> {
        const statusName = `${Object.keys(FRAME_STATUS)[Object.values(FRAME_STATUS).indexOf(data.frame.status)]}`;
        if(data.frame.status === FRAME_STATUS['editing'])
            console.log(`Frame ${data.frame._id.toString()} editing status to ${statusName}`);
        else
            console.log(`Frame ${data.frame._id.toString()} editing status to ${statusName}`);
        await TaggedSentenceService.updateMany({frame:data.frame._id},{
            frameName : data.frame.name,
        });
        await LogClass.make({
            ref:data.frame._id,
            issuer:data.user._id,
            action:data.frame.createdAt.getTime() === data.frame.updatedAt.getTime() ? LOG_TYPE['store frame'] : LOG_TYPE['edit frame'],
            description:`قالب معنایی ( ${data.frame._id} | ${data.frame.name} )`,
        })

    }
}