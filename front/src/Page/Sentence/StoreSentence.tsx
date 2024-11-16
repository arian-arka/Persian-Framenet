import {Component, createSignal, For} from "solid-js";
import Form from "../../Component/Form";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import {useLocalData} from "../../Core/LocalData";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {useToast} from "../../Component/Toast";
import SentenceApi from "../../Api/Sentence.api";
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
const StoreSentence: Component = () => {
    const localData = useLocalData();
    const toast=useToast();
    const [errors,setErrors] = createSignal<any>({},{equals:false});
    const [words,setWords] = createSignal<string[]>([],{equals:false});
    document.title = 'ساخت جمله';
    const storeSentence = async (values:any, setLoading:Function) => {
        setLoading(true);
        try{
            console.log(words());
            const ok = await (new SentenceApi()).store({words : words()} ).fetch();
            console.log(ok.data);
            localData.navigate(`/sentence/edit/${ok.data._id}`);
            toast.success('با موفقیت ذخیره شد');
        }catch (e) {
            console.log('e',e);
            if(isBadRequest(e)){
                setErrors((e as BadRequest).data.errors);
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

    return (
        <>
            <Form
                errors={errors()}
                header={
                    <div class="mx-auto max-w-screen-xl mb-2">
                        <h2 class="mb-4 text-3xl leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">ساخت
                            جمله</h2>
                    </div>
                }
                onInput={(key, val) =>{
                    if(key === 'words')
                        setWords(textToWords(val));
                }}
                onSubmit={storeSentence}
                inputs={[
                    [
                        {
                            'type': 'textarea',
                            'name': 'words',
                            'label': 'جمله',
                            'placeholder': 'جمله...',
                            'value': '',
                        },
                    ],
                ]}
            />

            <section
                class="bg-white border border-gray-200 rounded-lg shadow sm:flex sm:items-center sm:justify-between p-4 sm:p-6 xl:p-8  dark:bg-gray-800 dark:border-gray-700 mt-4">
                <p class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                    <For each={words()}>{(w) =>
                    <>
                        [ {w} ]
                    </>
                    }</For>
                </p>
            </section>
        </>
    );
}
export default StoreSentence;