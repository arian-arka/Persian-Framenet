import {Component, createEffect, createSignal} from "solid-js";
import {useToast} from "../../Component/Toast";
import {useLocalData} from "../../Core/LocalData";
import Table from "../../Component/Table";
import {A, useParams} from "@solidjs/router";
import FrameApi, {FrameType, PaginatedFramesType} from "../../Api/Frame.api";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import LexicalUnitApi, {LexicalUnitType} from "../../Api/LexicalUnit.api";
import {LEXICAL_UNIT_TYPE} from "../../Constant/LexicalUnit";
import ElementApi from "../../Api/Element.api";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";

const ListLexicalUnit: Component = () => {
    const localData = useLocalData();
    const params = useParams<{ frame: string }>();
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});
    const toast = useToast();
    let rowCounter = 0;
    setRows(undefined);
        document.title = 'فهرست واحدهای واژگانی';
    const fetch = async () => {
        await (new LexicalUnitApi()).list(params.frame).forever({
                ok(r: Ok<LexicalUnitType[]>) {
                    Log.success('units', r.data);
                    setRows(r.data);
                },
                unAuthenticated(r: BadRequest) {
                    localData.navigate('/login');
                },
                bad(r: BadRequest) {
                    Log.danger('frames', r);
                }
            });
    }
    fetch();
    const reorder = async (v,setLoading) => {
        rowCounter=0;

        setLoading(true);
        try {
            const ok = await (new LexicalUnitApi()).reorder([v[0]['_id'],v[1]['_id']]).fetch();
            await fetch();
            toast.success('با موففقیت ثبت شد.');
        } catch (e) {
            console.log(e);
            if (isBadRequest(e)) {
                toast.firstError(e);
            } else if (isUnauthenticated(e))
                localData.navigate('/login');
            else if (isUnauthorized(e))
                toast.warning('دسترسی ندارید.')
            else
                toast.warning('خطا در شبکه.');
        } finally {
            setLoading(false);
        }
    }
    return (
        <>

            <Table
                reorder={reorder}
                buttons={[
                    <A href={`/frame/${params.frame}`}
                       class="lg:ml-6 md:ml-6  w-full lg:w-1/5 md:w-1/5 sm:w-full flex items-center justify-center  px-1 py-2 text-sm text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg">
                        قالب معنایی
                    </A>,

                ]}
                addButton={
                    {
                        'text': 'ساخت واحد واژگانی',
                        'callback': () => {
                            localData.navigate(`/lexicalUnit/store/${params.frame}`)
                        }
                    }
                }
                header={
                    <>
                        فهرست واحدهای واژگانی


                        {/*<A href={`/frame/list/${params.frame}`} style={"font-size:15px"}*/}
                        {/*   class="inline-flex items-center  text-blue-600 dark:text-blue-500 hover:underline">*/}
                        {/*    بازگشت*/}
                        {/*    <svg aria-hidden="true" class="w-3 h-3 mx-1" fill="currentColor"*/}
                        {/*         viewBox="0 0 20 20"*/}
                        {/*         xmlns="http://www.w3.org/2000/svg">*/}
                        {/*        <path fill-rule="evenodd"*/}
                        {/*              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"*/}
                        {/*              clip-rule="evenodd"></path>*/}
                        {/*    </svg>*/}
                        {/*</A>*/}
                    </>
                }
                actions={[
                    {
                        text: <>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5"
                                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
                            </svg>
                        </>,
                        class: undefined,
                        link(row) {
                           return `/lexicalUnit/edit/${row._id}`;
                        }
                    }
                ]}
                columns={[
                    {
                        key: 'r',
                        text: '',
                        customValue(val, row) {
                            return ++rowCounter;
                        }
                    },
                    {
                        key: 'name',
                        text: 'نام',
                        customValue(val, row) {
                            return (<A class="font-medium text-gray-800 dark:text-blue-500 hover:underline"  target="_blank"
                                       href={`/lexicalUnit/edit/${row._id}`}><span
                                style={`color:${row.color}`}>{val}</span></A>)
                        }
                    },
                    {
                        key: 'type',
                        text: 'نوع',
                        customValue(val, row) {
                            return Object.keys(LEXICAL_UNIT_TYPE)[Object.values(LEXICAL_UNIT_TYPE).indexOf(val)];
                        }
                    },
                    {
                        key: 'definition',
                        text: 'تعریف',
                    },
                ]}
                rows={rows()}
            />
        </>
    );
}
export default ListLexicalUnit;