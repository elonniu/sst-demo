import {env} from "process";
import {App, Bucket, EventBus, Table} from "sst/constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export function stackUrl(stackId: string, app: App) {
    const {region} = app;
    return `https://${region}.console.${awsDomain(app)}/cloudformation/home?region=${region}#/stacks/stackinfo?filteringStatus=active&filteringText=&viewNested=true&stackId=${stackId}`;
}

export function s3Url(bucket: Bucket, app: App) {

    if (app.region.startsWith('cn-')) {
        return `https://console.${awsDomain(app)}/s3/buckets/${bucket.bucketName}?region=${app.region}&tab=objects`;
    }

    return `https://s3.console.${awsDomain(app)}/s3/buckets/${bucket.bucketName}?region=${app.region}&tab=objects`;
}

export function ddbUrl(tableName: string, app: App) {
    const {region} = app;
    return `https://${region}.console.${awsDomain(app)}/dynamodbv2/home#table?initialTagKey=&name=${tableName}`;
}

export function ddbExploreUrl(table: Table, app: App) {
    const {region} = app;
    return `https://${region}.console.${awsDomain(app)}/dynamodbv2/home?region=${region}#item-explorer?initialTagKey=&table=${table.tableName}`;
}

export function sqsUrl(queueName: string, app: App) {
    const {region} = app;
    return `https://${region}.console.${awsDomain(app)}/sqs/v2/home?region=${region}#/queues/https%3A%2F%2Fsqs.${app.region}.amazonaws.com%2F${app.account}%2F${queueName}`;
}

export function busUrl(bus: EventBus, app: App) {

    const {region} = app;

    return `https://${region}.console.${awsDomain(app)}/events/home?region=${region}#/eventbus/${bus.eventBusName}`;
}

export function topicUrl(topicArn: string, app: App) {

    const {region} = app;

    return `https://${region}.console.${awsDomain(app)}/sns/v3/home?region=${region}#/topic/${topicArn}`;
}

export function kdsUrl(streamName: string, app: App) {

    const {region} = app;

    return `https://${region}.console.${awsDomain(app)}/kinesis/home?region=${region}#/streams/details/${streamName}/monitoring`;
}

export function distributionUrl(id: string, app: App) {

    const {region} = app;

    return `https://${region}.console.${awsDomain(app)}/cloudfront/v3/home?#/distributions/${id}`;
}

export function route53Url(hostedZoneId: string, app: App) {

    const {region} = app;

    return `https://${region}.console.${awsDomain(app)}/route53/v2/hostedzones#ListRecordSets/${hostedZoneId}`;
}

export function lambdaUrl(fn: lambda.Function, app: App) {

    const {region} = app;

    return `https://${region}.console.${awsDomain(app)}/lambda/home?region=${region}#/functions/${fn.functionName}`;
}

export function awsDomain(app: App) {

    const {region} = app;

    if (region && region.startsWith('cn')) {
        return `amazonaws.cn`;
    }

    return `aws.amazon.com`;
}

export function apiDomain(app: App) {
    return app.stage === "prod"
        ? `${app.region}.api.${app.name}.${env.HOSTED_ZONE}`
        : `${app.stage}.${app.region}.api.${app.name}.${env.HOSTED_ZONE}`;
}

export function isDefaultRegion(app: App) {
    const {region} = app;
    return ['cn-north-1', 'us-west-2'].includes(region);
}

export function isMainWeb(app: App) {
    return 'us-west-2' === app.region && app.stage === 'prod';
}
