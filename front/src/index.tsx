/* @refresh reload */
import {render} from 'solid-js/web';

import './index.css';
import App from './App';
import {Router} from "@solidjs/router";
import {NavigationProvider} from "./Core/Navigation";
import {LocalDataProvider} from "./Core/LocalData";
import {ToastProvider} from "./Component/Toast";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
    );
}

render(() => {
    return (
        <Router>
            <LocalDataProvider keys={['email','name','privileges','isSuperAdmin','taggedSentenceFrameSearch']}>
                <NavigationProvider>
                    <App/>
                </NavigationProvider>
            </LocalDataProvider>
        </Router>
    )
}, root!);
