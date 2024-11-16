import {EditElementInterface, ElementInterface, StoreElementInterface} from "../Type/Element.interface";
import StoreElementValidation from "../Validation/Element/StoreElement.validation";
import EditElementValidation from "../Validation/Element/EditElement.validation";
import CsrfApi from "./Csrf.api";

class ElementApi extends CsrfApi {
    constructor() {
        super();
    }
    list(frame : string){
        return this._fetch<ElementInterface[]>({
            method:'POST',
            url:`/api/element/list/${frame}`,
        });
    }

     show(element:string) {
        return this._fetch<ElementInterface>({
            method: `GET`,
            url: `/api/element/${element}`,
        });
    }

     delete(element:string) {
        return this._fetch<any>({
            method: `DELETE`,
            url: `/api/element/${element}`,
        });
    }

     store(frame : string,data: StoreElementInterface) {
        return this._fetch<ElementInterface>({
            method: `POST`,
            url: `/api/element/store/${frame}`,
            body : data,
            headers: {"Content-Type": "application/json",},
            validation : StoreElementValidation
        });
    }

     edit(element:string,data: EditElementInterface) {
        return this._fetch<ElementInterface>({
            method: `PUT`,
            url: `/api/element/${element}`,
            body : data,
            headers: {"Content-Type": "application/json",},
            validation : EditElementValidation
        });
    }

    reorder(orders : [string,string]) {
        return this._fetch<any>({
            method: `PUT`,
            url: `/api/element/reorder`,
            body : {
                element : orders[0],
                after : orders[1],
            },
            headers: {"Content-Type": "application/json",},
        });
    }

}

export default ElementApi;