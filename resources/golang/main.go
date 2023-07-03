package main

import (
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(request events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
	// new object and set key is name, value is elon then to json string
	jsonStr, _ := json.Marshal(map[string]string{
		"message": "Hello, World! Your request was received at " + request.RequestContext.Time + ".",
	})

	return events.APIGatewayProxyResponse{
		Body:       string(jsonStr),
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(Handler)
}
