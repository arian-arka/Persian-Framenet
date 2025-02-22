import {MongooseService} from "../../Core/Class/MongooseService";
import {MessageModel} from "./Message.model";
import {MessageInterface, PaginateMessageInterface} from "./Message.interface";
import {Document, Types} from "mongoose";
import FrameInterface from "../Frame/Frame.interface";
import {TaggedSentenceInterface} from "../TaggedSentence/TaggedSentence.interface";
import UserInterface from "../User/User.interface";

export default new class MessageService extends MongooseService<MessageInterface> {
    constructor() {
        super(MessageModel);
    }

    async makeSeen(issuedFor : Types.ObjectId|string){
        return await this.updateMany({issuedFor,seen:null},{
            seen : Date.now()
        })
    }

    async deleteMessagesOfUser(user : UserInterface){
        return await this.deleteMany({
            '$or' : [
                {issuer : user._id},
                {issuedFor : user._id},
            ],
        })
    }
    async messageOfTaggedSentence(taggedSentence : TaggedSentenceInterface) : Promise<string>{
        const msg = await MessageModel.findOne({
            ref : taggedSentence._id,
            createdAt:{
                '$gte' : taggedSentence.updatedAt
            }
        }).exec();
        return msg?.message ?? '';
    }
    async messageOfFrame(frame : FrameInterface) : Promise<string>{
        const msg = await MessageModel.findOne({
            ref : frame._id,
            createdAt:{
                '$gte' : frame.updatedAt
            }
        }).exec();
        return msg?.message ?? '';
    }

    async unreadMessagesCount(user: Types.ObjectId | string): Promise<number> {
        return await MessageModel.countDocuments({issuedFor: user, seen: null,}).exec();
    }

    async unreadCount(user: Types.ObjectId | string){
        return await this._model.countDocuments({
            issuedFor: user,
            seen:null
        }).exec();
    }

    async notifications(user: Types.ObjectId | string, limit: number = 100): Promise<(Document<unknown, any, MessageInterface> & Omit<MessageInterface & Required<{ _id: Types.ObjectId; }>, never>)[]> {
        return await MessageModel.find({
            issuedFor: user,
            seen:null
        })
            .sort({_id: -1})
            .limit(limit)
            .exec();
    }

    async list(data: PaginateMessageInterface, user: Types.ObjectId | string) {
        const query: any = {issuedFor: user,};
        if (!!data.isFor)
            query['isFor'] = data.isFor;
        if(data.opened === true)
            query['openedAt'] = {'$exists':true,'$ne':null};
        else if(data.opened === false)
            query['$or'] = [
                {'openedAt' : {'$exists':false}},
                {'openedAt' : {'$eq':null}},
            ]
        console.log('dataaaaaaaaaaaaaaaaaaaa',query);
        return this.paginate<PaginateMessageInterface>({
            data,
            query,
            sort: {
                updatedAt: -1
            }
        })
    }
}