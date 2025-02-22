import Config from "./Instance/Config";
import Connection from "./Instance/Connection";
import Language from "./Instance/Language";
import {FastifyInstance} from "fastify";
import Controller from "./Instance/Controller";
import Gate from "./Instance/Gate";

class Framework {
    public Config: Config = new Config();
    // @ts-ignore
    public Language: Language;
    // @ts-ignore
    public Connection: Connection;
    // @ts-ignore
    public Controller: Controller;
    // @ts-ignore
    public Gate: Gate;

    public debug : boolean;
    constructor() {
        this.debug = process.env.DEBUG === "true";
    }

    async needsFastify(fastify: FastifyInstance) {
        this.Language = new Language();
        this.Connection = await Connection.start(fastify);
        this.Gate = new Gate();
        this.Controller = new Controller();
    }

}

export default new Framework;