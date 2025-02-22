import Event from "../Core/Class/Event";
import UserInterface from "../App/User/User.interface";
import UserDeletionListener from "./Listener/UserDeletion.listener";

export default class UserDeletionEvent extends Event<UserInterface>{
    listeners=[
        UserDeletionListener
    ];
}