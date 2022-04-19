<template>
    <div class="row">

        <div class="col-3">
        </div>
        <div class="col-6">
            <select v-model="language" class="form-select" style="width:50%, margin:auto" aria-label="Default select example" @change="changeLanguageHandler()">
                <option selected>Select your language</option>
                <option value="70">Python</option>
                <option value="63">Javascript</option>
                <option value="52">C++</option>
                <option value="82">SQL</option>
                <option value="81">Scala</option>
            </select>
            <brace style="height: 500px"
                :fontsize="'12px'"
                :theme="'twilight'"
                :mode="this.currentLanguage"
                :codefolding="'markbegin'"
                :softwrap="'free'"
                :selectionstyle="'text'"
                :highlightline="true">
            </brace>
            <button class="btn btn-primary" @click="makeSubmission()"> Run</button>
        </div>
        <div class="col-3">
            <div style="margin-top: 10px">
                <h3>Output</h3>
               <b>{{ this.resp || this.error }}</b>
            </div>
        </div>
     </div>
</template>

<script>
import Brace from 'vue-bulma-brace'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    Brace
  },
    data() {
        return {
            language: 70,
            currentLanguage: 'python',
            baseURL: "https://ce.judge0.com",
            languageMap: {
                70: "python",
                63: "javascript",
                52: "c++",
                82: "sql",
                81: "scala"
            },
            requestBody: {
                    "source_code": "print('testing')",
                    "language_id": "70",
                    "number_of_runs": null,
                    "stdin": "Judge0",
                    "expected_output": null,
                    "cpu_time_limit": null,
                    "cpu_extra_time": null,
                    "wall_time_limit": null,
                    "memory_limit": null,
                    "stack_limit": null,
                    "max_processes_and_or_threads": null,
                    "enable_per_process_and_thread_time_limit": null,
                    "enable_per_process_and_thread_memory_limit": null,
                    "max_file_size": null,
                    "enable_network": null
                },
                token: null,
                resp: null,
                output: null,
                error: null
        }
    },
    methods: {
        threeSecondWait(){
            return new Promise(resolve => setTimeout(() => resolve("result"),3000));
        },

        makeSubmission() {
            console.log('make submission has been triggered')
            console.log('sending:', document.getElementsByClassName('ace_content')[0].innerText)
            this.requestBody.source_code = document.getElementsByClassName('ace_content')[0].innerText
            axios.post(`${this.baseURL}/submissions`, this.requestBody)
                .then((res)=> {
                    console.log('this is what we received:');
                    console.log(res)
                    console.log('this is what we sent; request body:')
                    console.log(this.requestBody)
                    this.token = res.data.token
                    this.threeSecondWait().then(()=>{
                        axios.get(`${this.baseURL}/submissions/${this.token}`)
                            .then((res) => {
                            console.log('after token submission')
                            console.log(res.data)
                                !res.data.stdout ? this.resp = res.data.stderr
                                :this.resp = res.data.stdout
                            })
                            .catch((err) => {
                            console.log('err', err)
                            })
                    })
                })
                .catch((err)=>{
                    this.error = err.response.data.source_code.toString()
                })
        },
        changeLanguageHandler() {
            this.requestBody.language_id = this.language.toString()
            this.currentLanguage = this.languageMap[this.language]
            console.log('language is', this.currentLanguage)

        }
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: black;
}
h3 {
    color: white;
    border-bottom:2px solid #CCC;
    padding-bottom:2px;
}
</style>
