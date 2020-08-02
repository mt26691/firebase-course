


import { Course } from "../model/course";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, take, first } from 'rxjs/operators';
import {convertSnaps} from './db-utils';

@Injectable({ providedIn: 'root' })
export class CoursesService {

    constructor(private db: AngularFirestore) {
    }

    loadAllCourses(): Observable<Course[]> {
        return this.db.collection('courses', ref =>
            ref.orderBy("seqNo")
        ).snapshotChanges()
            .pipe(map(snaps => {
                return convertSnaps<Course>(snaps);
            }), first());
    }

    findCourseByUrl(courseUrl: string): Observable<Course> {
        return this.db.collection('courses',
            ref => ref.where("url", "==", courseUrl))
            .snapshotChanges()
            .pipe(
                map(snaps => {
                    const courses = convertSnaps<Course>(snaps);
                    return courses.length === 1 ? courses[0] : undefined;
                }),
                first()
            )
    }
}
