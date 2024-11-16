import {Component} from "solid-js";

import FooterSection from "../Section/Footer.section";
import NavSection from "../Section/Nav.section";
import AsideSection from "../Section/Aside.section";
import {Outlet, useNavigate} from "@solidjs/router";
import {ToastProvider} from "../Toast";
import {useLocalData} from "../../Core/LocalData";

const Layout: Component = () => {
    const localData = useLocalData();
    const navigate = useNavigate();

    return (
        <>
            <NavSection/>
            <div id="exampleWrapper" class="">
                <AsideSection/>
                <div id="container" class="p-4 mt-20 bg-gray-100 dark:bg-gray-700">
                    <main>
                        <ToastProvider>
                            <Outlet/>
                            <FooterSection/>
                        </ToastProvider>
                    </main>
                </div>
            </div>
            <div id="___overlay_id___"  class="hidden bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
        </>
    );
}

export default Layout;