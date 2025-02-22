import FrameInterface from "../App/Frame/Frame.interface";
import Event from "../Core/Class/Event";
import FrameDeletionListener from "./Listener/FrameDeletion.listener";
export default class FrameDeletionEvent extends Event<FrameInterface>{
    listeners=[
        FrameDeletionListener,
    ];
}