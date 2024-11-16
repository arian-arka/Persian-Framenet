import {Component, createSignal} from "solid-js";
import Log from "../Core/Log";
import Table from "../Component/Table";
import {useLocalData} from "../Core/LocalData";
import {useToast} from "../Component/Toast";

const Page: Component = () => {
    const toast=useToast();
    const [data, setData] = createSignal<any>(undefined, {equals: false});
    const localData = useLocalData();
    // (new TestApi()).test1().forever({
    //     ok(r: Ok<{ key: string }>) {
    //         setData(r.data);
    //     },
    //     // networkError(r: NetworkError): boolean | undefined {
    //     //     return false;
    //     // }
    // })
    toast.warning('asdssdsfdasfds');
    return (
        <>
            <pre>
                {
                    JSON.stringify(localData.localData())
                }
            </pre>
            <hr/>
            <pre>
                {
                    JSON.stringify(localStorage)
                }
            </pre>
            <h1>{localData.localData()?.testKey}</h1>
            {/*<Table*/}
            {/*    filters={[*/}
            {/*        {*/}
            {/*            name: 'text',*/}
            {/*            value: '',*/}
            {/*            type: 'text',*/}
            {/*            label: 'label',*/}
            {/*            placeholder: 'placeholder',*/}
            {/*        },*/}
            {/*        {*/}
            {/*            name: 'select',*/}
            {/*            value: 'value2',*/}
            {/*            type: 'select',*/}
            {/*            label: 'label',*/}
            {/*            options: [*/}
            {/*                {*/}
            {/*                    text: 'text1',*/}
            {/*                    value: 'value1',*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    text: 'text2',*/}
            {/*                    value: 'value2',*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    text: 'text3',*/}
            {/*                    value: 'value3',*/}
            {/*                },*/}
            {/*            ],*/}
            {/*        },*/}
            {/*    ]}*/}
            {/*    searchInput={{*/}
            {/*        name: 'search',*/}
            {/*        value: '',*/}
            {/*        placeholder: 'placeholder'*/}
            {/*    }}*/}
            {/*    onFilter={(filters: any) => Log.primary('filters', filters)}*/}
            {/*    header={'header'}*/}
            {/*    actions={[*/}
            {/*        {*/}
            {/*            text : 'action1',*/}
            {/*            class:undefined,*/}
            {/*            click(row){Log.debug('action1',row)}*/}
            {/*        },*/}
            {/*        {*/}
            {/*            text : 'action2',*/}
            {/*            class:undefined,*/}
            {/*            click(row){Log.debug('action2',row)}*/}
            {/*        }*/}
            {/*    ]}*/}
            {/*    columns={[*/}
            {/*        {*/}
            {/*            text: 'col1',*/}
            {/*            key:'col1',*/}
            {/*            customValue(val,row) {*/}
            {/*                return 'custom-col1'+val;*/}
            {/*            }*/}
            {/*        },*/}
            {/*        {*/}
            {/*            text: 'col2',*/}
            {/*            key:'col2',*/}
            {/*        },*/}
            {/*    ]}*/}
            {/*    rows={[*/}
            {/*        {*/}
            {/*            col1 : 'val1',*/}
            {/*            col2 : 'val1',*/}
            {/*        },*/}
            {/*        {*/}
            {/*            col1 : 'val22',*/}
            {/*            col2 : 'val22',*/}
            {/*        },*/}
            {/*        {*/}
            {/*            col1 : 'val333',*/}
            {/*            col2 : 'val333',*/}
            {/*        },*/}
            {/*    ]}*/}
            {/*/>*/}
        </>
    );
}
export default Page;