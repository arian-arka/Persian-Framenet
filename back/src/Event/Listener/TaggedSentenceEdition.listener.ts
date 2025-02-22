import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import {TaggedSentenceInterface} from "../../App/TaggedSentence/TaggedSentence.interface";
import LogClass from "../../App/Log/Log.class";
import {LOG_TYPE} from "../../App/Log/Log.constants";
import LexicalUnitService from "../../App/LexicalUnit/LexicalUnit.service";
import {Types} from "mongoose";

export default class TaggedSentenceEditionListener extends Listener {
    async dispatch(data: {
        previousTaggedSentence?: TaggedSentenceInterface,
        taggedSentence: TaggedSentenceInterface,
        user: UserInterface,
        isNew?: boolean
    }): Promise<any> {
        if (data.taggedSentence.lexicalUnit) {
            if (!data.previousTaggedSentence?.lexicalUnit)
                await LexicalUnitService._model.updateOne({_id: data.taggedSentence.lexicalUnit}, {
                    '$inc': {taggedSentenceCount: 1}
                }).exec();
            else if(!(data.taggedSentence.lexicalUnit as Types.ObjectId).equals(data.previousTaggedSentence.lexicalUnit as Types.ObjectId)){
                await LexicalUnitService._model.updateOne({_id: data.taggedSentence.lexicalUnit}, {
                    '$inc': {taggedSentenceCount: 1}
                }).exec();

                await LexicalUnitService._model.updateOne({_id: data.previousTaggedSentence.lexicalUnit}, {
                    '$inc': {taggedSentenceCount: -1}
                }).exec();
            }

        } else if (data?.previousTaggedSentence?.lexicalUnit) { // deleted
            await LexicalUnitService._model.updateOne({_id: data.previousTaggedSentence.lexicalUnit}, {
                '$inc': {taggedSentenceCount: -1}
            }).exec();
        }

        await LogClass.make({
            ref: data.taggedSentence._id,
            additionalInfo: {
                status: data.taggedSentence.status,
            },
            issuer: data.user._id,
            action: data.taggedSentence.createdAt.getTime() === data.taggedSentence.updatedAt.getTime() ? LOG_TYPE['store taggedSentence'] : LOG_TYPE['edit taggedSentence'],
            description: ` برچسب های جمله ( ${data.taggedSentence._id} | ${data.taggedSentence?.words} ) `,
        })
    }
}