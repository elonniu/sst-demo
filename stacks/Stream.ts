import {KinesisStream, StackContext} from "sst/constructs";
import {kdsUrl} from "../packages/lib/ResourceUrl";

export function Stream({stack, app}: StackContext) {

    const stream = new KinesisStream(stack, "Stream", {
        consumers: {
            consumer1: "packages/functions/src/trigger.handler"
        },
    });

    stack.addOutputs({
        url: kdsUrl(stream.streamName, app),
    });

    return {stream};
}
