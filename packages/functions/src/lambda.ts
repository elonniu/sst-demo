import {ApiHandler} from "sst/node/api";
import {Time} from "@my-sst-app/core/time";

export const handler = ApiHandler(async (event, context) => {
    console.log(JSON.stringify(event, null, "  "));

    return {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: `Hello world. The time is ${Time.now()}`,
        event
    };
});
