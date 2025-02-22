import Loader from "../Singleton/Loader";
import Path from "../Singleton/Path";
import Forbidden from "../Response/400/Forbidden";

export default class Gate {

    private _gates: { [key: string]: any } = {};

    constructor() {
        this._gates = Loader.object(Path.appPath(), (obj : any) => new obj, 'gate')
    }

    async check(gate: string | Function, ...args: any[]) {
        let d;
        if (typeof gate === 'string') {
            const clsAndMethod = gate.split('.');
            d = this._gates[clsAndMethod[0]][clsAndMethod[1]].constructor.name === 'AsyncFunction' ?
                await this._gates[clsAndMethod[0]][clsAndMethod[1]](...args) :
                this._gates[clsAndMethod[0]][clsAndMethod[1]](...args);
        } else {
            d = gate.constructor.name === 'AsyncFunction' ? await gate() : gate();
        }
        if (d === false)
            throw Forbidden.forMessage('Unauthorized');
        if (typeof d === 'string' && d.length > 0)
            throw Forbidden.forMessage(d);
    }

}