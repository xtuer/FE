<template>
    <div id="not-found">
        <h1>Page Not Found</h1>
        <p>Sorry, but the page you were trying to view does not exist.</p>
    </div>
</template>

<style lang="scss">
    #not-found {
        display: table;
        width: 100%;
        height: 100%;
        color: #888;
        margin: 0 auto;
        padding-top: 20px;
        text-align: center;

        h1 {
            color: #555;
            font-size: 2em;
            font-weight: 400;
        }

        @media only screen and (max-width: 280px) {
            p {
                width: 95%;
            }
            h1 {
                font-size: 1.5em;
                margin: 0 0 0.3em;
            }
        }
    }
</style>
