import {response} from "../../lib/Api";
import {ApiHandler} from "sst/node/api";
import console from "console";
import {Config} from "sst/node/config";

export const handler = ApiHandler(async (event) => {

    console.log(JSON.stringify(event, null, "  "));

    return response({
        conf: Config.USER_UPDATED_TOPIC_NAME,
        STRIPE_KEY: Config.STRIPE_KEY,
    });
});
