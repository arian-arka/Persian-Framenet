import Listener from "../../Core/Class/Listener";
import UserInterface from "../../App/User/User.interface";
import MessageService from "../../App/Message/Message.service";
import FrameService from "../../App/Frame/Frame.service";
import TaggedSentenceService from "../../App/TaggedSentence/TaggedSentence.service";

export default class UserDeletionListener extends Listener{
    async dispatch(data : {
        user : UserInterface
    }): Promise<any> {
        await MessageService.deleteMessagesOfUser(data.user);
        await FrameService.removeUserFromFrames(data.user._id);
        await TaggedSentenceService.removeUserFromTaggedSentences(data.user._id);
    }
}