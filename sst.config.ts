import {SSTConfig} from "sst";
import {Api} from "./stacks/Api";
import {Web} from "./stacks/Web";
import {JavaDocker} from "./stacks/JavaDocker";
import {Conf} from "./stacks/Conf";
import {S3} from "./stacks/S3";
import {Ddb} from "./stacks/Ddb";
import {Stream} from "./stacks/Stream";
import {Bus} from "./stacks/Bus";

export default {
    config(_input) {
        return {
            name: "sst-demo",
            region: "us-west-2",
        };
    },
    stacks(app) {
        app.setDefaultFunctionProps({
            memorySize: 1024,
            architecture: "arm_64"
        });
        app.setDefaultRemovalPolicy("destroy");
        app.stack(Ddb);
        app.stack(Stream);
        app.stack(Bus);
        app.stack(Api);
        app.stack(Web);
        app.stack(S3);
        app.stack(JavaDocker);
        app.stack(Conf);
    },
} satisfies SSTConfig;
