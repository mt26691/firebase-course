import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Course } from "../model/course";
import { Observable, of } from 'rxjs';
import { CoursesService } from './courses.service';

@Injectable()
export class CourseResolver implements Resolve<Course> {

    constructor(private courseService: CoursesService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
        const url = route.paramMap.get('courseUrl');
        
        return this.courseService.findCourseByUrl(url);
    }
}

