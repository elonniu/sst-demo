import {Bucket, StackContext} from "sst/constructs";

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

    return {s3};
}
