import {env} from "process";
import https from "https";
import {IncomingWebhook} from '@slack/webhook';

export function feishu(json: Object) {

    if (!env.FEISHU_ID) {
        throw new Error(`FEISHU_ID not set`);
    }

    const text = JSON.stringify(json, null, "\t");

    const params = {
        msg_type: 'text',
        content: {
            text
        }
    };

    const options = {
        hostname: 'open.feishu.cn',
        path: `/open-apis/bot/v2/hook/${env.FEISHU_ID}`,
        port: 443,
        method: 'POST'
    };

    return notify(options, JSON.stringify(params));
}

export function slack(json: Object) {

    if (!env.SLACK_ID) {
        return;
    }

    const data = JSON.stringify(json, null, "\t");

    const webhook = new IncomingWebhook(`https://hooks.slack.com/services/${env.SLACK_ID}`);

    return webhook.send({
        text: data,
    });
}

export function wecom(json: Object) {

    if (!env.WECOM_ID) {
        return;
    }

    const content = JSON.stringify(json, null, "\t");

    const params = {
        msgtype: 'text',
        text: {
            content
        }
    };

    const options = {
        hostname: 'qyapi.weixin.qq.com',
        path: `/cgi-bin/webhook/send?key=${env.SLACK_ID}`,
        port: 443,
        method: 'POST'
    };

    return notify(options, JSON.stringify(params));
}

export function notify(options: Object, data: string) {

    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let rawData = '';

            res.on('data', chunk => {
                rawData += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    body: rawData
                });
            });
        });

        req.on('error', err => {
            reject(err);
        });

        req.write(data);

        req.end();
    });
}
