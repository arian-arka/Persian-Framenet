class Log {
    private _enabled = true;

    print(title: string|number|boolean, data: any, textColor: string, backgroundColor: string) {
        if (!this._enabled)
            return;

        console.log(`%c < -------------| ${title} |-------------> `, `background: ${backgroundColor}; color: ${textColor}`);
        console.log(data);
        console.log(`%c < == END == > `, `background: ${backgroundColor}; color: ${textColor}`);
    }

    secondary(title: string|number|boolean, data: any){
        this.print(title,data,'#838181','#ffffff')
    }
    warning(title: string|number|boolean, data: any){
        this.print(title,data,'#e59052','#ffffff')
    }
    primary(title: string|number|boolean, data: any){
        this.print(title,data,'#3c81c5','#ffffff')
    }
    danger(title: string|number|boolean, data: any){
        this.print(title,data,'#e51616','#ffffff')
    }
    success(title: string|number|boolean, data: any){
        this.print(title,data,'#10c70a','#ffffff')
    }
    unknown(title: string|number|boolean, data: any){
        this.print(title,data,'#5f0ac7','#ffffff')
    }
    debug(title: string|number|boolean, data: any){
        this.print(title,data,'#f3db3d','#ffffff')
    }
}

export default new Log();