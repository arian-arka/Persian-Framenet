import Api from "../Core/Api/Api";
import {object, string, number, date, InferType, array, boolean} from 'yup';
import Language from "../Core/Language";
import {EditElementInterface, ElementInterface, StoreElementInterface} from "../Type/Element.interface";
import StoreElementValidation from "../Validation/Element/StoreElement.validation";
import EditElementValidation from "../Validation/Element/EditElement.validation";
import Log from "../Core/Log";

class CsrfApi extends Api {
    constructor() {
        super(async () => {
            try{
                const f = await fetch(this.baseUrl + '/csrf');
                const csrf =  await f.text();
                Log.success('CSRF success',csrf);
                return csrf;
            }catch (e){
                Log.danger('CSRF failed',{});
                return false;
            }
        });
    }


}

export default CsrfApi;