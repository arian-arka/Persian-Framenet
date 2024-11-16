import {Component} from "solid-js";
import 'flowbite';
import {Navigate, Route, Routes} from "@solidjs/router";
import NotFound from "./Page/NotFound";
import Layout from "./Component/Layout/Layout";
import Login from "./Page/User/Login";
import Dashboard from "./Page/Dashboard";
import StoreFrame from "./Page/Frame/StoreFrame";
import EditFrame from "./Page/Frame/EditFrame";
import ListFrame from "./Page/Frame/ListFrame";
import Frame from "./Page/Frame/Frame";
import ListElement from "./Page/Element/ListElement";
import StoreElement from "./Page/Element/StoreElement";
import EditElement from "./Page/Element/EditElement";
import StoreLexicalUnit from "./Page/LexicalUnit/StoreLexicalUnit";
import EditLexicalUnit from "./Page/LexicalUnit/EditLexicalUnit";
import ListLexicalUnit from "./Page/LexicalUnit/ListLexicalUnit";
import ListSentence from "./Page/Sentence/ListSentence";
import StoreSentence from "./Page/Sentence/StoreSentence";
import EditSentence from "./Page/Sentence/EditSentence";
import StoreTaggedSentence from "./Page/TaggedSentence/StoreTaggedSentence";
import ListUser from "./Page/User/ListUser";
import EditUser from "./Page/User/EditUser";
import StoreUser from "./Page/User/StoreUser";
import EditProfile from "./Page/User/EditProfile";
import ListMessage from "./Page/Message/ListMessage";
import EditTaggedSentence from "./Page/TaggedSentence/EditTaggedSentence";
import ListTaggedSentence from "./Page/TaggedSentence/ListTaggedSentence";
import Annotation from "./Page/LexicalUnit/Annotation";
import SearchLexicalUnit from "./Page/LexicalUnit/SearchLexicalUnit";
import UserReport from "./Page/User/UserReport";
import ListLog from "./Page/Log/ListLog";
import ReportIndex from "./Page/Report/ReportIndex";
import ReportWaitingTaggedSentences from "./Page/Report/ReportWaitingTaggedSentences";
import EnglishListTaggedSentence from "./Page/TaggedSentence/EnglishListTaggedSentence";
import EnglishListSentence from "./Page/Sentence/EnglishListSentence";
import TranslateWithFrame from "./Page/Helper/TranslateWithFrame";
import FrameInheritanceTree from "./Page/Frame/FrameInheritanceTree";
const App: Component = () => {

    return (
        <>
            <Routes>

                <Route path="/login" component={Login}/>

                <Route path="/" component={Layout}>
                    <Route path="/helper">
                        <Route path="translate-with-frame" component={TranslateWithFrame}/>
                    </Route>
                    <Route path="/" element={<Navigate href="/message/list" />}/>
                    <Route path="/report">
                        <Route path="/" component={ReportIndex}/>
                        <Route path="/reportWaitingTaggedSentences" component={ReportWaitingTaggedSentences}/>
                    </Route>
                    <Route path="/taggedSentence">
                        <Route path="/store/:sentence" component={StoreTaggedSentence}/>
                        <Route path="/edit/:taggedSentence" component={EditTaggedSentence}/>
                        <Route path="/list/english" component={EnglishListTaggedSentence}/>
                        <Route path="/list" component={ListTaggedSentence}/>
                    </Route>
                    <Route path="/sentence">
                        <Route path="/list/english" component={EnglishListSentence}/>
                        <Route path="/list" component={ListSentence}/>
                        <Route path="/store" component={StoreSentence}/>
                        <Route path="/edit/:sentence" component={EditSentence}/>
                    </Route>
                    <Route path="/frame">
                        <Route path="/inheritance" component={FrameInheritanceTree}/>
                        <Route path="/store" component={StoreFrame}/>
                        <Route path="/edit/:frame" component={EditFrame}/>
                        <Route path="/list" component={ListFrame}/>
                        <Route path="/:frame" component={Frame}/>
                    </Route>
                    <Route path="/element">
                        <Route path="/store/:frame" component={StoreElement}/>
                        <Route path="/edit/:element" component={EditElement}/>
                        <Route path="/list/:frame" component={ListElement}/>
                    </Route>
                    <Route path="/lexicalUnit">
                        <Route path="/search" component={SearchLexicalUnit}/>
                        <Route path="/store/:frame" component={StoreLexicalUnit}/>
                        <Route path="/edit/:lexicalUnit" component={EditLexicalUnit}/>
                        <Route path="/annotation/:lexicalUnit" component={Annotation}/>
                        <Route path="/list/:frame" component={ListLexicalUnit}/>
                    </Route>
                    <Route path="/user">
                        <Route path="/profile" component={EditProfile}/>
                        <Route path="/store" component={StoreUser}/>
                        <Route path="/list" component={ListUser}/>
                        <Route path="/edit/:user" component={EditUser}/>
                        <Route path="/report/:user" component={UserReport}/>
                    </Route>
                    <Route path="/log">
                        <Route path="/list" component={ListLog}/>
                    </Route>
                    <Route path="/message">
                        <Route path="/list" component={ListMessage}/>
                    </Route>
                    <Route path="/404" component={NotFound}/>
                </Route>

            </Routes>
        </>
    );
}

export default App;