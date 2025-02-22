import FrameInterface from "../App/Frame/Frame.interface";
import Event from "../Core/Class/Event";
import FrameEditionListener from "./Listener/FrameEdition.listener";
export default class FrameEvent extends Event<FrameInterface>{
    listeners=[
        FrameEditionListener,
    ];
}