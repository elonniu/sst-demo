import json


def handler(event, context):
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Hello, World! Your request was received at {}.".format(event['requestContext']['time'])
        })
    }
