import {ApiHandler} from "sst/node/api";
import {Time} from "@my-sst-app/core/time";

export const handler = ApiHandler(async (event, context) => {
    console.log(JSON.stringify(event, null, "  "));

    return {
        body: `Hello world. The time is ${Time.now()}`,
        event
    };
});
