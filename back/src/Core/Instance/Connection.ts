import Framework from "../Framework";
import {FastifyInstance} from "fastify";

export default class Connection {
    private connections: { [key: string]: any } = {};

    async openALl(): Promise<Connection> {
        for (const [key, value] of Object.entries(require("../../Database/Connection").default(Framework.Config))) {
            // @ts-ignore
            const con = await value['open']();
            // @ts-ignore
            this.connections[key] = [con, value['close']];
        }
        return this;
    }

    async closeAll(): Promise<Connection> {
        for (const value of Object.values(this.connections))
            await value[1](value[0]);
        return this;
    }

    connection(key: string): any {
        return this.connections[key];
    }

    static async start(fastify : FastifyInstance) : Promise<Connection>{
        return (new Connection()).openALl();
    }
}