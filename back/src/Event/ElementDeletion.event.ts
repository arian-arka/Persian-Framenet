import Event from "../Core/Class/Event";
import ElementDeletionListener from "./Listener/ElementDeletion.listener";
import {ElementInterface} from "../App/Element/Element.interface";
export default class ElementDeletionEvent extends Event<ElementInterface>{
    listeners=[
        ElementDeletionListener,
    ];
}