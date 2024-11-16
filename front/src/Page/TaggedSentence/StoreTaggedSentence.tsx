import {Component, createSignal, For, Match, Show, Switch} from "solid-js";
import {useParams} from "@solidjs/router";
import {useLocalData} from "../../Core/LocalData";
import {useToast} from "../../Component/Toast";
import SentenceApi from "../../Api/Sentence.api";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import DropDownInput from "../../Component/Input/DropDownInput";
import FrameApi from "../../Api/Frame.api";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import LexicalUnitApi from "../../Api/LexicalUnit.api";
import SelectInput from "../../Component/Input/SelectInput";
import {LEXICAL_UNIT_TYPE} from "../../Constant/LexicalUnit";
import ElementApi from "../../Api/Element.api";
import {FRAME_NET_TAGE_TYPE} from "../../Constant/TaggedSentence";
import {SentenceInterface} from "../../Type/Sentence.interface";
import FrameInterface from "../../Type/Frame.interface";
import TaggedSentenceApi from "../../Api/TaggedSentence.api";
import TextInput from "../../Component/Input/TextInput";
import TextareaInput from "../../Component/Input/TextareaInput";

function invertColor(color) {
    return '#' + ("000000" + (0xFFFFFF ^ parseInt(color.substring(1), 16)).toString(16)).slice(-6);
}

