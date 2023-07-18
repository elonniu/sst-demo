import {Cron, StackContext} from "sst/constructs";

export function Task({stack, app}: StackContext) {

    new Cron(stack, "CronJob", {
        schedule: "rate(1 minute)",
        enabled: app.local,
        job: {
            function: {
                handler: "resources/golang/cron/main.go",
                runtime: "go1.x",
                architecture: "x86_64",
            }
        },
    });

}
