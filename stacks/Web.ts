import {StackContext, StaticSite, use} from "sst/constructs";
import {env} from "process";
import {Stack} from "sst/constructs/Stack";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import {Api} from "./Api";
import {StaticSiteCn} from "static-site-cn";

export function Web({stack}: StackContext) {

    env.HOSTED_ZONE = stack.region.startsWith('cn')
        ? 'elonniu.cn'
        : 'elonniu.com';

    const domainName = `${stack.stage}.demo.serverless.${env.HOSTED_ZONE}`;

    if (stack.region.startsWith('cn') && stack.stage === 'prod') {
        return webCn(stack, domainName);
    }

    return webGlobal(stack, domainName);
}

export function webCn(stack: Stack, domainName: string) {

    const api = use(Api)

    const site = new StaticSiteCn(stack, "Web", {
        path: "web",
        customDomain: {
            domainName,
            iamCertificateId: env.IAM_CERTIFICATE_ID || "",
            hostedZone: env.HOSTED_ZONE,
        },
        buildCommand: "npm i && npm run build",
        buildOutput: "build",
        environment: {
            API_URL: api.customDomainUrl || "",
        },
    });

    stack.addOutputs({
        url: `https://${site.domainName}`
    });
}

export function webGlobal(stack: Stack, domainName: string) {

    const api = use(Api)

    const hostedZone = route53.HostedZone.fromLookup(stack, "HostedZone", {
        domainName: env.HOSTED_ZONE || "",
    });

    const certificate = new acm.DnsValidatedCertificate(stack, "Certificate", {
        domainName,
        hostedZone,
        subjectAlternativeNames: [`*.${env.HOSTED_ZONE}`],
        region: stack.region.startsWith('cn') ? 'cn-north-1' : 'us-east-1',
    });

    const site = new StaticSite(stack, "Web", {
            path: "web",
            customDomain: {
                domainName,
                cdk: {
                    hostedZone,
                    certificate,
                },
            },
            buildCommand: "npm i && npm run build",
            buildOutput: "build",
            environment: {
                API_URL: api.customDomainUrl || "",
            },
        }
    );

    stack.addOutputs({
        url: site.customDomainUrl || ""
    });
}
