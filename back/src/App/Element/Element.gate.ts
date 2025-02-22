import Forbidden from "../../Core/Response/400/Forbidden";
import UserInterface from "../User/User.interface";
import {USER_PRIVILEGES} from "../User/User.contant";


export default class ElementGate {
    async store(user: UserInterface) {
        if (!user.isSuperAdmin && ! user.privileges.includes(USER_PRIVILEGES['store element']))
            throw Forbidden.instance();
    }

    async edit(user: UserInterface) {
        if (!user.isSuperAdmin && ! user.privileges.includes(USER_PRIVILEGES['edit element']))
            throw Forbidden.instance();
    }

    async delete(user: UserInterface) {
        if (!user.isSuperAdmin && ! user.privileges.includes(USER_PRIVILEGES['delete element']))
            throw Forbidden.instance();
    }

}