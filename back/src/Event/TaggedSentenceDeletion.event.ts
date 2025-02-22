import Event from "../Core/Class/Event";
import {TaggedSentenceInterface} from "../App/TaggedSentence/TaggedSentence.interface";
import TaggedSentenceDeletionListener from "./Listener/TaggedSentenceDeletion.listener";
export default class FrameDeletionEvent extends Event<TaggedSentenceInterface>{
    listeners=[
        TaggedSentenceDeletionListener,
    ];
}