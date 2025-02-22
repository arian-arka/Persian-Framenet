import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import {SentenceInterface} from "../../App/Sentence/Sentence.interface";
import TaggedSentenceService from "../../App/TaggedSentence/TaggedSentence.service";
import LogClass from "../../App/Log/Log.class";
import {LOG_TYPE} from "../../App/Log/Log.constants";
import LexicalUnitService from "../../App/LexicalUnit/LexicalUnit.service";
export default class SentenceEditionListener extends Listener{
    async dispatch(data : {
        sentence : SentenceInterface,
        user : UserInterface
    }): Promise<any> {
        let taggedSentences : any = await TaggedSentenceService._model.find({sentence:data.sentence._id, lexicalUnit: {'$ne': null}}, {lexicalUnit: 1}).exec();
        taggedSentences = taggedSentences.map((el : any) => el.lexicalUnit);
        if (taggedSentences.length)
            await LexicalUnitService.updateMany({'_id': {'$in': taggedSentences}}, {
                '$inc': {taggedSentenceCount: -1}
            });

        await TaggedSentenceService.makeEmptyForSentences(data.sentence._id);
        await TaggedSentenceService.updateMany({sentence:data.sentence._id}, {
            words : data.sentence.words
        });
        await LogClass.make({
            ref:data.sentence._id,
            issuer:data.user._id,
            action:data.sentence.createdAt.getTime() === data.sentence.updatedAt.getTime() ? LOG_TYPE['store sentence'] : LOG_TYPE['edit sentence'],
            description:` جمله ( ${data.sentence.words} | ${data.sentence._id} )`,
        })
    }
}