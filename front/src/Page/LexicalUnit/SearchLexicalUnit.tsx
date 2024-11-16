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
import LexicalUnitApi from "../../Api/LexicalUnit.api";
import {LexicalUnitPaginatedInterface} from "../../Type/LexicalUnit.interface";
import {LEXICAL_UNIT_TYPE} from "../../Constant/LexicalUnit";

const SearchLexicalUnit: Component = () => {
    const toast = useToast();
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});
    const [data, setData] = createSignal<any>(undefined, {equals: false});
    const [pagination, setPagination] = createSignal<any>(undefined, {equals: false});
    const localData = useLocalData();


    const fetchList = async (filters: any) => {
        setRows(undefined);
        Log.secondary('filters', filters);
        let _filters = {...filters};

        _filters.name = _filters.name !== '' ? _filters.name : null;
        _filters.page = _filters.page !== '' ? parseInt(_filters.page) : 1;
        _filters.type = !!_filters.type || _filters?.type === 0 ? parseInt(_filters.type) : null;

        _filters = {
            ..._filters, ...{
                limit: !!_filters?.limit ? _filters.limit : 50,
                linkPerPage: 5
            }
        };
        Log.secondary('_filters', _filters);
        await (new LexicalUnitApi()).search(_filters).forever({
            ok(r: Ok<LexicalUnitPaginatedInterface>) {
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
        name: null,
        limit: 50,
    });
    document.title = 'فهرست واحدهای واژگانی';
    return (
        <>
            <Table
                filters={[
                    {
                        name: 'type',
                        value: '',
                        type: 'select',
                        label: 'نوع',
                        options: [
                            {
                                text: 'همه',
                                value: '',
                            },
                            ...Object.keys(LEXICAL_UNIT_TYPE).map((text) => {
                                return {
                                    'text': text,
                                    // @ts-ignore
                                    'value': `${LEXICAL_UNIT_TYPE[text]}`,
                                }
                            })
                        ],
                    },
                ]}
                limits={[50, 100, 250, 500, 1000, 1500, 2000, 2500]}
                searchInput={{
                    name: 'name',
                    value: '',
                    placeholder: 'جستجو نام واحد واژگانی...'
                }}
                onFilter={(v: any) => {
                    setData(v);
                    fetchList({...data(), page: 1})
                }}
                pagination={pagination()}
                onPage={async (page: any) => await fetchList({...data(), 'page': page as unknown as number})}
                header={'فهرست واحدهای واژگانی'}
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
                    //     click(row) {
                    //         localData.navigate(`/frame/${row._id}`)
                    //     }
                    // }
                ]}
                columns={[
                    {
                        key: 'name',
                        text: 'نام',
                        customValue(val, row) {
                            return (
                                <A class="font-medium text-gray-800 dark:text-blue-500 hover:underline" target="_blank"
                                   href={`/lexicalUnit/edit/${row._id}`}>{val}</A>)
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
                    {
                        key: 'frame',
                        text: 'قالب معنایی',
                        customValue(val, row) {
                            return (
                                <A target="_blank" class="font-medium text-blue-600  dark:text-blue-500 hover:underline"
                                   href={`/frame/${val._id}`}>{val.name}</A>)
                        }
                    },
                    {
                        key: '_id',
                        text: 'گزارش برچسب‌نگاری',
                        customValue(val, row) {
                            if (row?.taggedSentenceCount > 0)
                                return <A target="_blank"
                                          class="font-medium text-blue-600 dark:text-blue-500 hover:underline inactive"
                                          href={`/lexicalUnit/annotation/${val}`}>گزارش</A>
                            return '-'
                        }
                    },

                ]}
                rows={rows()}
            />
        </>
    );
}
export default SearchLexicalUnit;