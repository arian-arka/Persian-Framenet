import Forbidden from "../../Core/Response/400/Forbidden";
import UserInterface from "../User/User.interface";
import {USER_PRIVILEGES} from "../User/User.contant";
import {TAGGED_SENTENCE_STATUS} from "./TaggedSentence.constant";
import {TaggedSentenceInterface} from "./TaggedSentence.interface";
import {Types} from "mongoose";

export default class TaggedSentenceGate {
    async store(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['store tagged sentence']))
            throw Forbidden.instance();
    }

    async edit(user: UserInterface, taggedSentence: TaggedSentenceInterface) {
        if (user.isSuperAdmin)
            return;
        if (!user.privileges.includes(USER_PRIVILEGES['edit tagged sentence']) || (taggedSentence.issuer && taggedSentence.status === TAGGED_SENTENCE_STATUS['editing'] && !user._id.equals(taggedSentence.issuer as Types.ObjectId)))
            throw Forbidden.instance();
    }

    async editAndStore(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['edit tagged sentence']) && !user.privileges.includes(USER_PRIVILEGES['store tagged sentence']))
            throw Forbidden.instance();
    }

    async status(user: UserInterface, status: number, taggedSentence: TaggedSentenceInterface) {
        if (user.isSuperAdmin)
            return;

        if((status === TAGGED_SENTENCE_STATUS['published'] || status === TAGGED_SENTENCE_STATUS['refused']) && user.privileges.includes(USER_PRIVILEGES['publish tagged sentence']))
            return;

        if(
            taggedSentence.status === TAGGED_SENTENCE_STATUS['editing'] &&
            taggedSentence.issuer &&
            !user._id.equals(taggedSentence.issuer as Types.ObjectId)
        )
            throw Forbidden.instance();
        switch (status) {
            case TAGGED_SENTENCE_STATUS['waiting']:
            case TAGGED_SENTENCE_STATUS['editing']:
            case TAGGED_SENTENCE_STATUS['unchanged']:
                if(!user.privileges.includes(USER_PRIVILEGES['edit tagged sentence']) )
                    throw Forbidden.instance();
                break;
            case TAGGED_SENTENCE_STATUS['published']:
                if (!user.privileges.includes(USER_PRIVILEGES['publish tagged sentence']))
                    throw Forbidden.instance();
                break;
            case TAGGED_SENTENCE_STATUS['refused']:
                if (!user.privileges.includes(USER_PRIVILEGES['refuse tagged sentence']))
                    throw Forbidden.instance();
                break;
        }
    }

    async delete(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['delete tagged sentence']))
            throw Forbidden.instance();
    }

    async show(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['show tagged sentence']))
            throw Forbidden.instance();
    }

    async list(user: UserInterface) {
        if (!user.isSuperAdmin && !user.privileges.includes(USER_PRIVILEGES['show tagged sentence']))
            throw Forbidden.instance();
    }
}