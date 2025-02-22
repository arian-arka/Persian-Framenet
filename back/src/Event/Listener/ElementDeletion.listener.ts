import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import {ElementInterface} from "../../App/Element/Element.interface";
import {Types} from "mongoose";
import FrameService from "../../App/Frame/Frame.service";
import TaggedSentenceService from "../../App/TaggedSentence/TaggedSentence.service";
import {TAGGED_SENTENCE_STATUS} from "../../App/TaggedSentence/TaggedSentence.constant";
import LogClass from "../../App/Log/Log.class";
import {LOG_TYPE} from "../../App/Log/Log.constants";
export default class ElementDeletionListener extends Listener {
    async dispatch(data: {
        element: ElementInterface,
        user: UserInterface
    }): Promise<any> {
        await FrameService.updateStatusToEditing(data.element.frame as Types.ObjectId,data.user._id);
        await TaggedSentenceService.updateMany({
            'frameNetTags': {
                '$elemMatch':{
                    'element' : data.element._id
                }
            }
        }, {
            '$set': {
                'frameNetTags.$.element' : null,
                'issuer' : null,
                'reviewr' : null,
                'status' : TAGGED_SENTENCE_STATUS['unchanged'],
                'description' : `جزء معنایی ${data.element.name} حذف شده است`,
            },
            '$inc' : {
                'frameNetTags.$.tagType' : -5,
            }
        })

        const frame = await FrameService.find(data.element.frame as Types.ObjectId);

        await LogClass.make({
            issuer:data.user._id,
            action:LOG_TYPE['delete element'],
            description:`قالب معنایی ( ${frame?._id} | ${frame?.name} ) - جز معنایی ( ${data.element.name} | ${data.element._id} )`,
        })
    }
}