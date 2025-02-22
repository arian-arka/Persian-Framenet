import Event from "../Core/Class/Event";
import SentenceEditionListener from "./Listener/SentenceEdition.listener";
import {SentenceInterface} from "../App/Sentence/Sentence.interface";
export default class SentenceEvent extends Event<SentenceInterface>{
    listeners=[
        SentenceEditionListener,
    ];
}