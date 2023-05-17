import {ApiHandler} from "sst/node/api";
import {Time} from "@my-sst-app/core/time";
import console from "console";
import {feishu} from "../../lib/Notify";

export const handler = ApiHandler(async (event) => {
    console.log(JSON.stringify(event, null, "  "));

    await feishu({message: "Hi Lambda"});

    return {
        body: `Hello world. The time is ${Time.now()}`,
    };
});
