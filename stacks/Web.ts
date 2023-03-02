import {StackContext, StaticSite, use} from "sst/constructs";
import {App} from "sst/constructs/App";
import {env} from "process";
import {Stack} from "sst/constructs/Stack";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import {Api} from "./Api";
import path from "path";
import fs from "fs";
import {execSync} from "child_process";
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import {OriginAccessIdentity} from 'aws-cdk-lib/aws-cloudfront';
import {Bucket} from "aws-cdk-lib/aws-s3";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {RemovalPolicy} from "aws-cdk-lib";

export function Web({stack, app}: StackContext) {

    env.HOSTED_ZONE = app.region.startsWith('cn')
        ? 'elonniu.cn'
        : 'elonniu.com';

    const domainName = `${app.stage}.demo.serverless.${app.region}.${env.HOSTED_ZONE}`;

    if (app.region.startsWith('cn')) {
        return webCn(stack, app, domainName);
    }

    return webGlobal(stack, app, domainName);
}

export function webGlobal(stack: Stack, app: App, domainName: string) {
    const api = use(Api)

    const hostedZone = route53.HostedZone.fromLookup(stack, "HostedZone", {
        domainName: env.HOSTED_ZONE || "",
    });

    const certificate = new acm.DnsValidatedCertificate(stack, "Certificate", {
        domainName,
        hostedZone,
        subjectAlternativeNames: [`*.${env.HOSTED_ZONE}`],
        region: app.region.startsWith('cn') ? 'cn-north-1' : 'us-east-1',
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
                VITE_GRAPHQL_URL: api.customDomainUrl + "graphql",
            },
        }
    );

    stack.addOutputs({
        url: site.customDomainUrl || ""
    });
}

export function webCn(stack: Stack, app: App, domainName: string) {
    if (!env.IAM_CERTIFICATE_ID) {
        throw new Error("Must set IAM_CERTIFICATE_ID in china region.")
    }

    const code = path.resolve("./web");
    const buildCommand = "npm i && npm run build";
    const dist = "build";

    // validate site path exists
    if (!fs.existsSync(code)) {
        throw new Error(
            `No path found at "${code}" for StaticSite.`
        );
    }

    // build
    try {
        console.log(`Building static site ${code}`);
        execSync(buildCommand, {
            cwd: code,
            stdio: "inherit",
            env: {
                ...env,
                VITE_GRAPHQL_URL: api.customDomainUrl + "graphql",
            },
        });
    } catch (e) {
        throw new Error(
            `There was a problem building the StaticSite.`
        );
    }

    const bucket = new Bucket(stack, 'Bucket', {
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY,
        websiteIndexDocument: 'index.html',
        blockPublicAccess: {
            blockPublicAcls: true,
            blockPublicPolicy: true,
            ignorePublicAcls: true,
            restrictPublicBuckets: true,
        }
    });

    new BucketDeployment(stack, `BucketDeployment`, {
        destinationBucket: bucket,
        sources: [Source.asset(`${code}/${dist}`)]
    });

    const oai = new OriginAccessIdentity(stack, 'OriginAccessIdentity', {
        comment: `${app.stage}-${app.name}-oai`
    });
    bucket.grantRead(oai);

    // Look up hosted zone
    const hostedZone = route53.HostedZone.fromLookup(stack, "HostedZone", {
        domainName: env?.HOSTED_ZONE || "",
    });

    // Create a certificate with alternate domain names
    new acm.DnsValidatedCertificate(stack, "Certificate", {
        domainName,
        hostedZone,
        subjectAlternativeNames: [`*.${env.HOSTED_ZONE}`],
        region: app.region.startsWith('cn') ? 'cn-north-1' : 'us-east-1',
    });

    const originAccessIdentity = `origin-access-identity/cloudfront/${oai.originAccessIdentityId}`;
    const site = new cloudfront.CfnDistribution(stack, `Distribution`, {

        distributionConfig: {
            aliases: [
                domainName,
            ],

            origins: [
                {
                    s3OriginConfig: {
                        originAccessIdentity,
                    },
                    connectionAttempts: 3,
                    connectionTimeout: 10,
                    domainName: bucket.bucketDomainName,
                    id: bucket.bucketName
                }
            ],
            originGroups: {
                quantity: 0
            },

            defaultCacheBehavior: {
                viewerProtocolPolicy: "redirect-to-https",
                allowedMethods: [
                    'HEAD',
                    'GET',
                ],
                cachedMethods: [
                    'HEAD',
                    'GET',
                ],
                compress: true,
                defaultTtl: 360,
                forwardedValues: {
                    queryString: true
                },
                maxTtl: 3600,
                minTtl: 0,
                smoothStreaming: false,
                targetOriginId: bucket.bucketName,
            },
            comment: 'Live streaming',
            enabled: true,
            restrictions: {
                geoRestriction: {
                    restrictionType: 'none'
                }
            },
            httpVersion: 'http1.1',
            defaultRootObject: 'index.html',
            ipv6Enabled: !app.region.startsWith('cn'),
            viewerCertificate: {
                iamCertificateId: env.IAM_CERTIFICATE_ID,
                minimumProtocolVersion: 'TLSv1',
                sslSupportMethod: 'sni-only'
            }
        }
    });

    new route53.CnameRecord(stack, "Cname", {
        zone: hostedZone,
        domainName: site.attrDomainName,
        domainName
    });
}
