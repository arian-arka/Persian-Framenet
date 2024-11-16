import Api from "../Core/Api/Api";


class TestApi extends Api {
    constructor() {
        super();
    }
    test1() {
        return this._fetch<{ key : string }>({
            method: `GET`,
            url: `/test/1`,
        })
    }

}
export default TestApi;