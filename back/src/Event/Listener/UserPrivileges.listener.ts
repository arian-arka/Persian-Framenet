import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";

export default class UserPrivilegesListener extends Listener{
    async dispatch(data : {
        user : UserInterface
    }): Promise<any> {
        //change all frames,elements,... where user is editing to null

    }
}