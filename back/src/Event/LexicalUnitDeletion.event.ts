import Event from "../Core/Class/Event";
import {LexicalUnitInterface} from "../App/LexicalUnit/LexicalUnit.interface";
import LexicalUnitDeletionListener from "./Listener/LexicalUnitDeletion.listener";
export default class LexicalUnitDeletionEvent extends Event<LexicalUnitInterface>{
    listeners=[
        LexicalUnitDeletionListener,
    ];
}