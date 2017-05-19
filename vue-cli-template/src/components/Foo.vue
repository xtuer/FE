<template id="">
    <div class="foo">
        <span>{{msg}}</span>
    </div>
</template>

<script>
    export default {
        data() {
            // name: 'foo', // name 可以不要
            return {
                msg: 'in component Foo',
            };
        },
    };
</script>

<style lang="scss">
    .foo {
        span {
            color: darkred;
        }
    }
</style>
