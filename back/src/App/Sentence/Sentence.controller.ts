import {FastifyRequest} from "fastify";
import StoreSentenceValidation from "./Validation/StoreSentence.validation";
import {EditSentenceInterface, PaginateSentenceInterface, StoreSentenceInterface} from "./Sentence.interface";
import SentenceService from "./Sentence.service";
import SentenceEvent from "../../Event/Sentence.event";
import EditSentenceValidation from "./Validation/EditSentence.validation";
import SentenceDeletionEvent from "../../Event/SentenceDeletion.event";
import ListSentenceValidation from "./Validation/ListSentence.validation";

export default class SentenceController {
    constructor() {
    }

    async store(request: FastifyRequest) {
        const user = request.user;
        await request.gate('Sentence.store', user);

        const validation = await StoreSentenceValidation.forBody<StoreSentenceInterface>(request);

        const sentence = await SentenceService.create({...validation.data(),words:validation.data().words.join(' ')});

        await SentenceEvent.fire({sentence, user})

        return sentence;
    }

    async edit(request: FastifyRequest<{ Params?: { sentence?: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Sentence.edit', user);

        const sentence = await SentenceService.findOrFail(request?.params?.sentence);

        const validation = await EditSentenceValidation.forBody<EditSentenceInterface>(request, sentence);

        if(validation.data().words.join(' ') === sentence.words)
            return sentence;

        const updatedSentence = await SentenceService.updateAndGet(sentence._id, {...validation.data(),words:validation.data().words.join(' ')});

        await SentenceEvent.fire({'sentence': updatedSentence, user})

        return updatedSentence;
    }

    async destroy(request: FastifyRequest<{ Params: { sentence: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Sentence.delete', user);

        const sentence = await SentenceService.findOrFail(request.params.sentence);

        await SentenceDeletionEvent.fire({sentence, user})

        await SentenceService.delete(sentence._id);

        return {};
    }

    async show(request: FastifyRequest<{ Params: { sentence: string | null | undefined } }>) {
        const user = request.user;

        await request.gate('Sentence.show', user)

        return  await SentenceService.findOrFail(request.params.sentence);
    }

    async tagged(request: FastifyRequest<{ Params: { sentence: string | null | undefined } }>) {
        const user = request.user;
        const sentence = await SentenceService.findOrFail(request.params.sentence);
        await request.gate('Sentence.show', user)

        return await SentenceService.tagged(sentence._id);
    }


    async list(request: FastifyRequest) {
        const user = request.user;

        await request.gate('Sentence.list', user);

        const validation = await ListSentenceValidation.forBody<PaginateSentenceInterface>(request);

        return await SentenceService.list(validation.data());
    }
}