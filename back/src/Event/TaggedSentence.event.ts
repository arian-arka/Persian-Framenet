import Event from "../Core/Class/Event";
import {TaggedSentenceInterface} from "../App/TaggedSentence/TaggedSentence.interface";
import TaggedSentenceEditionListener from "./Listener/TaggedSentenceEdition.listener";
export default class TaggedSentenceEvent extends Event<TaggedSentenceInterface>{
    listeners=[
        TaggedSentenceEditionListener,
    ];
}