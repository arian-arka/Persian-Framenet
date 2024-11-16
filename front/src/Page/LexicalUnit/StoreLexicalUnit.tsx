import {Component, createSignal} from "solid-js";
import Form from "../../Component/Form";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import {useLocalData} from "../../Core/LocalData";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {useToast} from "../../Component/Toast";
import {useParams} from "@solidjs/router";
import LexicalUnitApi from "../../Api/LexicalUnit.api";
import {LEXICAL_UNIT_TYPE} from "../../Constant/LexicalUnit";

const StoreLexicalUnit: Component = () => {
    const params = useParams<{frame:string}>();
    const localData = useLocalData();
    const toast=useToast();
    const [errors,setErrors] = createSignal<any>({},{equals:false});
    const [mirrors, setMirrors] = createSignal<any>(undefined, {equals: false});
    document.title = 'ساخت واحد واژگانی'
    const storeLexicalUnit = async (values:any, setLoading:Function) => {
        console.log(values);
        setLoading(true);
        try{
            const ok = await (new LexicalUnitApi()).store(params.frame,values ).fetch()
            localData.navigate(`/lexicalUnit/edit/${ok.data._id}`);
            toast.success('با موفقیت ذخیره شد');
        }catch (e) {
            console.log(e);
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
                            واحد واژگانی</h2>
                    </div>
                }
                onInput={(key, val) =>{}}
                onSubmit={storeLexicalUnit}
                inputs={[
                    [
                        {
                            'type': 'text',
                            'name': 'name',
                            'label': 'نام',
                            'placeholder': 'نام   واحد واژگانی...',
                            'value': '',
                        },
                        {
                            'type': 'select',
                            'name': 'type',
                            'label': 'نوع',
                            'value': '',
                            'options': [
                                {
                                    text : 'انتخاب',
                                    value : ''
                                },
                                ...Object.keys(LEXICAL_UNIT_TYPE).map((text) => {
                                    return {
                                        'text': text,
                                        // @ts-ignore
                                        'value': `${LEXICAL_UNIT_TYPE[text]}`,
                                    }
                                })
                            ]
                        },
                    ],
                    [
                    ],
                    [
                        {
                            'type': 'textarea',
                            'name': 'definition',
                            'label': 'تعریف',
                            'placeholder': 'تعریف واحد واژگانی...',
                            'value': '',
                        },
                    ],
                ]}
            />
        </>
    );
}
export default StoreLexicalUnit;