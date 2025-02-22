import Event from "../Core/Class/Event";
import {TaggedSentenceInterface} from "../App/TaggedSentence/TaggedSentence.interface";
import TaggedSentenceStatusEditionListener from "./Listener/TaggedSentenceStatusEdition.listener";
export default class TaggedSentenceStatusEvent extends Event<TaggedSentenceInterface>{
    listeners=[
        TaggedSentenceStatusEditionListener,
    ];
}