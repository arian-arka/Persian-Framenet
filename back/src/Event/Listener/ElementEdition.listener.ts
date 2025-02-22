import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import {ElementInterface} from "../../App/Element/Element.interface";
import FrameService from "../../App/Frame/Frame.service";
import {Types} from "mongoose";
import LogClass from "../../App/Log/Log.class";
import {LOG_TYPE} from "../../App/Log/Log.constants";
export default class ElementEditionListener extends Listener {
    async dispatch(data: {
        element: ElementInterface,
        user: UserInterface
    }): Promise<any> {
        await FrameService.updateStatusToEditing(data.element.frame as Types.ObjectId, data.user._id);
        const frame = await FrameService.find(data.element.frame as Types.ObjectId);
        await LogClass.make({
            ref:data.element._id,
            issuer:data.user._id,
            action: data.element.createdAt.getTime() === data.element.updatedAt.getTime() ? LOG_TYPE['store element'] : LOG_TYPE['edit element'],
            description:`قالب معنایی ( ${frame?._id} | ${frame?.name} ) - جز معنایی ( ${data.element.name} | ${data.element._id} )`,
        })
    }
}