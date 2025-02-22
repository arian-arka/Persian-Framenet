import Event from "../Core/Class/Event";
import LexicalUnitEditionListener from "./Listener/LexicalUnitEdition.listener";
import {LexicalUnitInterface} from "../App/LexicalUnit/LexicalUnit.interface";
export default class LexicalUnitEvent extends Event<LexicalUnitInterface>{
    listeners=[
        LexicalUnitEditionListener,
    ];
}