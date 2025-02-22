import {uuid} from "uuidv4";

class Random {
    string(length: number = 16, characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'): string {
        let result = '';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    uuidWithAppendedString(length: number = 16, sep = '', characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'): string {
        return uuid() + sep + this.string(length, characters);
    }

    uuidWithPrependedString(length: number = 16, sep = '', characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'): string {
        return this.string(length, characters) + sep + uuid();
    }
}

export default new Random();