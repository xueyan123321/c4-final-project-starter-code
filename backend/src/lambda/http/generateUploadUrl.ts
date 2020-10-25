import 'source-map-support/register'
import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
});

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //@ts-ignore
  const todoId = event.pathParameters.todoId

  const url = getUploadUrl(todoId);
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}

function getUploadUrl(todoId: string){
  return s3.getSignedUrl('putObject', {
    Bucket: process.env.ATTACHMENTS_BUCKET,
    Key: todoId,
    Expires: Number(process.env.SIGNED_URL_EXPIRATION)
  })
}

