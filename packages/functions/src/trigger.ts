import * as console from "console";
import {feishu} from "../../lib/Notify";

export async function handler(event: Object, context: Object, callback: CallableFunction) {

    console.log(JSON.stringify({
        event,
        context
    }, null, "  "));

    await feishu(event);

    return {}
}
