import {FastifyRequest} from "fastify/types/request";
import WaitingTaggedSentenceOfLogValidation from "./Validation/WaitingTaggedSentenceOfLog.validation";
import {WaitingTaggedSentenceOfLogInterface} from "./Report.interface";
import ReportClass from "./Report.class";
import ReportService from "./Report.service";
import TaggedSentenceService from "../TaggedSentence/TaggedSentence.service";
import {TAGGED_SENTENCE_STATUS} from "../TaggedSentence/TaggedSentence.constant";

export default class ReportController {
    constructor() {
    }

    async waitingTaggedSentencesOfLogs(request: FastifyRequest) {
        const validation = await WaitingTaggedSentenceOfLogValidation.forBody<WaitingTaggedSentenceOfLogInterface>(request);
        return {
            'today': await ReportClass.waitingTaggedSentencesOfLogs(1, validation.data().users ?? []),
            'week': await ReportClass.waitingTaggedSentencesOfLogs(2, validation.data().users ?? []),
            'month': await ReportClass.waitingTaggedSentencesOfLogs(3, validation.data().users ?? []),
            'year': await ReportClass.waitingTaggedSentencesOfLogs(4, validation.data().users ?? []),
        }
    }

    async waitingTaggedSentences(request: FastifyRequest) {
        const validation = await WaitingTaggedSentenceOfLogValidation.forBody<WaitingTaggedSentenceOfLogInterface>(request);
        return await ReportClass.waitingTaggedSentences(validation.data().users ?? [])
    }


    async sample1(request: FastifyRequest) {
        const rep2 = (await ReportService.sample2()).map(e => e._id);
        const rep3 = (await ReportService.sample3())
            .map(e => [e.frame[0]?.name, e._id])
            .filter(e => !rep2.includes(e[1]));
        return {
            '1': (await ReportService.sample1()).length,
            '2': rep2.length,
            '3': rep3.length,
            '4': rep2,
            '5': rep3,
        };
    }

    async sample2(request: FastifyRequest) {
        //return await TaggedSentenceService.updateMany({status:TAGGED_SENTENCE_STATUS['waiting'],issuer:'6483770d5573c95c1be3f184'},{status:TAGGED_SENTENCE_STATUS['editing']});

        return {
            editing : (await TaggedSentenceService.all({status:TAGGED_SENTENCE_STATUS['editing'],issuer:'6483770d5573c95c1be3f184'})).length,
            waiting : (await TaggedSentenceService.all({status:TAGGED_SENTENCE_STATUS['waiting'],issuer:'6483770d5573c95c1be3f184'})).length,
        };

        return ;
        return await ReportService.sample4();

    }
}