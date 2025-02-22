import Event from "../Core/Class/Event";
import ElementEditionListener from "./Listener/ElementEdition.listener";
import {ElementInterface} from "../App/Element/Element.interface";
export default class ElementEvent extends Event<ElementInterface>{
    listeners=[
        ElementEditionListener,

    ];
}