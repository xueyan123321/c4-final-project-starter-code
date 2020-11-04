import { videoItem } from '../models/videoItem';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('todosAccess');

export class VideosAccess {
    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3 = new XAWS.S3({
            signatureVersion: 'v4'
          }),
        private readonly videosTable = process.env.VIDEOS_TABLE,
        private readonly videoIndexTable = process.env.VIDEOS_ID_INDEX
    ){}

    async getUserVideos(userId: string){
        const result = await this.docClient.query({
                TableName: this.videosTable,
                KeyConditionExpression: "userId =:userId",
                ExpressionAttributeValues:{
                ":userId": userId
            }
          }).promise();
        return result.Items
    }

    async createVideo(videoItem: videoItem){
        await this.docClient.put({
            TableName: this.videosTable,
            Item: videoItem
        }).promise();

        return videoItem;
    }

    async updateVideo(videoId, title){
        const result = await this.docClient.query({
            TableName: this.videosTable,
            IndexName: this.videoIndexTable,
            KeyConditionExpression: "videoId =:videoId",
            ExpressionAttributeValues:{
            ":videoId": videoId
            }
        }).promise();
        await this.docClient.update({
            TableName: this.videosTable,
            Key: {
                userId: result.Items[0].userId,
                uploadAtTime: result.Items[0].uploadAtTime
            },
            UpdateExpression: "SET title = :title",
            ExpressionAttributeValues: {
                ":title": title
            }
        }).promise()
    }

    async deleteVideo(videoId: string){
        const result = await this.docClient.query({
            TableName: this.videosTable,
            IndexName: this.videoIndexTable,
            KeyConditionExpression: "videoId =:videoId",
            ExpressionAttributeValues:{
            ":videoId": videoId
            }
        }).promise();
        await this.docClient.delete({
            TableName: this.videosTable,
            Key: {
                userId: result.Items[0].userId,
                uploadAtTime: result.Items[0].uploadAtTime
            }
        }).promise()
    }

    async getUploadUrl(videoId: string){
        const uploadUrl = this.s3.getSignedUrl('putObject', {
            Bucket: process.env.ATTACHMENTS_BUCKET,
            Key: videoId,
            Expires: Number(process.env.SIGNED_URL_EXPIRATION)
          });
        logger.info(uploadUrl);
       const result = await this.docClient.query({
            TableName: this.videosTable,
            IndexName: this.videoIndexTable,
            KeyConditionExpression: "videoId =:videoId",
            ExpressionAttributeValues:{
            ":videoId": videoId
            }
        }).promise();
        logger.info(result);

        await this.docClient.update({
            TableName: this.videosTable,
            Key: { 
                userId: result.Items[0].userId,
                uploadAtTime: result.Items[0].uploadAtTime
            },
            UpdateExpression: "set attachmentUrl=:URL",
            ExpressionAttributeValues: {
              ":URL": uploadUrl.split("?")[0]
          },
          ReturnValues: "UPDATED_NEW"
        })
        .promise();
        
        return uploadUrl
    }
}