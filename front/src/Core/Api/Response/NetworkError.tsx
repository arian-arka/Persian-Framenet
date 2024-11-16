import Response from "./Response";

export class NetworkError extends Response<Error>{
    constructor(e : Error) {
        super(new Headers(),-1,false,e,true);
    }

    message(){
        return this.data.message;
    }
    stack(){
        return this.data.stack;
    }
}