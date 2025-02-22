import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import {TaggedSentenceInterface} from "../../App/TaggedSentence/TaggedSentence.interface";
import LogClass from "../../App/Log/Log.class";
import {LOG_TYPE} from "../../App/Log/Log.constants";
import LexicalUnitService from "../../App/LexicalUnit/LexicalUnit.service";
export default class TaggedSentenceDeletionListener extends Listener{
    async dispatch(data : {
        taggedSentence : TaggedSentenceInterface,
        user : UserInterface
    }): Promise<any> {
        if(data.taggedSentence.lexicalUnit)
            await LexicalUnitService._model.updateOne({'_id':data.taggedSentence.lexicalUnit},{
                '$inc' : {taggedSentenceCount : -1}
            }).exec();
        await LogClass.make({
            issuer:data.user._id,
            action:LOG_TYPE['delete sentence'],
            description:`حذف برچسب های جمله ( ${data.taggedSentence._id} | ${data.taggedSentence?.words} ) `,
        })
    }
}