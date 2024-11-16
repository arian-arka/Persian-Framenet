import {Component, createEffect, createSignal, For, Match, onCleanup, Show, Switch} from "solid-js";
import {useToast} from "../../Component/Toast";
import {useLocalData} from "../../Core/LocalData";
import Table from "../../Component/Table";
import {A} from "@solidjs/router";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import SentenceApi from "../../Api/Sentence.api";
import {SentencePaginatedInterface} from "../../Type/Sentence.interface";
import TaggedSentenceApi from "../../Api/TaggedSentence.api";
import {TaggedSentencePaginatedInterface} from "../../Type/TaggedSentence.interface";
import {FRAME_NET_TAGE_TYPE, TAGGED_SENTENCE_STATUS} from "../../Constant/TaggedSentence";
import {FRAME_LANGUAGES, FRAME_STATUS} from "../../Constant/Frame";
import UserInterface, {UserPaginatedInterface} from "../../Type/User.interface";
import FrameApi from "../../Api/Frame.api";
import {isUnauthenticated} from "../../Core/Api/Api";
import UserApi from "../../Api/User.api";
import {USER_PRIVILEGES} from "../../Constant/User";

const textToWords = (text: any | string | string[]) => {
    if (!Array.isArray(text) && typeof text !== 'string')
        return [];
    if (typeof text !== 'string' && text.length < 1)
        return [];
    const words: string[] = Array.isArray(text) ? [...text] : text.split(/\s+/);

    if (words.length === 0)
        return [];

    if (words.length > 0 && words[0].length === 0)
        words.splice(0, 1);
    if (words.length > 0 && words[words.length - 1].length === 0)
        words.splice(words.length - 1, 1);
    return words;
}
const EnglishListTaggedSentence: Component = () => {
    const toast = useToast();
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});
    const [data, setData] = createSignal<any>(undefined, {equals: false});
    const [pagination, setPagination] = createSignal<any>(undefined, {equals: false});
    const [users, setUsers] = createSignal(undefined);
    const localData = useLocalData();
    let limit = 50;
    let firstTime = true;
    const fetchList = async (filters: any) => {
        setRows(undefined);
        Log.secondary('filters', filters);
        let _filters = {
            ...filters,
            lang:1,
            user: !!filters?.user ? filters.user : null,
            issuer: !!filters?.issuer ? '1' : null,
            words: !!filters?.words  ? textToWords(filters.words) : null,
            frame: !!filters?.frame ? filters.frame : null,
            frameHelper: !!filters?.frameHelper ? filters.frameHelper : null,
            lexicalUnit: !!filters?.lexicalUnit  ? filters.lexicalUnit : null,
            lexicalUnitHelper: !!filters?.lexicalUnitHelper ? filters.lexicalUnitHelper : null,
            lexicalUnitHint: !!filters?.lexicalUnitHint ? filters.lexicalUnitHint : null,
            status: !!filters?.status ? parseInt(filters.status) : null,
            limit: !!filters?.limit ? filters.limit : 50,
            linkPerPage: 5
        };

        Log.secondary('_filters', _filters);
        await (new TaggedSentenceApi()).list(_filters).forever({
            ok(r: Ok<TaggedSentencePaginatedInterface>) {
                Log.success('tagged sentences', r.data);
                setPagination(r.data.pagination);
                setRows(r.data.data);
            },
            unAuthenticated(r: BadRequest) {
                localData.navigate('/login');
            },
            bad(r: BadRequest) {
                Log.danger('sentences', r);
            }
        });
    }

    const findUsers = async (filters: any) => {
        if (!(localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges?.includes(USER_PRIVILEGES['show tagged sentence']))) {
            setUsers([]);
            return;
        }
        setUsers(undefined);
        Log.secondary('filters', filters);
        let _filters = {...filters};

        _filters.name = _filters?.name ?? null;
        _filters.email = _filters?.email ?? null;
        _filters.suspended = false;

        _filters = {
            ..._filters, ...{
                limit: !!_filters?.limit ? _filters.limit : 50,
                linkPerPage: 5
            }
        };
        Log.secondary('_filters', _filters);
        await (new UserApi()).list(_filters).forever({
            ok(r: Ok<UserPaginatedInterface>) {
                Log.success('users', r.data);
                setUsers(r.data.data);
            },
            unAuthenticated(r: BadRequest) {
                localData.navigate('/login');
            },
            bad(r: BadRequest) {
                Log.danger('users', r);
            }
        });
    }

    createEffect(() => {
        if (users()) {
            if (firstTime)
                fetchList({
                    page: 1,
                    limit: 50,
                    lang: '',
                    status: '',
                    words: '',
                    frame: '',
                    frameHelper: '',
                    lexicalUnit: '',
                    lexicalUnitHelper: '',
                    lexicalUnitHint: '',
                    issuer: '',
                });
            else
                firstTime = false;
        }
    })

    findUsers({
        page: 1,
        status: '',
        limit: 1000,
    });

    document.title = 'فهرست جمله‌های انگلیسی';

    /*   let int = setInterval(() => {
           if(users() && data()?.status == TAGGED_SENTENCE_STATUS['unchanged']){
               console.log('data.......',data());
               fetchList(data() ? {
                   ...data(),
                   ...data().page ? {} : {page:1}
               } :{
                   page: 1,
                   limit: 50,
                   lang: '',
                   status: TAGGED_SENTENCE_STATUS['unchanged'],
                   words: '',
                   frame: '',
                   frameHelper: '',
                   lexicalUnit: '',
                   lexicalUnitHelper: '',
                   lexicalUnitHint: '',
                   issuer: '',
               } );}

       },6000)

       onCleanup(() => {
           if(int)
               clearInterval(int)
       })*/
    return (
        <>
            <Show when={users()} fallback={
                <div class="text-center">
                    <div role="status">
                        <svg aria-hidden="true"
                             class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            }>
                <Table
                    limits={[50, 100, 250, 500, 1000, 1500, 2000, 2500]}
                    searchInput={{
                        name: 'words',
                        value: '',
                        placeholder: 'جستجو جمله...'
                    }}
                    filters={[
                        {
                            name: 'lexicalUnit',
                            value: '',
                            type: 'text',
                            label: 'واحد واژگانی',
                        },
                        {
                            name: 'frame',
                            value: '',
                            type: 'text',
                            label: 'قالب معنایی',
                        },
                        {
                            name: 'lexicalUnitHint',
                            value: '',
                            type: 'text',
                            label: 'واحد واژگانی پیشنهادی',
                        },
                        {
                            name: 'lexicalUnitHelper',
                            value: '',
                            type: 'text',
                            label: 'واحد واژگانی ماشینی',
                        },
                        {
                            name: 'frameHelper',
                            value: '',
                            type: 'text',
                            label: 'قالب معنایی ماشینی',
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
                            name: 'user',
                            value: '',
                            type: 'select',
                            label: 'کاربر',
                            options: [
                                {
                                    text: 'همه',
                                    value: '',
                                },
                                ...users().map((user) => {
                                    return {'text': user.name, 'value': user._id}
                                })
                            ],
                        },
                    ]}
                    onFilter={(v: any) => {
                        limit = !!v?.limit ? v.limit : 50;
                        setData(v);
                        fetchList({...data(), page: 1})
                    }}
                    pagination={pagination()}
                    onPage={async (page: any) => {
                        if (data()) {
                            const _ = data();
                            console.log('dddddddatatatat', data());
                            _['page'] = page;
                            setData(_);
                        }
                        console.log('on pageeeeeeeee', data());
                        await fetchList({...data(), 'page': page as unknown as number})
                    }
                    }
                    actionColumn="مشاهده"
                    header={'فهرست جمله‌های انگلیسی'}
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
                                return `/taggedSentence/edit/${row._id}`
                            }
                        },
                        // {
                        //     text: <>
                        //         <svg fill="none" class="w-5 h-5" stroke="currentColor" stroke-width="1.5"
                        //              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        //             <path stroke-linecap="round" stroke-linejoin="round"
                        //                   d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"></path>
                        //         </svg>
                        //     </>,
                        //     class: undefined,
                        //     link(row) {
                        //         return `/sentence/edit/${row.sentence._id}`;
                        //     }
                        // }
                    ]}
                    columns={[
                        // {
                        //     key: '_id',
                        //     text: 'شناسه',
                        //     customValue(val, row,index) {
                        //         return val;
                        //     }
                        // },
                        {
                            key: 'words',
                            text: 'جمله',
                            customValue(val, row) {
                                return (<p dir="ltr" class="font-medium text-gray-800 dark:text-blue-500 ">

                                    <Show when={row.frameNetTags.length > 0} fallback={val}>
                                        <For each={val.split(' ')}>{(w, index) =>
                                            <Switch>
                                                <Match
                                                    when={row.frameNetTags[index()].tagType === FRAME_NET_TAGE_TYPE['empty']}>
                                                    <span class="inline">{w + ' '}</span>
                                                </Match>
                                                <Match
                                                    when={row.frameNetTags[index()].tagType === FRAME_NET_TAGE_TYPE['support']}>
                                                    <span class="inline underline">{w + ' '}</span>
                                                </Match>
                                                <Match
                                                    when={!row.frameNetTags[index()].element && row.frameNetTags[index()].tagType === FRAME_NET_TAGE_TYPE['lexicalUnit']}>
                                                <span class="inline"
                                                      style="background-color : black !important; color : white !important;">{w + ' '}</span>
                                                </Match>
                                                <Match
                                                    when={row.frameNetTags[index()].element || row.frameNetTags[index()].tagType === FRAME_NET_TAGE_TYPE['element']}>
                                                <span class="inline"
                                                      style={`background-color:${row.frameNetTags[index()]['element']['color']} !important; color : white!important;`}>{w + ' '}</span>
                                                </Match>
                                            </Switch>
                                        }</For>
                                    </Show>

                                </p>)
                            }
                        },
                        {
                            key: 'lexicalUnitName',
                            text: 'واحد واژگانی',
                            customValue(val, row) {
                                return !!val ? val : '-';
                            }
                        },
                        {
                            key: 'frameName',
                            text: 'قالب معنایی',
                            customValue(val, row) {
                                return !!val ? val : '-';
                            }
                        },
                        // {
                        //     key: 'status',
                        //     text: 'وضعیت',
                        //     customValue(val, row) {
                        //         return (<Switch>
                        //             <Match when={TAGGED_SENTENCE_STATUS['published'] === val}>
                        //                 <span class="text-green-500">نهایی</span>
                        //             </Match>
                        //             <Match when={TAGGED_SENTENCE_STATUS['refused'] === val}>
                        //                 <span class="text-red-600">برگشت‌خورده</span>
                        //             </Match>
                        //             <Match when={TAGGED_SENTENCE_STATUS['editing'] === val}>
                        //                 <span class="text-yellow-300">در حال ویرایش</span>
                        //             </Match>
                        //             <Match when={TAGGED_SENTENCE_STATUS['waiting'] === val}>
                        //                 <span class="text-orange-500">در انتظار بررسی</span>
                        //             </Match>
                        //             <Match when={TAGGED_SENTENCE_STATUS['unchanged'] === val}>
                        //                 <span class="text-gray-500">بدون تغییر</span>
                        //             </Match>
                        //         </Switch>)
                        //     }
                        // },
                        // {
                        //     key: 'issuer',
                        //     text: 'آخرین کاربر',
                        //     customValue(val, row) {
                        //         if (!val)
                        //             return '-';
                        //         return val.name;
                        //     }
                        // },
                    ]}
                    rows={rows()}
                />
            </Show>
        </>
    );
}
export default EnglishListTaggedSentence;