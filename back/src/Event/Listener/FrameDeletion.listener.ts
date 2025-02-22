import Listener from "../../Core/Class/Listener";
import FrameInterface from "../../App/Frame/Frame.interface";
import UserInterface from "../../App/User/User.interface";
import ElementService from "../../App/Element/Element.service";
import LexicalUnitService from "../../App/LexicalUnit/LexicalUnit.service";
import TaggedSentenceService from "../../App/TaggedSentence/TaggedSentence.service";
import LogClass from "../../App/Log/Log.class";
import {LOG_TYPE} from "../../App/Log/Log.constants";
import {TAGGED_SENTENCE_STATUS} from "../../App/TaggedSentence/TaggedSentence.constant";
import FrameService from "../../App/Frame/Frame.service";
import {Types} from "mongoose";
export default class FrameDeletionListener extends Listener {
    async makeEmpty(search : any,frame : FrameInterface){
        return await TaggedSentenceService.updateMany(search, {
            frameNetTags: [],
            frame: null,
            lexicalUnit: null,
            status: TAGGED_SENTENCE_STATUS['unchanged'],
            issuer: null,
            reviewer: null,
            lexicalUnitName: null,
            frameName: null,
            description : `قالب معنایی ${frame.name} حذف شده است`
        })
    }
    async dispatch(data: {
        frame: FrameInterface,
        user: UserInterface,
        soft?:boolean
    }): Promise<any> {
        if(data?.soft){
            await this.makeEmpty({frame: data.frame._id},data.frame);
            await LogClass.make({
                issuer:data.user._id,
                action:LOG_TYPE['delete frame'],
                description:`حذف موقت فالب معنایی ( ${data.frame._id} | ${data.frame.name} )`,
            })
            return;
        }
        if(data.frame.mirror)
            await FrameService.update((data.frame.mirror as Types.ObjectId),{'mirror' : null});
        await ElementService.deleteMany({frame: data.frame._id});
        await LexicalUnitService.deleteMany({frame: data.frame._id});
        await this.makeEmpty({frame: data.frame._id},data.frame);
        await LogClass.make({
            issuer:data.user._id,
            action:LOG_TYPE['delete frame'],
            description:`قالب معنایی ( ${data.frame._id} | ${data.frame.name} )`,
        })

    }
}