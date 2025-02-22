import Listener from "../../Core/Class/Listener";
import FrameInterface from "../../App/Frame/Frame.interface";
import UserInterface from "../../App/User/User.interface";
import LogClass from "../../App/Log/Log.class";
import Framework from "../../Core/Framework";
import {FRAME_STATUS} from "../../App/Frame/Frame.contant";
import {LOG_TYPE} from "../../App/Log/Log.constants";
export default class FrameStatusEditionListener extends Listener{
    async dispatch(data : {
        previousStatus : number,
        frame : FrameInterface,
        user : UserInterface
    }): Promise<any> {
        const oldStatus = Framework.Language.generate(`frame.status.${Object.keys(FRAME_STATUS)[Object.values(FRAME_STATUS).indexOf(data.previousStatus)]}`);
        const newStatus = Framework.Language.generate(`frame.status.${Object.keys(FRAME_STATUS)[Object.values(FRAME_STATUS).indexOf(data.frame.status)]}`);
        await LogClass.make({
            ref:data.frame._id,
            issuer:data.user._id,
            action: LOG_TYPE['change frameStatus'],
            description:`تغییر وضعیت ${oldStatus} به ${newStatus} برای قالب معنایی ( ${data.frame._id} | ${data.frame.name} )`,
        })
    }
}