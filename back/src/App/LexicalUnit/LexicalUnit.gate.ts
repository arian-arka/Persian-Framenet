import Forbidden from "../../Core/Response/400/Forbidden";
import UserInterface from "../User/User.interface";
import {USER_PRIVILEGES} from "../User/User.contant";


export default class LexicalUnitGate {
    async store(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['store lexicalUnit']))
            throw Forbidden.instance();
    }

    async edit(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['edit lexicalUnit']))
            throw Forbidden.instance();
    }

    async delete(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['delete lexicalUnit']))
            throw Forbidden.instance();
    }

}