import {array} from "yup";

export function removeEmpty(data : any,to = {
    'array' : undefined,
    'object' : undefined,
    'string' : '',
    'undefined' : '',
    'null' : '',
}) : any{
    if(Array.isArray(data))
        return data.length === 0 ? to['array'] : data;
    else if(typeof data === 'string')
        return data.length === 0 || data === '' ? to['string'] : data;
    else if(data === undefined)
        return to['undefined'];
    else if(data === null)
        return to['null'];
    else if(typeof data === 'object')
        return Object.keys(data).length === 0 ? to['object'] : data;
    return data;
}

export function removeEmptiesInObject(data : any,to = {
    'array' : undefined,
    'object' : undefined,
    'string' : '',
    'undefined' : '',
    'null' : '',
}) : any{
    if(Array.isArray(data)){
        const arr = [];
        for(let el of data)
            arr.push(removeEmptiesInObject(el,to));
        return arr.length === 0 ? to['array'] : arr;
    }
    else if(typeof data === 'string')
        return data.length === 0 || data === '' ? to['string'] : data;
    else if(data === undefined)
        return to['undefined'];
    else if(data === null)
        return to['null'];
    else if(typeof data === 'object'){
        const newObj : any = {};
        for(let key in data)
            newObj[key] = removeEmptiesInObject(data[key],to);
        return Object.keys(newObj).length === 0 ? to['object'] : newObj;
    }

    return data;
}