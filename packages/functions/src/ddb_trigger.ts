import * as console from "console";
import {feishu} from "../../lib/Notify";

export async function handler(event: Object, context: Object, callback: CallableFunction) {

    console.log(JSON.stringify({
        records: event.Records.length,
        size: Buffer.byteLength(JSON.stringify(event), 'utf8')
    }, null, "  "));

    for (let i in event.Records) {
        const {dynamodb} = event.Records[i];
        const {NewImage} = dynamodb;
        console.log(NewImage);
    }

    await feishu(event);

    return {}
}
