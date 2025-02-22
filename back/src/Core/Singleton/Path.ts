import * as path from "path";


class Path {
    publicPath(...args: string[]): string {
        return this.srcPath('Public',...args);
    }
    projectPath(...args: string[]): string {
        return path.join(__dirname, './../../../', ...args);
    }
    srcPath(...args: string[]): string {
        return path.join(__dirname, './../../', ...args);
    }
    basePath(...args: string[]): string {
        return this.srcPath('../', ...args);
    }
    configPath(...args: string[]) : string{
        return this.srcPath('Config',...args);
    }
    corePath(...args: string[]) : string{
        return this.srcPath('Core',...args);
    }
    langPath(...args: string[]) : string{
        return this.srcPath('Lang',...args);
    }
    appPath(...args : string[]) : string{
        return this.srcPath('App',...args);
    }
    providerPath(...args : string[]){
        return this.srcPath('Provider',...args);
    }

    connectionPath(...args : string[]){
        return this.srcPath('Connection',...args);
    }
}

export default new Path();