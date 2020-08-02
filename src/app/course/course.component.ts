import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { tap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { CoursesService } from 'app/services/courses.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course: Course;

  lessons: Lesson[];

  lastPageLoaded = 0;

  displayedColumns = ['seqNo', 'description', 'duration'];

  dataSource: any;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {
  }

  ngOnInit() {

    this.course = this.route.snapshot.data['course'];
    this.loading = true;
    this.coursesService.findLessons(this.course.id)
      .pipe(finalize(() => { this.loading = false }))
      .subscribe(data => {
        this.lessons = data;
      });
  }

  loadMore() {
    this.lastPageLoaded++;
    this.course = this.route.snapshot.data['course'];
    this.loading = true;
    this.coursesService.findLessons(this.course.id, 'asc', this.lastPageLoaded, 3)
      .pipe(finalize(() => this.loading = false))
      .subscribe(data => {
        this.lessons = this.lessons.concat(data);
      });
  }


}
