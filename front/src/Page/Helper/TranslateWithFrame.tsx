import {Component, createSignal, For, Match, Show, Switch} from "solid-js";
import TextInput from "../../Component/Input/TextInput";
import {useLocalData} from "../../Core/LocalData";
import {useToast} from "../../Component/Toast";
import HelperApi from "../../Api/Helper.api";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import Table from "../../Component/Table";
import {FRAME_NET_TAGE_TYPE, TAGGED_SENTENCE_STATUS} from "../../Constant/TaggedSentence";

const TranslateWithFrame: Component = () => {
    const localData = useLocalData();

    const toast = useToast();

    const [translation, setTranslation] = createSignal("");

    const [lexicalUnit, setLexicalUnit] = createSignal("");

    const [step, setStep] = createSignal(1);

    const [loading, setLoading] = createSignal(false);

    const [loadingContent, setLoadingContent] = createSignal(false);

    const [result, setResult] = createSignal<{
        _id: string;
        words: string;
        frame: string;
        lexicalUnit: string;
        ratio: number
    }[]>([], {equals: false});

    const [content, setContent] = createSignal("");

    const translator = async (text) => {
        if (!(!!text))
            return;
        let sourceLang = 'fa';
        let targetLang = 'en';
        try {
            let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(text);
            const f = await fetch(url);
            const j = await f.json();
            const res = j[0][0][0];
            setTranslation(res);
            setStep(2);
        } catch (e) {
            setTranslation("");
            toast.warning('خطا در ترجمه');
            console.log('e', e);
        }
    }

    const onSentence = (sentence) => {
        if (!(!!sentence)) {
            setTranslation("");
            setStep(1);
            return;
        }
        translator(sentence);
    }

    const searchSentences = async (e) => {
        e.preventDefault();
        // if(!(!!lexicalUnit())){
        //     toast.danger('واحد واژگانی خالی است');
        //     return;
        // }
        setLoading(true);

        setContent("");
        searchContent();


        const data = {
            count: 200,
            'lexicalUnit': !!lexicalUnit() ? lexicalUnit().trim() : null,
            'sentence': (translation()[translation().length - 1] == '.' ? translation().substring(0, translation().length - 1) : translation()).trim(),
        };

        setResult([]);

        try {
            const ok = await (new HelperApi()).matchSentence(data).fetch()
            setResult(ok.data);
            console.log(ok);
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

    const searchContent = async () => {
        if (!(!!lexicalUnit()))
            return;
        setLoadingContent(true);
        try {
            const ok = await (new HelperApi()).matchFrame({
                'lexicalUnit': lexicalUnit(),
                'sentence': translation(),
            }).fetch();
            setContent(ok.data.content);
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
            setLoadingContent(false);
        }
    }

    let params = (new URL(document.location)).searchParams;
    if(!!params.get('sentence')){
        onSentence(params.get('sentence'));
    }

    return (
        <>

            <ol class="relative mx-10 mt-5 text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <Show when={step() > 0}>
                    <li class="mb-3 ml-4">
                    <span
                        class={`${step() === 1 ? 'bg-green-200 ' : ' '}  absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white  `}>
                    <svg class="w-3.5 h-3.5 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                        <path
                            d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
                      </svg>
        </span>
                        <h3 class="font-medium leading-tight">متن</h3>
                        <TextInput
                            label={undefined}
                            type={'text'}
                            placeholder='جمله...'
                            value={!!params.get('sentence') ? params.get('sentence') : ''}
                            onChange={onSentence}
                        />
                    </li>
                </Show>
                <Show when={step() > 1}>
                    <li class="mb-3 ml-4">
        <span
            class={` absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white  `}>
        <svg class="w-3.5 h-3.5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8.855 10.322a2.476 2.476 0 1 1 .133-4.241m6.053 4.241a2.475 2.475 0 1 1 .133-4.241M2 1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/>
  </svg>

        </span>
                        <h3 class="font-medium leading-tight">ترجمه</h3>
                        <p dir={"ltr"} class="text-sm">{translation()}</p>

                    </li>
                    <Show when={step() > 0}>
                        <li class="mb-3 ml-4">

                            <h3 class="font-medium leading-tight">واحد واژگانی</h3>
                            <form class="flex items-center mt-1">
                                <div class="relative w-full">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        {/*<svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">*/}
                                        {/*    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>*/}
                                        {/*</svg>*/}
                                    </div>
                                    <input onInput={(e) => {
                                        const val = e.target.value;
                                        setLexicalUnit(!!val ? val : "");
                                    }}   placeholder='واجد واژگانی...' class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                <button onClick={searchSentences} class="p-2.5 mx-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                    <span class="sr-only">Search</span>
                                </button>
                            </form>
                        </li>
                    </Show>
                </Show>
                <Show when={step() > 2}>
                    <li class="mb-3 ml-4">
        <span
            class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path
                    d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
            </svg>
        </span>
                        <h3 class="font-medium leading-tight">Review</h3>
                        <p class="text-sm">Step details here</p>
                    </li>

                </Show>

                <Show when={!!content()} fallback={
                   <Show when={loadingContent()}>
                       <>
                           <li class="mb-3 ml-4">
                          <span
                              class={`absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white  `}>
        <svg class="w-3.5 h-3.5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8.855 10.322a2.476 2.476 0 1 1 .133-4.241m6.053 4.241a2.475 2.475 0 1 1 .133-4.241M2 1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/>
  </svg>

        </span>
                           <svg aria-hidden="true" role="status"
                                class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
                                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path
                                   d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                   fill="currentColor"/>
                               <path
                                   d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                   fill="#1C64F2"/>
                           </svg>
                           Loading...
                           </li>
                       </>
                   </Show>
                }>
                    <li class="mb-3 ml-4">
                          <span
                              class={`absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white  `}>
        <svg class="w-3.5 h-3.5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8.855 10.322a2.476 2.476 0 1 1 .133-4.241m6.053 4.241a2.475 2.475 0 1 1 .133-4.241M2 1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/>
  </svg>

        </span>

                        <blockquote
                            class="p-4 my-4 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
                            <pre dir={"ltr"}
                                 class="text-start whitespace-pre-wrap text-base  font-medium leading-relaxed text-gray-900 dark:text-white">
                            {content()}
                        </pre>
                        </blockquote>
                    </li>
                </Show>

                <Show when={!loading()} fallback={
                    <>
                    <li class="mb-3 ml-4">
                          <span
                              class={`absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white  `}>
        <svg class="w-3.5 h-3.5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8.855 10.322a2.476 2.476 0 1 1 .133-4.241m6.053 4.241a2.475 2.475 0 1 1 .133-4.241M2 1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/>
  </svg>

        </span>
                        <svg aria-hidden="true" role="status"
                             class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="#1C64F2"/>
                        </svg>
                        Loading...
                    </li>

                    </>
                }>

                    <Show when={result().length > 0}>
                        <li class="mb-3 ml-4">
                          <span
                              class={`absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white  `}>
        <svg class="w-3.5 h-3.5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8.855 10.322a2.476 2.476 0 1 1 .133-4.241m6.053 4.241a2.475 2.475 0 1 1 .133-4.241M2 1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/>
  </svg>

        </span>
                        <Table
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
                            columns={[
                                // {
                                //     key: '_id',
                                //     text: 'شناسه',
                                //     customValue(val, row, index) {
                                //         return val;
                                //     }
                                // },
                                {
                                    key: 'ratio',
                                    text: 'تطابق',
                                    customValue(val, row, index) {
                                        return val;
                                    }
                                },
                                {
                                    key: 'words',
                                    text: 'جمله',
                                    customValue(val, row) {
                                        return (<p class="font-medium text-gray-800 dark:text-blue-500 ">

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
                            ]}
                            rows={result()}
                        />
                        </li>

                    </Show>

                </Show>

            </ol>
            <br/>
            <br/>
        </>
    );
}

export default TranslateWithFrame;