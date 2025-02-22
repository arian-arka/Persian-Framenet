import UserInterface from "./User.interface";
import Forbidden from "../../Core/Response/400/Forbidden";
import {USER_PRIVILEGES} from "./User.contant";

export default class UserGate{

    async register(user : UserInterface,){
        if(!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['store user']))
            throw Forbidden.instance();
    }
    async edit(user : UserInterface,targetUser : UserInterface){
        if(user._id.equals(targetUser._id) && (user.isSuperAdmin || user.privileges.includes(USER_PRIVILEGES['edit user'])))
            return;
        if((!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['edit user'])) || targetUser.isSuperAdmin)
            throw Forbidden.instance();
    }
    async delete(user : UserInterface,targetUser : UserInterface){
        if((!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['delete user'])) || targetUser.isSuperAdmin)
            throw Forbidden.instance();
    }
    async show(user : UserInterface,targetUser : UserInterface){
        if((!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['show user'])) || targetUser.isSuperAdmin)
            throw Forbidden.instance();
    }
}