import Response from "../../Class/Response";

export default class Ok<T> extends Response<T>{
    status(): number {
        return 200;
    }
}
