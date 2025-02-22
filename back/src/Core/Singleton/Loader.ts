import File from "./File";

class Loader {
    static toCamelCase(name: string): string {
        return name.substring(0, 1).toLowerCase() + (name.length > 0 ? name.substring(1) : '');
    }

    js(base: string, callback: Function, secondExtension: string | undefined = undefined): void {
        File.gatherFilesSync(base, callback, (secondExtension && secondExtension.length) ? [secondExtension, 'js'] : ['js']);
    }

    tap(base: string, secondExtension: string | undefined = undefined): void {
        this.js(base, (name: any, ext: any, path: string) => require(path), secondExtension);
    }

    default(base: string, callbackOrGet: Function | boolean = true, secondExtension: string | undefined = undefined): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (callbackOrGet === true) {
            this.js(base, (name: string, ext: string, path: string) => {
                data[name] = require(path).default;
            }, secondExtension)
        } else if (typeof callbackOrGet === 'function') {
            this.js(base, (name: string, ext: string, path: string) => {
                data[name] = callbackOrGet(path);
            }, secondExtension)
        }

        return data;
    }

    object(base: string, callbackOrGet: Function | boolean = true, secondExtension: string | undefined = undefined): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (callbackOrGet === true) {
            this.js(base, (name: string, ext: string, path: string) => {
                const cls = require(path).default;
                data[cls.name] = new cls;
            }, secondExtension)
        } else if (typeof callbackOrGet === 'function') {
            this.js(base, (name: string, ext: string, path: string) => {
                data[name] = callbackOrGet(require(path).default);
            }, secondExtension)
        }

        return data;
    }

}

export default new Loader();