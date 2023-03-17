import {KinesisStream, StackContext} from "sst/constructs";
import {kdsUrl} from "../packages/lib/ResourceUrl";

export function Stream({stack, app}: StackContext) {

    let consumers = {};
    for (let i = 1; i <= 1; i++) {
        consumers[`myConsumer${i}`] = "packages/functions/src/trigger.handler";
    }
    const stream = new KinesisStream(stack, "Stream", {
        consumers: consumers,
    });

    stack.addOutputs({
        url: kdsUrl(stream.streamName, app),
    });

    return {stream};
}
