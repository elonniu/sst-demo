import * as console from "console";

export async function handler(event: Object, context: Object, callback: CallableFunction) {

    console.log(JSON.stringify({
        event,
        context
    }, null, "  "));

    return {}
}
