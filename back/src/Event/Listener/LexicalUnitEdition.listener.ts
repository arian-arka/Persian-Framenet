import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import FrameService from "../../App/Frame/Frame.service";
import {Types} from "mongoose";
import {LexicalUnitInterface} from "../../App/LexicalUnit/LexicalUnit.interface";
import LogClass from "../../App/Log/Log.class";
import {LOG_TYPE} from "../../App/Log/Log.constants";
import TaggedSentenceService from "../../App/TaggedSentence/TaggedSentence.service";

export default class LexicalUnitEditionListener extends Listener {
    async dispatch(data: {
        lexicalUnit: LexicalUnitInterface,
        user: UserInterface
    }): Promise<any> {
        await FrameService.updateStatusToEditing(data.lexicalUnit.frame as Types.ObjectId,data.user._id);
        const frame = await FrameService.find(data.lexicalUnit.frame as Types.ObjectId);
        await TaggedSentenceService.updateMany({'lexicalUnit':data.lexicalUnit._id},{
            'lexicalUnitName' : data.lexicalUnit.name,
        });
        await LogClass.make({
            ref:data.lexicalUnit._id,
            issuer:data.user._id,
            action: data.lexicalUnit.createdAt.getTime() === data.lexicalUnit.updatedAt.getTime() ? LOG_TYPE['store lexicalUnit'] : LOG_TYPE['edit lexicalUnit'],
            description:`قالب معنایی ( ${frame?._id} | ${frame?.name} ) - واحد واژگانی ( ${data.lexicalUnit.name} | ${data.lexicalUnit._id} )`,
        })
    }
}