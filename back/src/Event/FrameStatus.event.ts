import FrameInterface from "../App/Frame/Frame.interface";
import Event from "../Core/Class/Event";
import FrameStatusEditionListener from "./Listener/FrameStatusEdition.listener";
export default class FrameStatusEvent extends Event<FrameInterface>{
    listeners=[
        FrameStatusEditionListener,
    ];
}