import {ApiHandler} from "sst/node/api";
import {Time} from "@my-sst-app/core/time";
import console from "console";

export const handler = ApiHandler(async (event) => {
    console.log(JSON.stringify(event, null, "  "));

    return {
        body: `Hello world. The time is ${Time.now()}`,
    };
});
