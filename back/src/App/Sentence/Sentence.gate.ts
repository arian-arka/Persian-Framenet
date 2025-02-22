import Forbidden from "../../Core/Response/400/Forbidden";
import UserInterface from "../User/User.interface";
import {USER_PRIVILEGES} from "../User/User.contant";
import FrameInterface from "../Frame/Frame.interface";

export default class SentenceGate {
    async store(user : UserInterface){
        if(!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['store sentence']))
            throw Forbidden.instance();
    }

    async edit(user : UserInterface,frame : FrameInterface){
        if(!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['edit sentence']))
            throw Forbidden.instance();
    }

    async delete(user : UserInterface,frame : FrameInterface){
        if(!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['delete sentence']))
            throw Forbidden.instance();
    }
    async show(user : UserInterface){
        if(!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['show sentence']))
            throw Forbidden.instance();
    }

    async list(user : UserInterface){
        if(!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['show sentence']))
            throw Forbidden.instance();
    }
}