const StoreTaggedSentence: Component = () => {
    const [loading, setLoading] = createSignal(false);
    const params = useParams<{ sentence: string }>();
    const localData = useLocalData();
    const toast = useToast();
    const [errors, setErrors] = createSignal<any>({}, {equals: false});
    let n = 1;
    const [words, setWords] = createSignal<string[]>([], {equals: false});
    const [probBankTags, setProbBankTags] = createSignal<(number | null)[]>([], {equals: false});

    const [taggedWords, setTaggedWords] = createSignal<({
        word: string,
        type: number,
        element?: string,
        color?: string,
        selected: boolean,
    })[]>([], {equals: false});

    const [sentence, setSentence] = createSignal<SentenceInterface | undefined>(undefined, {equals: false});

    const [frames, setFrames] = createSignal<any>(undefined, {equals: false});

    const [frame, setFrame] = createSignal<any>(undefined, {equals: false});

    const [lexicalUnits, setLexicalUnits] = createSignal<any>(undefined, {equals: false});

    const [lexicalUnit, setLexicalUnit] = createSignal<any>(undefined, {equals: false});

    const [elements, setElements] = createSignal<any>(undefined, {equals: false});
    const [selectedShift, setSelectedShift] = createSignal(false);

    window.addEventListener('keyup', (e) => setSelectedShift(false));
    window.addEventListener('keydown', (e) => setSelectedShift(e.shiftKey));

    const selectTaggedWord = (index: number, status: boolean) => {
        const _ = taggedWords();
        if (status) {
            let lastSelected = undefined;

            for (let i = 0; i < _.length; i++) {
                if (_[i].selected) {
                    if (lastSelected === undefined)
                        lastSelected = i;
                    else {
                        lastSelected = undefined;
                        break;
                    }
                }
            }

            if (lastSelected !== undefined && selectedShift()) {
                const upperBond = index > lastSelected ? index : lastSelected;
                const lowerBond = index > lastSelected ? lastSelected : index;
                for (let i = 0; i < _.length; i++)
                    _[i].selected = i <= upperBond && i >= lowerBond;
                setTaggedWords([..._]);
                return;
            }
        }
        _[index].selected = status;
        setTaggedWords([..._]);
    }
    const unSelectAllTaggedWords = () => {
        const _ = taggedWords();
        for (let i = 0; i < _.length; i++)
            _[i].selected = false;
        setTaggedWords([..._]);
    }


    const assignElementToSelectedWord = (element) => {
        const _ = taggedWords();
        for (let w of _) {
            if (w.selected) {
                if(w.type !== FRAME_NET_TAGE_TYPE['lexicalUnit'])
                    w.type = FRAME_NET_TAGE_TYPE['element'];
                w.element = element._id;
                w.color = element.color;
                w.selected = false;
            }
        }
        setTaggedWords([..._]);
    }
    const assignLexicalUnitToSelectedWord = () => {
        const _ = taggedWords();
        for (let w of _) {
            if (w.selected) {
                if (w.type === FRAME_NET_TAGE_TYPE['lexicalUnit'])
                    w.type = !!w.element ? FRAME_NET_TAGE_TYPE['element'] : FRAME_NET_TAGE_TYPE['empty'];
                else
                    w.type = FRAME_NET_TAGE_TYPE['lexicalUnit'];
                w.selected = false;
            }
        }
        setTaggedWords([..._]);
    }
    const assignSupportToSelectedWord = () => {
        const _ = taggedWords();
        for (let w of _) {
            if (w.selected) {
                w.type = FRAME_NET_TAGE_TYPE['support'];
                w.element = undefined;
                w.color = undefined;
                w.selected = false;
            }
        }
        setTaggedWords([..._]);
    }
    const assignEmptyToSelectedWord = () => {
        const _ = taggedWords();
        for (let w of _) {
            if (w.selected) {
                w.type = FRAME_NET_TAGE_TYPE['empty'];
                w.element = undefined;
                w.color = undefined;
                w.selected = false;
            }
        }
        setTaggedWords([..._]);
    }

    function wordsToButtons(_taggedWords: ({
        word: string,
        type: number,
        element?: string,
        color?: string,
        selected: boolean,
    })[] | undefined | []) {
        console.log(_taggedWords);
        return (
            <For each={_taggedWords ?? []}>{(w, index) =>

                <Switch>
                    <Match when={w.type === FRAME_NET_TAGE_TYPE['empty']}>
                        <button type="button" onClick={(e) => {
                            selectTaggedWord(index(), !w.selected)
                        }}
                                class={w.selected ? 'border-4 border-dashed border-gray-900  bg-white inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-white inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                            <span class="w-full">{w.word}  </span>
                        </button>
                    </Match>
                    <Match when={w.type === FRAME_NET_TAGE_TYPE['support']}>
                        <button type="button" onClick={(e) => {
                            selectTaggedWord(index(), !w.selected)
                        }}
                                class={w.selected ? 'border-4 border-dashed border-gray-900  inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-whiteinline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                            <span class="w-full">{w.word} (واحد حمایتی) </span>
                        </button>
                    </Match>
                    <Match when={w.type === FRAME_NET_TAGE_TYPE['lexicalUnit']}>
                        <Show when={!!w.element} fallback={
                            <button type="button" onClick={(e) => {
                                selectTaggedWord(index(), !w.selected)
                            }}
                                    class={w.selected ? 'border-4 border-dashed border-gray-900 inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-white inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                                <span class="w-full">{w.word} <span class="font-bold text-gray-900"> (واحد واژگانی)</span> </span>
                            </button>
                        }>
                            <button type="button" onClick={(e) => {
                                selectTaggedWord(index(), !w.selected)
                            }}
                                    class={w.selected ? 'border-4 border-dashed border-gray-900 inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-white inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                                <span class="w-full"
                                      style={`background-color:${w.color} !important;color:white!important`}>{w.word} <span class="font-bold text-gray-900"> (واحد واژگانی)</span> </span>
                            </button>
                        </Show>

                    </Match>
                    <Match when={w.type === FRAME_NET_TAGE_TYPE['element']}>
                        <button type="button" onClick={(e) => {
                            selectTaggedWord(index(), !w.selected)
                        }}
                                class={w.selected ? 'border-4 border-dashed border-gray-900 inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-white inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                            <span class="w-full" style={`background-color:${w.color} !important;color:white!important`}>{w.word}</span>
                        </button>
                    </Match>
                </Switch>

                // <button type="button"
                //         onClick={(e) => {
                //             selectTaggedWord(index(),!w.selected)
                //         }}
                //         class={w.selected ? 'bg-gray-400 inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-gray-50 inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                //     <Show when={w.color} fallback={
                //         <span class="w-full">{w.word}</span>
                //     } >
                //         <span class="w-full" style={`color:${w.color} !important`}>{w.word}</span>
                //
                //     </Show>
                //
                // </button>


            }</For>
        );
    }

    const findFrames = async (name: string | undefined) => {
        if (!name || name.length === 0) {
            setFrames(undefined);
            return;
        }
        try {
            const ok = await (new FrameApi()).withoutWaiting(name).fetch();
            setFrames(ok.data.data);
        } catch (e) {
            setFrames(undefined);
            if (isUnauthenticated(e))
                localData.navigate('/login')
            setFrames(undefined);
        }
    }
    const findLexicalUnits = async () => {
        if (!frame()) {
            setLexicalUnits(undefined);
            return;
        }
        try {
            const ok = await (new LexicalUnitApi()).forTagging(frame()._id).fetch();
            setLexicalUnits(ok.data);
        } catch (e) {
            setLexicalUnits(undefined);
            if (isUnauthenticated(e))
                localData.navigate('/login')
        }
    }
    const findElements = async () => {
        if (!frame()) {
            setElements(undefined);
            return;
        }
        try {
            const ok = await (new ElementApi()).list(frame()._id).fetch();
            setElements(ok.data);

        } catch (e) {
            setElements(undefined);
            if (isUnauthenticated(e))
                localData.navigate('/login')
        }
    }
    const [lexicalUnitHint, setLexicalUnitHint] = createSignal("");
    const [description, setDescription] = createSignal("");
    document.title = 'برچسب نگاری';
    (new SentenceApi()).show(params.sentence).forever({
        ok(r: Ok<SentenceInterface>) {
            Log.success('r', r);
            setSentence(r.data);
            setWords(r.data.words.split(' '));
            const selectAbleWords = [];
            const forProbBanktags = []
            for (let w of words()) {
                selectAbleWords.push({
                    word: w,
                    type: FRAME_NET_TAGE_TYPE['empty'],
                    element: undefined,
                    color: undefined,
                    selected: false,
                })
                forProbBanktags.push(null);
            }
            setProbBankTags(forProbBanktags);
            setTaggedWords(selectAbleWords);
        },
        unAuthenticated(r: BadRequest) {
            localData.navigate('/login');
        },
    });
    const storeTaggedSentence = async () => {
        setLoading(true);
        try {
            const d = {
                'lexicalUnitHint': lexicalUnitHint(),
                'description': description(),
                propBankTags: sentence()?.words.split(' ').map((el) => null) ?? [],
                frame: frame()?._id ?? null,
                lexicalUnit: lexicalUnit() ?? null,
                frameNetTags: taggedWords().map((tmp) => {
                    const _tmp: any = {tagType: tmp.type};
                    if (tmp.element)
                        _tmp['element'] = tmp.element;
                    return _tmp;
                })
            };
            console.log(d);
            const ok = await (new TaggedSentenceApi()).store(params.sentence, d).fetch();
            localData.navigate(`/taggedSentence/edit/${ok.data._id}`);
            toast.success('با موفقیت ذخیره شد');
        } catch (e) {
            console.log('e', e)
            if (isBadRequest(e)) {
                setErrors((e as BadRequest).data.errors);
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

    return (<>

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

            <section
                class="bg-white border border-gray-200 rounded-lg shadow sm:flex sm:items-center sm:justify-between p-1 sm:p-1 xl:p-1  dark:bg-gray-800 dark:border-gray-700 mt-1">
                <p class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                    <For each={words()}>{(w) =>
                        <>
                            {w + ' '}
                        </>
                    }</For>
                </p>
            </section>
            <section
                class="bg-white border border-gray-200 rounded-lg shadow sm:flex sm:items-center sm:justify-between p-1 sm:p-1 xl:p-1  dark:bg-gray-800 dark:border-gray-700 mt-1">
                <div class="w-full grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-2">
                    <div>
                        <p class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                            واحد واژگانی پیشنهادی
                        </p>
                        <TextareaInput  rows={1}
                            value={''}
                            onInput={(val: any) => setLexicalUnitHint(val)}
                            error={''}

                        />
                    </div>
                    <div>
                        <p class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                            توضیحات
                        </p>
                        <TextareaInput  rows={1}
                            value={''}
                            onInput={(val: any) => setDescription(val)}
                            error={''}
                        />
                    </div>
                </div>
            </section>

            <div
                class="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mt-2">
                <div class={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 sm:gap-6`}>
                    <div class="w-full">
                        <DropDownInput
                            unique={true}
                            allowMultiple={false}
                            options={frames() ?? []}
                            label={'قالب معنایی'}
                            placeholder={'جستجوی قالب معنایی ...'}
                            customText={(val: FrameInterface) => val.name}
                            customComparator={(val: FrameInterface, current: any) =>{
                                return  val._id === current
                            }}
                            passThrough={(val) => {
                                if(val.lang == 1 && val.mirror)
                                    return val.mirror;
                                return val;
                            }}
                            onSelected={async (val: any) => {
                                setFrame(val);
                                await findLexicalUnits();
                                await findElements();
                            }}
                            onInput={(name: string | undefined) =>  setTimeout(() => findFrames(name),200)}
                            error={''}
                        />
                    </div>
                    <div class="w-full">
                        <SelectInput
                            label={'واحد واژگانی'}
                            value={''}
                            onInput={(val: any) => {
                                console.log('settting lexical unit',val);
                                setLexicalUnit(val)
                            }}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                            error={''}
                            options={lexicalUnits() ?
                                [
                                    {
                                        text: 'انتخاب واحد واژگانی',
                                        value: '',
                                    },
                                    ...lexicalUnits().map((unit: any) => {
                                        return {
                                            value: `${unit._id}`,
                                            text: `${unit.name}.${unit?.mirror ? `  ${unit.mirror.name} | ` : '' }  ${Object.keys(LEXICAL_UNIT_TYPE)[Object.values(LEXICAL_UNIT_TYPE).indexOf(unit.type)]}`
                                        }
                                    })
                                ]
                                : [
                                    {
                                        text: 'انتخاب واحد واژگانی',
                                        value: '',
                                    }
                                ]
                            }
                        />
                    </div>
                </div>
                <div class={`grid gap-4 grid-cols-1  sm:gap-6`}>
                    <div>
                        <Show when={!loading()} fallback={
                            <button disabled type="button"
                                    class="mt-4 py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">

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
                            </button>
                        }>
                            <button onClick={storeTaggedSentence}
                                    class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                                ذخیره
                            </button>
                        </Show>
                    </div>


                </div>
            </div>


            <section
                className="bg-white border border-gray-200 rounded-lg shadow p-1 sm:p-1 xl:p-1  mt-1">
                <p className="font-bold mb-5 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                    برچسب‌نگاری
                </p>
                <div
                    className="sm:flex sm:items-center sm:justify-between p-1 sm:p-1 xl:p-1 mt-1">
                    <p className="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                        {wordsToButtons(taggedWords())}
                    </p>
                </div>
            </section>

            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <div
                class="  fixed  bottom-2 z-30  text-center bg-white border border-gray-400 rounded-xl shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div class={`grid grid-cols-1    `}>
                    <div class="">
                        <button onClick={assignLexicalUnitToSelectedWord}
                                class="text-gray-900 border border-gray-900 bg-white shadow-lg shadow-gray-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                            واحد واژگانی
                        </button>
                        <button onClick={assignSupportToSelectedWord}
                                class="text-gray-900 border border-gray-900 shadow-lg shadow-gray-500/50 bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                            واحد حمایتی
                        </button>
                        <button onClick={assignEmptyToSelectedWord}
                                class="text-red-600 border border-red-600 bg-white shadow-lg shadow-red-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                            پاک کردن
                        </button>
                        <button onClick={unSelectAllTaggedWords}
                                class="text-orange-500 border border-orange-500 bg-white shadow-lg shadow-orange-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                            برداشتن انتخاب‌ها
                        </button>
                    </div>
                    <div class="">
                        <For each={elements() ?? []}>{(el) =>
                            // <button style={`border-width:medium; border-radius: 0.5rem ;border-style: solid; border-color:${el.color} !important; background-color:${invertColor(el.color)} !important;`} class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium  ">
                            <button style={`background-color:${el.color}!important;border-color:${el.color}!important;`}
                                    onClick={() => {
                                        assignElementToSelectedWord(el)
                                    }}
                                    class="text-white relative inline-flex items-center justify-center p-0.5 mb-0.5 mr-0.5 overflow-hidden text-sm font-sm  rounded-lg shadow-lg shadow-gray-500/50">
                                <span class="relative px-2 py-1 ">{el.name}</span>
                            </button>
                        }</For>
                    </div>
                </div>
            </div>
        </Show>

    </>)
}

export default StoreTaggedSentence;
