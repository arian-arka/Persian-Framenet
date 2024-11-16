import {A} from "@solidjs/router";
import {Component, createSignal, For, Show} from "solid-js";
import FrameApi from "../../Api/Frame.api";
import {Ok} from "../../Core/Api/Response/Ok";
import FrameInterface from "../../Type/Frame.interface";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {useLocalData} from "../../Core/LocalData";

const FrameInheritanceTree: Component = () => {

    const localData = useLocalData();

    const [collapse,setCollapse] = createSignal(false);

    const [tree, setTree] = createSignal(undefined, {equals: false});

    const generateTreeArray = (arr: any[], index = 0) => {
        return (
            <>

                <style>{`
                .margin-tree-index-${index * 8} {
                margin-left:${index * 8}px;
                border-color : #bbbeca;
                } 
                `}</style>

                <ul
                    class={`list-disc space-y-4 text-gray-500 pl-2 border-l-2 list-inside dark:text-gray-400  margin-tree-index-${index * 8}`}>
                    <For each={arr}>{(node) => generateTreeNode(node, index)}</For>
                </ul>

            </>
        );
    }

    const closeAllChildren = (node,status:boolean=false) => {
        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; i++)
                closeAllChildren(node[i],status);
        } else {
            node.open = status;
            closeAllChildren(node.children,status);
        }
    }

    const generateTreeNode = (node: any, index: number) => {
        if (node.open)
            return (
                <li>
                    <div class="inline">
                        <A href={`/frame/${node.value.english._id}`}
                           class="inline-block font-medium text-gray-900 hover:underline">
                            {node.value.english.name}
                        </A>
                        <Show when={node.value.persian}>
                            <>

                                /


                                <A href={`/frame/${node.value.persian._id}`}
                                   class="inline-block font-medium text-gray-900 hover:underline">
                                    {node.value.persian.name}
                                </A>
                            </>
                        </Show>
                        <span onClick={() => {
                            closeAllChildren(node);
                            setTree(tree());
                        }} class="ml-2 inline-block font-medium text-red-600 ">
                            <Show when={(node?.children ?? []).length}>
                                <svg class="w-2 h-2 ml-2 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
  </svg>
                            </Show>
                        </span>
                    </div>

                    {generateTreeArray(node?.children ?? [], index + 1)}
                </li>
            );
        return (
            <li>
                <div class="inline">
                    <A href={`/frame/${node.value.english._id}`}
                       class="inline-block font-medium text-gray-900 hover:underline">
                        {node.value.english.name}
                    </A>
                    <Show when={node.value.persian}>
                        <>

                            /


                            <A href={`/frame/${node.value.persian._id}`}
                               class="inline-block font-medium text-gray-900 hover:underline">
                                {node.value.persian.name}
                            </A>
                        </>
                    </Show>
                    <span onClick={() => {
                        node.open = true;
                        setTree(tree());
                    }} class="ml-2 inline-block font-medium text-blue-600  ">
                        <Show when={(node?.children ?? []).length}>
                            <svg class="w-2 h-2 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 8 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
  </svg>
                        </Show>
                    </span>
                </div>
            </li>
        );
    }

    const correctData = (data : any) => {
        if (Array.isArray(data))
            for (let i = 0;i<data.length;i++)
                correctData(data[i]);
        else {
            data.open = false;
            if (data.children.length)
                correctData(data.children);
        }
    }

    (new FrameApi()).inheritanceTree().forever({
        ok(r: Ok<any>) {
            const data = r.data.data;
            Log.success('data', data);
            correctData(data);
            setTree([{
                'value' : {
                    'english' : {
                        '_id': '#',
                        'name' : 'Inheritance'
                    },
                    'persian' : undefined
                },
                'children' : data
            }])
        },
        unAuthenticated(r: BadRequest) {
            localData.navigate('/login');
        },
    });

    return (
        <>
        <div dir="ltr"
             class="items-start  p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" onChange={() => {
                    setCollapse(!collapse());
                    closeAllChildren(tree(),collapse());
                    setTree(tree());
                }}  class="sr-only peer"/>
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Collapse</span>
            </label>

        </div>

        <div dir="ltr"
             class="items-start  p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

            <Show when={tree() !== undefined} fallback={
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
                {generateTreeArray(tree())}
            </Show>
        </div>
        </>
    );
}
export default FrameInheritanceTree;