import {Component, createEffect, createSignal, Match, Switch} from "solid-js";
import {useToast} from "../../Component/Toast";
import {useLocalData} from "../../Core/LocalData";
import Table from "../../Component/Table";
import {A} from "@solidjs/router";
import {FRAME_LANGUAGES, FRAME_STATUS} from "../../Constant/Frame";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import FrameApi from "../../Api/Frame.api";
import {FramePaginatedInterface} from "../../Type/Frame.interface";
import {TAGGED_SENTENCE_STATUS} from "../../Constant/TaggedSentence";
import {USER_PRIVILEGES} from "../../Constant/User";

const ListFrame: Component = () => {
    const toast = useToast();
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});
    const [data, setData] = createSignal<any>(undefined, {equals: false});
    const [pagination, setPagination] = createSignal<any>(undefined, {equals: false});
    const localData = useLocalData();
    const showUser = localData.localData()?.isSuperAdmin ==='true' && (localData.localData()?.privileges?.includes(USER_PRIVILEGES['show frame'])  && localData.localData()?.privileges?.includes(USER_PRIVILEGES['edit frame']) && localData.localData()?.privileges?.includes(USER_PRIVILEGES['store frame']));
    document.title = 'فهرست قالب‌های معنایی';

    const fetchList = async (filters: any) => {
        setRows(undefined);
        Log.secondary('filters', filters);
        let _filters = {...filters};

        _filters.issuer = !!_filters.issuer ? '1' : undefined;
        _filters.lang = _filters.lang !== '' ? parseInt(_filters.lang) : null;
        _filters.status = _filters.status !== '' ? parseInt(_filters.status) : null;
        _filters.name = _filters.name !== '' ? _filters.name : null;
        _filters.page = _filters.page !== '' ? parseInt(_filters.page) : 1;

        _filters = {
            ..._filters, ...{
                limit:!!_filters?.limit ? _filters.limit : 50,
                linkPerPage: 5
            }
        };
        Log.secondary('_filters', _filters);
        await (new FrameApi()).list(_filters).forever({
            ok(r: Ok<FramePaginatedInterface>) {
                Log.success('frames', r.data);
                setRows(r.data.data);
                setPagination(r.data.pagination);
            },
            unAuthenticated(r: BadRequest) {
                localData.navigate('/login');
            },
            bad(r: BadRequest) {
                Log.danger('frames', r);
            }
        });
    }

    fetchList({
        page: 1,
        lang: null,
        status: '',
        issuer: '',
        name: null,
        limit:50,
    });
    return (
        <>
            <Table
                limits={[50,100,250,500,1000,1500,2000,2500]}
                filters={[
                    {
                        name: 'lang',
                        value: '',
                        type: 'select',
                        label: 'زبان',
                        options: [
                            {
                                text: 'همه',
                                value: '',
                            },
                            ...Object.keys(FRAME_LANGUAGES).map((text) => {
                                return {
                                    'text': text,
                                    // @ts-ignore
                                    'value': `${FRAME_LANGUAGES[text]}`,
                                }
                            })
                        ],
                    },
                    {
                        name: 'status',
                        value: '',
                        type: 'select',
                        label: 'وضعیت',
                        options: [
                            {
                                text: 'همه',
                                value: '',
                            },
                            {
                                text: 'بدون تغییر',
                                value: '10',
                            },

                            {
                                text: 'در حال ویرایش',
                                value: '50',
                            },
                            {
                                text: 'در انتظار بررسی',
                                value: '70',
                            },
                            {
                                text: 'برگشت‌خورده',
                                value: '90',
                            },
                            {
                                text: 'نهایی',
                                value: '30',
                            },
                        ],
                    },
                    {
                        name: 'issuer',
                        value: '',
                        type: 'select',
                        label: 'مربوط به',
                        options: [
                            {
                                text: 'همه',
                                value: '',
                            },
                            {
                                text: 'خود',
                                value: '1',
                            },
                        ],
                    },
                ]}
                searchInput={{
                    name: 'name',
                    value: '',
                    placeholder: 'جستجو قالب معنایی...'
                }}
                onFilter={(v: any) => {
                    setData(v);
                    fetchList({...data(), page: 1})
                }}
                pagination={pagination()}
                onPage={async (page: any) => await fetchList({...data(), 'page': page as unknown as number})}
                header={'فهرست قالب‌های معنایی'}
                actions={[
                    // {
                    //     text: <>
                    //         <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5"
                    //              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    //             <path stroke-linecap="round" stroke-linejoin="round"
                    //                   d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
                    //         </svg>
                    //     </>,
                    //     class: undefined,
                    //     link(row) {
                    //         return `/frame/${row._id}`;
                    //     }
                    // }
                ]}
                columns={[
                /*    {
                        key: '_id',
                        text: 'شناسه',
                        customValue(val, row) {
                            return row._id;
                        }
                    },*/
                    {
                        key: 'name',
                        text: 'نام',
                        customValue(val, row) {
                            return (<A class="font-medium text-gray-800 dark:text-blue-500 hover:underline"  target="_blank"
                                       href={`/frame/${row._id}`}>{val}</A>)
                        }
                    },
                    // {
                    //     key: 'lang',
                    //     text: 'زبان',
                    //     customValue(val, row) {
                    //         return val == FRAME_LANGUAGES['fa'] ? 'fa' : 'en';
                    //     }
                    // },
                    {
                        key: 'mirror',
                        text: 'متناظر',
                        customValue(val, row) {
                            if (!val)
                                return '-';
                            return (<A class="font-medium text-blue-600  dark:text-blue-500 hover:underline"  target="_blank"
                                       href={`/frame/${val._id}`}>{val.name}</A>)
                        }
                    },
                    {
                        key: 'status',
                        text: 'وضعیت',
                        customValue(val, row) {
                            return    (<Switch>
                                <Match when={FRAME_STATUS['published'] === val}>
                                    <span class="text-green-500">نهایی</span>
                                </Match>
                                <Match when={FRAME_STATUS['refused'] === val}>
                                    <span class="text-red-600">برگشت‌خورده</span>
                                </Match>
                                <Match when={FRAME_STATUS['editing'] === val}>
                                    <span class="text-yellow-300">در حال ویرایش</span>
                                </Match>
                                <Match when={FRAME_STATUS['waiting'] === val}>
                                    <span class="text-orange-500">در انتظار بررسی</span>
                                </Match>
                                <Match when={FRAME_STATUS['unchanged'] === val}>
                                    <span class="text-gray-500">بدون تغییر</span>
                                </Match>
                            </Switch>)
                        }
                    },
                    ... showUser ? [
                        {
                            key: 'issuer',
                            text: 'آخرین کاربر',
                            customValue(val, row) {
                                return val.name;
                            }
                        },
                    ]: []
                ]}
                rows={rows()}
            />
        </>
    );
}
export default ListFrame;