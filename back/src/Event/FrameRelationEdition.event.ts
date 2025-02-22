import FrameInterface from "../App/Frame/Frame.interface";
import Event from "../Core/Class/Event";
import FrameRelationEditionListener from "./Listener/FrameRelationEdition.listener";
export default class FrameRelationEditionEvent extends Event<FrameInterface>{
    listeners=[
        FrameRelationEditionListener,
    ];
}