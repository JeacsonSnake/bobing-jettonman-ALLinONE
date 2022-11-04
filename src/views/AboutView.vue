<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="foo()">fff</button>
  </div>
</template>

<script>
import {fooo} from '../api'
export default {
    
    methods: {
        foo() {
            fooo().then((res) => {
                console.log(`res`, res.data);
            }).catch((err) => {
                console.log(`err`, err);
            })
        }
    }
}
</script>
