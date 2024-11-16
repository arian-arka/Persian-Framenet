import {Component, createSignal} from "solid-js";
import {useToast} from "../../Component/Toast";
import {useLocalData} from "../../Core/LocalData";
import Table from "../../Component/Table";
import {A} from "@solidjs/router";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import SentenceApi from "../../Api/Sentence.api";
import {SentencePaginatedInterface} from "../../Type/Sentence.interface";
const textToWords = (text: string) => {
    if(!(!!text))
        return [];
    const words: string[] = text.split(/\s+/);
    if (words.length > 0 && words[0].length === 0)
        words.splice(0, 1);
    if (words.length > 0 && words[words.length - 1].length === 0)
        words.splice(words.length - 1, 1);
    return words;
}
const EnglishListSentence: Component = () => {
    const toast = useToast();
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});
    const [data, setData] = createSignal<any>(undefined, {equals: false});
    const [pagination, setPagination] = createSignal<any>(undefined, {equals: false});
    const localData = useLocalData();
    document.title = 'فهرست جمله‌ها';

    const fetchList = async (filters: any) => {
        setRows(undefined);
        Log.secondary('filters', filters);
        let _filters = {...filters};

        _filters.words = _filters.name !== '' ? textToWords(_filters.words) : null;

        _filters = {
            ..._filters, ...{
                lang:1,
                limit:!!_filters?.limit ? _filters.limit : 50,
                linkPerPage: 5
            }
        };
        Log.secondary('_filters', _filters);
        await (new SentenceApi()).list(_filters).forever({
            ok(r: Ok<SentencePaginatedInterface>) {
                Log.success('sentences', r.data);
                setRows(r.data.data);
                setPagination(r.data.pagination);
            },
            unAuthenticated(r: BadRequest) {
                localData.navigate('/login');
            },
            bad(r: BadRequest) {
                Log.danger('sentences', r);
            }
        });
    }

    fetchList({
        page: 1,
        lang: '',
        status: '',
        words:'',
        limit:50,
    });
    return (
        <>
            <Table
                limits={[50,100,250,500,1000,1500,2000,2500]}
                addButton={
                    {
                        'text' : 'ساخت جمله',
                        'link':()=>`/sentence/store`
                    }
                }
                searchInput={{
                    name: 'words',
                    value: '',
                    placeholder: 'جستجو جمله...'
                }}
                onFilter={(v: any) => {
                    setData(v);
                    fetchList({...data(), page: 1})
                }}
                pagination={pagination()}
                onPage={async (page: any) => await fetchList({...data(), 'page': page as unknown as number})}
                header={'فهرست جمله‌ها'}
                actions={[

                    {
                        text: <>
                            <svg fill="none" class="w-5 h-5" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"></path>
                            </svg>
                        </>,
                        class: undefined,
                        link(row) {
                            return `/sentence/edit/${row._id}`;
                        }
                    },
                  /*  {
                        text: <>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"></path>
                            </svg>
                        </>,
                        class: undefined,
                        link(row) {
                            return `/taggedSentence/store/${row._id}`;
                        }
                    }*/
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
                        key: 'words',
                        text: 'جمله',
                        customValue(val, row) {
                            return (<span dir="ltr" class="font-medium text-gray-800 " style="text-align:right!important"
                                      >{val}</span>)
                        }
                    },

                ]}
                rows={rows()}
            />
        </>
    );
}
export default EnglishListSentence;