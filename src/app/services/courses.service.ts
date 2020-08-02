


import { Course } from "../model/course";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, take, first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CoursesService {

    constructor(private db: AngularFirestore) {
    }

    loadAllCourses(): Observable<Course[]> {
        return this.db.collection('courses', ref =>
            ref.orderBy("seqNo")
        ).snapshotChanges()
            .pipe(map(snaps => {
                return snaps.map(snap => {
                    return <Course>{
                        id: snap.payload.doc.id,
                        ...(snap.payload.doc.data() as any)
                    };
                });
            }), first());
    }

    findCourseByUrl(courseUrl: string): Observable<Course> {
        return this.db.collection('courses',
            ref => ref.where("url", "==", courseUrl))
            .snapshotChanges()
            .pipe(
                map(snaps => {
                    const courses = snaps.map(snap => {
                        return <Course>{
                            id: snap.payload.doc.id,
                            ...(snap.payload.doc.data() as any)
                        };
                    });
                    return courses.length === 1 ? courses[0] : undefined;
                }),
                first()
            )
    }
}
