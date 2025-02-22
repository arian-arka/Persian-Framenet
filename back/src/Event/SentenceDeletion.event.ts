import Event from "../Core/Class/Event";
import SentenceDeletionListener from "./Listener/SentenceDeletion.listener";
import {SentenceInterface} from "../App/Sentence/Sentence.interface";
export default class SentenceDeletionEvent extends Event<SentenceInterface>{
    listeners=[
        SentenceDeletionListener,
    ];
}