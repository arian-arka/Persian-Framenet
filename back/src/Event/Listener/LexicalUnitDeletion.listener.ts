import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import {Types} from "mongoose";
import {LexicalUnitInterface} from "../../App/LexicalUnit/LexicalUnit.interface";
import FrameService from "../../App/Frame/Frame.service";
import TaggedSentenceService from "../../App/TaggedSentence/TaggedSentence.service";
import {TAGGED_SENTENCE_STATUS} from "../../App/TaggedSentence/TaggedSentence.constant";
import LogClass from "../../App/Log/Log.class";
import {LOG_TYPE} from "../../App/Log/Log.constants";
import {LEXICAL_UNIT_TYPE} from "../../App/LexicalUnit/LexicalUnit.contant";
export default class LexicalUnitDeletionListener extends Listener{
    async dispatch(data : {
        lexicalUnit : LexicalUnitInterface,
        user : UserInterface
    }): Promise<any> {
        await FrameService.updateStatusToEditing(data.lexicalUnit.frame as Types.ObjectId,data.user._id);
        await TaggedSentenceService.updateMany({lexicalUnit:data.lexicalUnit._id},{
            lexicalUnit:null,
            lexicalUnitName:null,
            issuer : null,
            reviewer : null,
            status : TAGGED_SENTENCE_STATUS['unchanged'],
            'description' : `واحد واژگانی ${data.lexicalUnit.name + '.' + Object.keys(LEXICAL_UNIT_TYPE)[Object.values(LEXICAL_UNIT_TYPE).indexOf(data.lexicalUnit.type)]} حذف شده است`,
        })
        const frame = await FrameService.find(data.lexicalUnit.frame as Types.ObjectId);
        await LogClass.make({
            issuer:data.user._id,
            action:LOG_TYPE['delete lexicalUnit'],
            description:`قالب معنایی ( ${frame?._id} | ${frame?.name} ) - واحد واژگانی ( ${data.lexicalUnit.name} | ${data.lexicalUnit._id} )`,
        })
    }
}