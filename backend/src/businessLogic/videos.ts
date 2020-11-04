import * as uuid from 'uuid'
import { videoItem } from '../models/videoItem'
import { CreateVideoRequest } from '../requests/CreateVideoRequest'
import { VideosAccess } from '../dataLayer/videosAccess'

const videosAccess = new VideosAccess();

export async function getUserVideos(userId:string){
    return videosAccess.getUserVideos(userId)
}

export async function createVideo(requestBody: CreateVideoRequest, userId: string): Promise<videoItem>{
    const itemId = uuid.v4();
    return await videosAccess.createVideo({
        videoId: itemId,
        userId,
        uploadAtTime: new Date().toISOString(),
        title: requestBody.title,
    })
}

export async function updateVideo(videoId: string, title: string){
    await videosAccess.updateVideo(videoId, title);
}

export async function deleteVideo(videoId: string): Promise<void>{
    await videosAccess.deleteVideo(videoId);
}

export async function getUploadUrl(videoId: string){
    return await videosAccess.getUploadUrl(videoId);
}