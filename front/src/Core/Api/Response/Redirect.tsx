import Response from "./Response";
export class Redirect extends Response<string>{
    constructor(headers: Headers, status: number, url: string,isRealRequest : boolean = true) {
        super(headers,status,false,url,isRealRequest);
    }

    url(){
        return this.data;
    }

    follow(){
        location.href = this.data;
    }

}