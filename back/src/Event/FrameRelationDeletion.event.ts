import FrameInterface from "../App/Frame/Frame.interface";
import Event from "../Core/Class/Event";
import FrameRelationDeletionListener from "./Listener/FrameRelationDeletion.listener";
export default class FrameRelationDeletionEvent extends Event<FrameInterface>{
    listeners=[
        FrameRelationDeletionListener,
    ];
}