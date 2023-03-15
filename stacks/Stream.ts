import {KinesisStream, StackContext} from "sst/constructs";

export function Stream({stack, app}: StackContext) {

    let consumers = {};
    for (let i = 1; i < 20; i++) {
        consumers[`myConsumer${i}`] = "packages/functions/src/trigger.handler";
    }
    const stream = new KinesisStream(stack, "Stream", {
        consumers: consumers,
    });

    return {stream};
}
