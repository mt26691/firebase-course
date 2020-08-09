import * as functions from 'firebase-functions';
import { db } from './init';

export const onAddLessons = functions.firestore.document('/courses/{courseId}/lessons/{lessonId}')
    .onCreate(async (snap, context) => {
        console.log(`Running on add lessons counters`);

        return db.runTransaction(async transaction => {

            const courseRef = snap.ref.parent.parent;

            if (!courseRef) {
                return;
            }
            const courseSnapShot = await transaction.get(courseRef);
            const course = courseSnapShot.data();
            if (!course) {
                return;
            }
            const changes = { lessonsCount: course.lessonsCount + 1 };
            transaction.update(courseRef, changes);
        });
    });
