import {Component, createEffect, createSignal, For, Match, Show, Switch} from "solid-js";
import Form from "../../Component/Form";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import {useLocalData} from "../../Core/LocalData";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {useToast} from "../../Component/Toast";
import SentenceApi from "../../Api/Sentence.api";
import {A, useParams} from "@solidjs/router";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {SentenceInterface} from "../../Type/Sentence.interface";
import ElementApi from "../../Api/Element.api";
import Table from "../../Component/Table";
import {FRAME_NET_TAGE_TYPE, TAGGED_SENTENCE_STATUS} from "../../Constant/TaggedSentence";
import {ELEMENT_TYPE} from "../../Constant/Element";
import LexicalUnitApi from "../../Api/LexicalUnit.api";
import {TaggedSentenceInterface} from "../../Type/TaggedSentence.interface";
import {FullFrameInterface} from "../../Type/Frame.interface";
const textToWords = (text: string) => {
    if(!text || text.length === 0)
        return [];
    const words: string[] = text.split(/\s+/);
    if (words.length > 0 && words[0].length === 0)
        words.splice(0, 1);
    if (words.length > 0 && words[words.length - 1].length === 0)
        words.splice(words.length - 1, 1);
    return words;
}
const EditSentence: Component = () => {
    const params = useParams<{sentence:string}>();
    const localData = useLocalData();
    const toast=useToast();
    const [errors,setErrors] = createSignal<any>({},{equals:false});
    const [words,setWords] = createSignal<string[]>([],{equals:false});
    const [sentence,setSentence] = createSignal<SentenceInterface|undefined>(undefined,{equals:false});
    const [tmp,setTmp] = createSignal(undefined);
    const _editSentence = async () => {
        setShowDelete(false);
        const setLoading = tmp()[1];
        const values = tmp()[0];
        setLoading(true);
        try{
            const ok = await (new SentenceApi()).edit(params.sentence,{words : words()} ).fetch();
            toast.success('با موفقیت ذخیره شد');
        }catch (e) {
            if(isBadRequest(e)){
                toast.firstError(e);
            }else if(isUnauthenticated(e))
                localData.navigate('/login');
            else if(isUnauthorized(e))
                toast.warning('دسترسی ندارید.')
            else
                toast.warning('خطا در شبکه.');
        }finally {
            setLoading(false);
        }
    }
    const editSentence = async (values:any, setLoading:Function) => {
        setTmp([values,setLoading]);
        setShowDelete(true)
    }
    const deleteSentence = async ( setLoading: Function) => {
        setLoading(true);
        try {
            const ok = await (new SentenceApi()).delete(params.sentence).fetch();
            localData.navigate(`/sentence/list`)
            toast.success('با موففقیت پاک شد.');
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


    (new SentenceApi()).show(params.sentence).forever({
        ok(r: Ok<SentenceInterface>) {
            Log.success('r', r);
            setSentence({...r.data,'words' : r.data.words.split(' ')});
            setWords(sentence().words);
            getTagged();
        },
        unAuthenticated(r: BadRequest) {
            localData.navigate('/login');
        },
    });
    const [showDelete,setShowDelete] = createSignal(false);
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});
    const getTagged = () => {
        (new SentenceApi()).tagged(params.sentence).forever({
            ok(r: Ok<TaggedSentenceInterface[]>) {
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
    document.title = 'جمله';

    return (
        <Show when={sentence()} fallback={
            <div class="text-center m-3">
                <div role="status">
                    <svg aria-hidden="true"
                         class="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
        <>
            <div  style="right:40%"
                  class={`${showDelete() ? '' : 'hidden'} fixed top-1/3 z-50  p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full `}>
                <div class=" w-full ">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button type="button" onClick={()=>setShowDelete(false)}
                                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                                data-modal-hide="popup-modal">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor"
                                 viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clip-rule="evenodd"></path>
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-6 text-center">
                            <svg aria-hidden="true"
                                 class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">آیا از انجام این کار اطمینان دارید؟(با انجام این کار تمام برچسب ها پاک می شونو)</h3>

                            <button data-modal-hide="popup-modal" type="button"
                                    onClick={() => setShowDelete(false)}
                                    class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center ml-2">
                                بازگشت
                            </button>

                            <button data-modal-hide="popup-modal" type="button" onClick={_editSentence}
                                    class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                بله، حتما
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            <div dir={sentence() ? (sentence()?.lang === 1 ? 'ltr' : 'rtl') : 'rtl' }>
            <Form
                errors={errors()}
                header={
                    <div class="mx-auto max-w-screen-xl mb-1">
                        <h2 class="mb-2 text-3xl leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">ویرایش
                            جمله</h2>
                      {/*  <p class="mb-8 font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
                            <A href={`/sentence/list`}
                               class="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                بازگشت
                                <svg aria-hidden="true" class="w-5 h-5 ml-1" fill="currentColor"
                                     viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </A>
                        </p>*/}
                        <p class="mb-1 font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
                            <A href={`/taggedSentence/store/${params.sentence}`}
                               class="inline-flex items-center font-medium text-green-600 dark:text-blue-500 hover:underline">
                                افزودن واحد واژگانی
                                <svg aria-hidden="true" class="w-5 h-5 ml-1" fill="currentColor"
                                     viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </A>
                        </p>
                    </div>
                }
                onInput={(key, val) =>{
                    if(key === 'words')
                        setWords(textToWords(val));
                }}
                onSubmit={editSentence}
                onDelete={deleteSentence}
                inputs={[
                    [
                        {
                            'type': 'textarea',
                            'name': 'words',
                            'label': 'جمله',
                            'placeholder': 'جمله...',
                            'value': sentence()?.words?.join(' ') ?? '',
                        },
                    ],
                ]}
            />
            </div>
            <section
                class="bg-white border border-gray-200 rounded-lg shadow sm:flex sm:items-center sm:justify-between p-4 sm:p-6 xl:p-8  dark:bg-gray-800 dark:border-gray-700 mt-4">
                <p dir={sentence() ? (sentence()?.lang === 1 ? 'ltr' : 'rtl') : 'rtl' } class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                    <A target="_blank" href={`/helper/translate-with-frame?sentence=${words()}`}
                       class="inline-block ml-2 font-medium text-blue-600  hover:underline">
                        <svg class="flex-shrink-0w-5 h-5 text-blue-600 dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6-3.976-2-.01A4.015 4.015 0 0 1 3 7m10 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
                        </svg>
                    </A>
                    <For each={words()}>{(w) =>
                    <>
                        [ {w} ]
                    </>
                    }</For>
                </p>
            </section>

            <Show when={rows()} fallback={
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
                    header={''}
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
                            link : (row)=> `/taggedSentence/edit/${row._id}`
                        }
                    ]}
                    columns={[
                        {
                            key: 'words',
                            text: 'جمله',
                            customValue(val, row) {
                                return (<p dir={row?.lang === 1 ? 'ltr' : 'rtl'} class="font-medium text-gray-800 dark:text-blue-500 ">
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
                                                    when={row.frameNetTags[index()].element}>
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
                            text: 'واحد واژگانی ',
                        },
                    ... ((sentence() && sentence()?.lang === 2 ) ? [
                        {
                            key: 'test',
                            text: 'واحد واژگانی پیشنهادی',
                            customValue(val, row) {
                                return !!row?.lexicalUnitHint ? row['lexicalUnitHint'] : '-';
                            }
                        },
                        {
                            key: 'lexicalUnitHelper',
                            text: 'واحد واژگانی ماشینی',
                        },
                        ] : []),
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
                    ]}
                    rows={rows()}
                />
            </Show>

        </>
        </Show>
    );
}
export default EditSentence;