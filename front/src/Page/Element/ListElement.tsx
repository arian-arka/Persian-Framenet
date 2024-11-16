import {Component, createSignal} from "solid-js";
import {useToast} from "../../Component/Toast";
import {useLocalData} from "../../Core/LocalData";
import Table from "../../Component/Table";
import {A, useParams} from "@solidjs/router";
import FrameApi, {FrameType, PaginatedFramesType} from "../../Api/Frame.api";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {ELEMENT_TYPE} from "../../Constant/Element";
import ElementApi, {ElementType} from "../../Api/Element.api";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";

const ListElement: Component = () => {
    const localData = useLocalData();
    const toast = useToast();
    const params = useParams<{ frame: string }>();
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});

    setRows(undefined);
    const fetch = async () =>{
        await (new ElementApi()).list(params.frame).forever({
            ok(r: Ok<ElementType[]>) {
                Log.success('frames', r.data);
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
        setLoading(true);
        try {
            const ok = await (new ElementApi()).reorder([v[0]['_id'],v[1]['_id']]).fetch();
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
    document.title = 'فهرست اجزا معنایی';
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
                        'text': 'ساخت جزء معنایی',
                        'callback': () => {
                            localData.navigate(`/element/store/${params.frame}`)
                        }
                    }
                }
                header={'فهرست اجزای معنایی'}
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
                            return `/element/edit/${row._id}`;
                        }
                    }
                ]}
                columns={[
                    {
                        key: 'name',
                        text: 'نام',
                        customValue(val, row) {
                            return (<A class="font-medium text-gray-800 dark:text-blue-500 hover:underline" target="_blank"
                                       href={`/element/edit/${row._id}`}><span class="font-medium hover:underline" style={`color:${row.color}`}>{val}</span></A>)
                        }
                    },
                    {
                        key: 'type',
                        text: 'نوع',
                        customValue(val, row) {
                            return Object.keys(ELEMENT_TYPE)[Object.values(ELEMENT_TYPE).indexOf(val)];
                        }
                    },
                    {
                        key: 'abbreviation',
                        text: 'کوتاه',
                        customValue(val, row) {
                            if (!val)
                                return '-';
                            return val
                        }
                    },
                    {
                        key: 'definition',
                        text: 'تعریف',
                    },
                    {
                        key: 'semanticType',
                        text: 'گونه معنایی',
                    },
                    {
                        key: 'excludes',
                        text: 'مانع می‌شود از',
                    },
                ]}
                rows={rows()}
            />
        </>
    );
}
export default ListElement;