import * as functions from 'firebase-functions';
import * as path from 'path';
import { Storage } from '@google-cloud/storage';
import * as os from 'os';
import * as mkdirp from 'mkdirp-promise';

const gcs = new Storage();

export const resizeThumbnail = functions.storage.object()
    .onFinalize(async (object, context) => {
        const fileFullPath = object.name || '';
        const contentType = object.contentType;
        const fileDir = path.dirname(fileFullPath);
        const fileName = path.basename(fileFullPath);
        const tempLocalDir = path.join(os.tmpdir(), fileDir);

        console.log(`Thumbnail generation started`, fileFullPath, fileDir, fileName);

        if (!contentType?.startsWith('image/')) {
            console.log(`exit image processing`);
            return null;
        }

        await mkdirp(tempLocalDir);
        const bucket = gcs.bucket(object.bucket);
        const orignalImageFile = bucket.file(fileFullPath);
        const tempLocalFile = path.join(os.tmpdir(), fileFullPath);
        await orignalImageFile.download({ destination: tempLocalFile });
        console.log(`Downloading image to: `, tempLocalFile);

        return null;
    });