import InternalServerError from "../Response/500/InternalServerError";

class Hash {
    private _rounds = 12;
    setRounds(r : number){
        this._rounds = r;
        return this;
    }
    async make(plain : string) : Promise<string> {
        const lib = require('bcrypt');
        try{
            const salt = await lib.genSalt(this._rounds);
            return await lib.hash(plain, salt);
        }catch (e){
            console.log(e);
            throw new InternalServerError('Could not hash.');
        }
    }

    async check(hashed:string,plain:string) : Promise<boolean>{
        const lib = require('bcrypt');
        return await lib.compare(plain, hashed);
    }
}

export default new Hash();