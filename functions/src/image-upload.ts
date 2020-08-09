import * as functions from 'firebase-functions';
import * as path from 'path';
import { Storage } from '@google-cloud/storage';
import * as os from 'os';
import * as mkdirp from 'mkdirp-promise';
import { spawn } from 'child-process-promise';

const gcs = new Storage();

export const resizeThumbnail = functions.storage.object()
    .onFinalize(async (object, context) => {
        const fileFullPath = object.name || '';
        const contentType = object.contentType;
        const fileDir = path.dirname(fileFullPath);
        const fileName = path.basename(fileFullPath);
        const tempLocalDir = path.join(os.tmpdir(), fileDir);

        console.log(`Thumbnail generation started`, fileFullPath, fileDir, fileName);

        if (!contentType?.startsWith('image/') || fileName.startsWith('thumb_')) {
            console.log(`exit image processing`);
            return null;
        }

        await mkdirp(tempLocalDir);
        const bucket = gcs.bucket(object.bucket);
        const orignalImageFile = bucket.file(fileFullPath);
        const tempLocalFile = path.join(os.tmpdir(), fileFullPath);
        await orignalImageFile.download({ destination: tempLocalFile });
        console.log(`Downloading image to: `, tempLocalFile);

        // Generate a thumbnail using image magik
        const outputFilePath = path.join(fileDir, 'thumb_' + fileName);

        const outputFile = path.join(os.tmpdir(), outputFilePath);

        console.log(`generating a thumbnail to ${outputFile}`);

        await spawn('convert', [tempLocalFile, '-thumbnail', '510x287 >', outputFile], {
            capture: ['stdout', 'stderr']
        });
        // Upload the thumbnail to storage

        const metadata = {
            contentType: object.contentType,
            cacheControl: `public,max-age=2592000, s-maxage=2592000`
        };

        console.log(`uploading the thumbnail to storage`, outputFile, outputFilePath);

        await bucket.upload(outputFile, { destination: outputFilePath, metadata });

        return null;
    });