import React from 'react'
import App from '../../editor-ui/src/App.vue'
import { VueWrapper } from 'vuera'
import Test from './Test.vue'

export default () => (
    <div>
        <h1>Hello, testing</h1>
        <Test/>
    </div>
)
//function CodeEditor () {
//    return (
//        <div>
//            <h1>Testing if this works</h1>
//            <VueWrapper
//                component={CodeEditorVue}
//            />
//        </div>
//    )
//}
//export default CodeEditor;

//const CodeEditor = () => (
//    <div>
//        <h1>Testing if this works</h1>
//        <App/>
//    </div>
//)