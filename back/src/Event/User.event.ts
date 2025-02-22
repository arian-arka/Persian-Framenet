import Event from "../Core/Class/Event";
import UserPrivilegesListener from "./Listener/UserPrivileges.listener";
import UserInterface from "../App/User/User.interface";

export default class UserEvent extends Event<UserInterface>{
    listeners=[
        UserPrivilegesListener
    ];
}