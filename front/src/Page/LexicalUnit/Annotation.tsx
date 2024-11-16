import {Component, createEffect, createSignal, For, Match, Show, Switch} from "solid-js";
import {A, useParams} from "@solidjs/router";
import {useLocalData} from "../../Core/LocalData";
import LexicalUnitApi, {LexicalUnitType} from "../../Api/LexicalUnit.api";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {TaggedSentenceInterface} from "../../Type/TaggedSentence.interface";
import {FullFrameInterface} from "../../Type/Frame.interface";
import Table from "../../Component/Table";
import {LEXICAL_UNIT_TYPE} from "../../Constant/LexicalUnit";
import {ELEMENT_TYPE} from "../../Constant/Element";
import {FRAME_NET_TAGE_TYPE, TAGGED_SENTENCE_STATUS} from "../../Constant/TaggedSentence";
import {LexicalUnitInterface} from "../../Type/LexicalUnit.interface";

const Annotation: Component = () => {
    const localData = useLocalData();
    const params = useParams<{ lexicalUnit: string }>();
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});
    const [frame, setFrame] = createSignal<any>(undefined, {equals: false});
    const [lexicalUnit, setLexicalUnit] = createSignal<any>(undefined, {equals: false});
    setRows(undefined);
    (new LexicalUnitApi()).annotation(params.lexicalUnit).forever({
        ok(r: Ok<{ sentences: TaggedSentenceInterface[]; frame: FullFrameInterface,lexicalUnit:LexicalUnitInterface }>) {
            Log.success('units', r.data);
            setFrame(r.data.frame);
            setLexicalUnit(r.data.lexicalUnit);
            setRows(r.data.sentences);
        },
        unAuthenticated(r: BadRequest) {
            localData.navigate('/login');
        },
        bad(r: BadRequest) {
            Log.danger('frames', r);
        }
    });
    createEffect(() => {
        document.title = lexicalUnit()?.name ?? 'گزارش';
    });
    return (
        <>
            <Show when={frame() && rows()} fallback={
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
                    // buttons={[
                    //     <A href={`/frame/${frame()._id}`}
                    //        class="lg:ml-6 md:ml-6  w-full lg:w-1/5 md:w-1/5 sm:w-full flex items-center justify-center  px-1 py-2 text-sm text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg">
                    //         فریم
                    //     </A>,
                    //
                    // ]}
                    // addButton={
                    //     {
                    //         'text' : 'ساخت واحد واژگانی',
                    //         'callback':()=>{localData.navigate(`/lexicalUnit/store/${params.frame}`)}
                    //     }
                    // }
                    header={
                        <>
                            گزارش برچسب‌نگاری
                            <br/>
                            <br/>
                            <span class="font-bold text-2xl">{`${lexicalUnit().name}`}</span>
                            <span class="font-bold text-2xl">.</span>
                            <span class="font-bold text-2xl">{Object.keys(LEXICAL_UNIT_TYPE)[Object.values(LEXICAL_UNIT_TYPE).indexOf(lexicalUnit().type)]}</span>

                            <br/>
                            <A href={`/frame/${frame()._id}`} style={"font-size:15px"}
                               class="inline-flex items-center  text-blue-600 dark:text-blue-500 hover:underline">
                                {frame().name}
                                <svg aria-hidden="true" class="w-3 h-3 mx-1" fill="currentColor"
                                     viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </A>
                        </>
                    }
                    actionColumn="مشاهده"
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
                        //         localData.navigate(`/lexicalUnit/edit/${row._id}`)
                        //     }
                        // }
                    ]}
                    columns={[
                        {
                            key: 'name',
                            text: 'نام',
                            customValue(val, row) {
                                return (<A class="font-medium text-gray-800 dark:text-blue-500 hover:underline"
                                           href={`/element/edit/${row._id}`}><span
                                    style={`color:${row.color}`}>{val}</span></A>)
                            }
                        },
                        {
                            key: 'type',
                            text: 'وضعیت',
                            customValue(val, row) {
                                return Object.keys(ELEMENT_TYPE)[Object.values(ELEMENT_TYPE).indexOf(val)];
                            }
                        },
                        {
                            key: 'abbreviation',
                            text: 'اختصار',
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
                    ]}
                    rows={frame()?.elements}
                />
                <Table
                    header={'جمله‌ها'}
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
                        }
                    ]}
                    actionColumn={frame()?.lang === 1 ? "مشاهده" : undefined}
                    columns={[
                        {
                            key: 'words',
                            text: 'جمله',
                            customValue(val, row) {
                                return (<p class="font-medium text-gray-800 dark:text-blue-500 ">
                                        <Show when={row.frameNetTags.length > 0} fallback={val }>
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
                        // {
                        //     key: 'lexicalUnit',
                        //     text: 'واحد واژگانی',
                        //     customValue(val, row) {
                        //         return !!val ? val['name'] : '-';
                        //     }
                        // },
                        // {
                        //     key: 'lexicalUnitHelper',
                        //     text: 'واحد واژگانی ماشینی',
                        // },
                        // {
                        //     key: 'frame',
                        //     text: 'قاب معنایی',
                        //     customValue(val, row) {
                        //         return !!val ? val['name'] : '-';
                        //     }
                        // },
                        // {
                        //     key: 'frameHelper',
                        //     text: 'قاب معنایی ماشینی',
                        // },
                        ... (frame()?.lang === 2 ?[
                            {
                                key: 'status',
                                text: 'وضعیت',
                                customValue(val, row) {
                                    return (<Switch>
                                        <Match when={TAGGED_SENTENCE_STATUS['published'] === val}>
                                            <span class="text-green-500">نهایی</span>
                                        </Match>
                                        <Match when={TAGGED_SENTENCE_STATUS['refused'] === val}>
                                            <span class="text-red-600">برگشت‌خورده</span>
                                        </Match>
                                        <Match when={TAGGED_SENTENCE_STATUS['editing'] === val}>
                                            <span class="text-yellow-300">در حال ویرایش</span>
                                        </Match>
                                        <Match when={TAGGED_SENTENCE_STATUS['waiting'] === val}>
                                            <span class="text-orange-500">در انتظار بررسی</span>
                                        </Match>
                                        <Match when={TAGGED_SENTENCE_STATUS['unchanged'] === val}>
                                            <span class="text-gray-500">بدون تغییر</span>
                                        </Match>
                                    </Switch>)
                                }
                            },
                            {
                                key: 'issuer',
                                text: 'آخرین کاربر',
                                customValue(val, row) {
                                    if (!val)
                                        return '-';
                                    return val.name;
                                }
                            },
                        ] : []),

                    ]}
                    rows={rows()}
                />
            </Show>
        </>
    );
}

export default Annotation;