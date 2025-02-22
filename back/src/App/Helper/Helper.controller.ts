import {FastifyRequest} from "fastify";
import Terminal from "../../Core/Singleton/Terminal";
import Path from "../../Core/Singleton/Path";
import Random from "../../Core/Singleton/Random";
import InternalServerError from "../../Core/Response/500/InternalServerError";
import {HelperModel} from "./Helper.model";
import {Configuration, OpenAIApi} from "openai";

export default class HelperController {
    constructor() {
    }

    async matchSentence(request: FastifyRequest<{
        Body?: {
            count?: number | null | undefined,
            lexicalUnit?: string | null | undefined,
            sentence?: string | null | undefined,
        }
    }>) {
        const lexicalUnit = request.body?.lexicalUnit;
        const sentence = request.body?.sentence;
        const count = request.body?.count ?? 20;

        if (!(!!sentence))
            return [];

        const id = Random.uuidWithAppendedString(32, '-');
        const pythonPath = Path.srcPath('../', 'Python', 'matchSentence.py');
        const command = `python "${pythonPath}" "${id}" "${sentence}" "@${!!lexicalUnit ? lexicalUnit : ''}" "${count}"`;
        console.log(command);
        try {
            await Terminal.run(command);
            const result = await HelperModel.findOne({id}).exec();
            await HelperModel.deleteOne({'_id': result?._id}).exec();
            return result?.data ?? [];
        } catch (e) {
            console.log(e);
            throw InternalServerError.instance();
        }
    }

    async matchFrame(request: FastifyRequest<{
        Body?: { lexicalUnit?: string | null | undefined, sentence?: string | null | undefined, }
    }>) {
        const lexicalUnit = request.body?.lexicalUnit;
        const sentence = request.body?.sentence;

        if (!(!!sentence) || !(!!lexicalUnit))
            return {content : ''};


        try {
            const configuration = new Configuration({
                organization: "org-nICzaHcf6gMajqESTvBvBaoR",
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            const response = await openai
                .createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "user",
                        content: `Using the framework of FrameNet, find the most relevant Frames for the lexical unit "${lexicalUnit}" in the following context. Compare the meaning of the lexical unit with the definitions of lexical units and frames in FrameNet, and rank the frames by their similarity : ${sentence}`
                    }],
                });
            const choices = response.data.choices;
            return !choices.length ? {content : ''} : {content : (choices[0]?.message?.content ?? '')};

        } catch (e) {
            // console.log('e',e);
            throw InternalServerError.instance();

        }
    }
}
// باز از افراد حاضر در محل می‌خواهند که آنها هم اقدام به تماس با دیگر گروه‌های امداد بکنند