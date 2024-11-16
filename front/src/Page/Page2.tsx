import {Component, createSignal} from "solid-js";
import Log from "../Core/Log";


const Page2: Component = () => {
    const [data,setData] = createSignal([
        1,2,3,4,5,6
    ],{equals:false});
    const onInput = (text) => {
        Log.debug('ON INPUT',text);
        const _ = data();
        for(let index in _)
            _[index]++;
        setData(_);
        Log.debug('ON INPUT',_);
    }

    return (
        <>



            {/*<DropDownInput*/}
            {/*    unique={true}*/}
            {/*    allowMultiple={true}*/}
            {/*    options={data()}*/}
            {/*    selected={''}*/}
            {/*    label={'label'}*/}
            {/*    customText={(val)=>{*/}
            {/*        Log.debug('CUSTOM VALUE',val);*/}
            {/*        return val;*/}
            {/*    }}*/}
            {/*    customComparator={(val,current)=>{*/}
            {/*        Log.debug('CUSTOM Comparator',[val,current]);*/}
            {/*        return val === current;*/}
            {/*    }}*/}
            {/*    onSelected={(val) => {*/}
            {/*        Log.debug('ON SELECTED',val);*/}
            {/*    }}*/}
            {/*    onInput={onInput}*/}
            {/*    error={"as"}*/}
            {/*/>*/}

            {/*<TextInput*/}
            {/*    label="label"*/}
            {/*    type="text"*/}
            {/*    placeholder="placeholder"*/}
            {/*    value={'def'}*/}
            {/*    onInput={(val: any) => Log.primary('onInput', val)}*/}
            {/*    error={""}*/}
            {/*/>*/}

            {/*<TextareaInput*/}
            {/*    label="label"*/}
            {/*    type="text"*/}
            {/*    placeholder="placeholder"*/}
            {/*    value={'def'}*/}
            {/*    onInput={(val: any) => Log.primary('onInput', val)}*/}
            {/*    error={""}*/}
            {/*/>*/}

            {/*<SearchInput*/}
            {/*    // hidden={true}*/}
            {/*    // disabled={true}*/}
            {/*    placeholder="placeholder"*/}
            {/*    value={'def'}*/}
            {/*    onInput={(val: any) => Log.primary('onInput', val)}*/}
            {/*/>*/}

            {/*<SelectInput*/}
            {/*    // hidden={true}*/}
            {/*    // disabled={true}*/}
            {/*    error={"error"}*/}
            {/*    label="label"*/}
            {/*    onInput={(val: any) => Log.primary('onInput', val)}*/}
            {/*    options={[*/}
            {/*        {*/}
            {/*            'text' : 'text1',*/}
            {/*            'value' : '',*/}
            {/*        },*/}
            {/*        {*/}
            {/*            'text' : 'text2',*/}
            {/*            'value' : 'value2',*/}
            {/*        },*/}
            {/*        {*/}
            {/*            'text' : 'text3',*/}
            {/*            'value' : 'value3',*/}
            {/*        }*/}
            {/*    ]}*/}
            {/*/>*/}
        </>
    );
}
export default Page2;