import {SSTConfig} from "sst";
import {Api} from "./stacks/Api";
import {Web} from "./stacks/Web";
import {JavaDocker} from "./stacks/JavaDocker";
import {Conf} from "./stacks/Conf";
import {S3} from "./stacks/S3";
import {Ddb} from "./stacks/Ddb";
import {Stream} from "./stacks/Stream";
import {Bus} from "./stacks/Bus";
import {Sqs} from "./stacks/Sqs";
import {Task} from "./stacks/Task";

export default {
    config(_input) {
        return {
            name: "sst-demo",
            region: "cn-northwest-1",
            profile: "gcr",
        };
    },
    stacks(app) {
        app.setDefaultFunctionProps({
            memorySize: 1024,
            architecture: "arm_64",
            runtime: 'nodejs18.x',
            environment: {
                FEISHU_ID: process.env.FEISHU_ID || ""
            }
        });
        app.setDefaultRemovalPolicy("destroy");
        app.stack(Conf);
        app.stack(Ddb);
        app.stack(Sqs);
        app.stack(Stream);
        app.stack(Bus);
        app.stack(S3);
        app.stack(Api);
        app.stack(Task);
        app.stack(JavaDocker);
        if (!app.local) {
            app.stack(Web);
        }
    },
} satisfies SSTConfig;
