import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { Course } from 'app/model/course';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    const courseRef = this.db.doc(`/courses/7t73EL7of191Xn9KqCbv`).snapshotChanges()
      .subscribe(snap => {
        const course: any = snap.payload.data();
        console.log(`courseRef = ${course.relatedCourseRef}`);
        console.log(course);

      });

    const ref = this.db.doc(`/courses/485Nc6rcz0x4CxgW62KT`).snapshotChanges()
      .subscribe(doc => {
        console.log("ref");
        console.log(doc.payload.ref);
        console.log(doc.payload.data())
      });
  }

  save() {
    const firebaseCourseRef = this.db.doc('/courses/485Nc6rcz0x4CxgW62KT').ref;
    const firebaseCourseRef1 = this.db.doc('/courses/7t73EL7of191Xn9KqCbv').ref;

    const batch = this.db.firestore.batch();

    batch.update(firebaseCourseRef1, {
      titles: {
        description: 'Serverless Angular with Firebase Course1',
        longDescription: 'Serveless Angular with Firestore, Firebase Storage & Hosting, Firebase Cloud Functions & AngularFire1'
      }
    });

    batch.update(firebaseCourseRef, {
      titles: {
        description: 'The Complete Typescript Course1',
        longDescription: 'Complete Guide to Typescript From Scratch: Learn the language in-depth and use it to build a Node REST API.1'
      }
    });

    const batch$ = of(batch.commit());
    batch$.subscribe();
  }

  async runTransaction() {
    const newCounter = await this.db.firestore.runTransaction(async transaction => {
      console.log(`running transaction`);

      const courseRef = this.db.doc('/courses/JyrmvrfbLV1MCCBNhEVm').ref;

      const snap = await transaction.get(courseRef);
      const course = <Course>snap.data();

      const lessonsCount = course.lessonsCount + 1;
      transaction.update(courseRef, { lessonsCount: lessonsCount });

      return lessonsCount;
    });

    console.log(`new value for counter = ${newCounter}`);
  }

}
