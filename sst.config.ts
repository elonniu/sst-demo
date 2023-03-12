import {SSTConfig} from "sst";
import {Api} from "./stacks/Api";
import {Web} from "./stacks/Web";
import {Res} from "./stacks/Res";
import {JavaDocker} from "./stacks/JavaDocker";
import {Conf} from "./stacks/Conf";

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
        app.stack(Api);
        app.stack(Web);
        app.stack(Res);
        app.stack(JavaDocker);
        app.stack(Conf);
    },
} satisfies SSTConfig;
