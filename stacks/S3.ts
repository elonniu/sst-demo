import {Bucket, StackContext} from "sst/constructs";
import {s3Url} from "../packages/lib/ResourceUrl";

export function S3({stack, app}: StackContext) {

    const s3 = new Bucket(stack, "Bucket", {
        notifications: {
            myNotification1: {
                function: "packages/functions/src/trigger.handler",
                events: ["object_created"],
            },
            myNotification2: {
                function: "packages/functions/src/trigger.handler",
                events: ["object_removed"],
            },
        },
    });

    stack.addOutputs({
        url: s3Url(s3, app),
    });

    return {s3};
}
