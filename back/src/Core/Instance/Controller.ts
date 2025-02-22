import SetterGetter from "../Class/SetterGetter";
import Path from "../Singleton/Path";


export default class Controller extends SetterGetter {
    private controllers: { [key: string]: any } = {};

    get(controller: string) {
        if (!(controller in this.controllers))
            this.controllers[controller] = new (require(`${Path.appPath(...controller.split('/'))}.controller`).default);

        return this.controllers[controller];
    }
    static _test=0;
    generateFastifyHandler(handler: string | [string, string] | Function): any {
        let outSide = this;
        if (Array.isArray(handler)) {
            if (this.get(handler[0])[handler[1]].constructor.name === 'AsyncFunction')
                return async function (request: any, reply: any) {
                    reply.send(await outSide.get(handler[0])[handler[1]](request, reply));
                    await reply;
                }
            else
                return function (request: any, reply: any) {
                    outSide.get(handler[0])[handler[1]](request, reply)
                };

        } else if (typeof handler === 'string') {
            const splitted = handler.split('@');
            if (splitted.length === 1)
                return this.generateFastifyHandler([splitted[0], 'index']);
            return this.generateFastifyHandler([splitted[0], splitted[1]]);
        } else
            return handler;
    }
}
;