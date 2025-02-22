import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import {TaggedSentenceInterface} from "../../App/TaggedSentence/TaggedSentence.interface";
import LogClass from "../../App/Log/Log.class";
import Framework from "../../Core/Framework";
import {TAGGED_SENTENCE_STATUS} from "../../App/TaggedSentence/TaggedSentence.constant";
import {LOG_TYPE} from "../../App/Log/Log.constants";
export default class TaggedSentenceStatusEditionListener extends Listener{
    async dispatch(data : {
        previousStatus : number,
        taggedSentence : TaggedSentenceInterface,
        user : UserInterface
    }): Promise<any> {
        const oldStatus = Framework.Language.generate(`frame.status.${Object.keys(TAGGED_SENTENCE_STATUS)[Object.values(TAGGED_SENTENCE_STATUS).indexOf(data.previousStatus)]}`);
        const newStatus = Framework.Language.generate(`frame.status.${Object.keys(TAGGED_SENTENCE_STATUS)[Object.values(TAGGED_SENTENCE_STATUS).indexOf(data.taggedSentence.status)]}`);

        await LogClass.make({
            ref:data.taggedSentence._id,
            issuer:data.user._id,
            additionalInfo : {
                status : data.taggedSentence.status,
            },
            action: LOG_TYPE['change taggedSentenceStatus'],
            description:`تغییر وضعیت ${oldStatus} به ${newStatus} برای برچسب جمله ( ${data.taggedSentence._id} | ${data.taggedSentence?.words} )`,
        })
    }
}