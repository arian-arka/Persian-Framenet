import { FastifyRequest } from "fastify/types/request";
import WaitingTaggedSentenceOfLogValidation from "./Validation/WaitingTaggedSentenceOfLog.validation";
import { WaitingTaggedSentenceOfLogInterface} from "./Report.interface";
import ReportClass from "./Report.class";

export default class ReportController {
    constructor() {
    }

    async waitingTaggedSentencesOfLogs(request: FastifyRequest) {
        const validation = await WaitingTaggedSentenceOfLogValidation.forBody<WaitingTaggedSentenceOfLogInterface>(request);
        return {
            'today':await ReportClass.waitingTaggedSentencesOfLogs(1,validation.data().users ?? []),
            'week':await ReportClass.waitingTaggedSentencesOfLogs(2,validation.data().users ?? []),
            'month':await ReportClass.waitingTaggedSentencesOfLogs(3,validation.data().users ?? []),
            'year':await ReportClass.waitingTaggedSentencesOfLogs(4,validation.data().users ?? []),
        }
    }
    async waitingTaggedSentences(request: FastifyRequest) {
        const validation = await WaitingTaggedSentenceOfLogValidation.forBody<WaitingTaggedSentenceOfLogInterface>(request);
        return await ReportClass.waitingTaggedSentences(validation.data().users ?? [])
    }
}