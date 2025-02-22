import Forbidden from "../../Core/Response/400/Forbidden";
import UserInterface from "../User/User.interface";
import {USER_PRIVILEGES} from "../User/User.contant";
import {FRAME_STATUS} from "./Frame.contant";
import FrameInterface from "./Frame.interface";

export default class FrameGate {
    async cantSoftDelete(user: UserInterface,frame : FrameInterface){
        return !user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['delete frame']) && frame.deletedAt;
    }
    async softDelete(user: UserInterface,frame : FrameInterface){
        if(await this.cantSoftDelete(user,frame))
            throw Forbidden.instance();
    }

    async store(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['store frame']))
            throw Forbidden.instance();
    }

    async edit(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['edit frame']))
            throw Forbidden.instance();
    }

    async status(user: UserInterface, status: number) {
        if (user.isSuperAdmin)
            return;

        switch (status){
            case FRAME_STATUS['waiting']:
            case FRAME_STATUS['editing']:
            case FRAME_STATUS['unchanged']:
                return await this.edit(user);
            case FRAME_STATUS['published']:
                if(!user.privileges.includes(USER_PRIVILEGES['publish frame']))
                    throw Forbidden.instance();
                break;
            case FRAME_STATUS['refused']:
                if(!user.privileges.includes(USER_PRIVILEGES['refuse frame']))
                    throw Forbidden.instance();
                break;
        }
    }

    async delete(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['delete frame']))
            throw Forbidden.instance();
    }

    async show(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['show frame']))
            throw Forbidden.instance();
    }

    async list(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['show frame']))
            throw Forbidden.instance();
    }
}