import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../assignment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextService } from '../context.service';
import { MatDialog } from '@angular/material';
import { Assignment } from '../assignment';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { TaskService } from '../task.service';
import { Task } from '../task';
import { Exercise } from '../exercise';

@Component({
  selector: 'app-execution-view',
  templateUrl: './execution-view.component.html',
  styleUrls: ['./execution-view.component.css']
})
export class ExecutionViewComponent implements OnInit {
  public assignment: Assignment = new Assignment();
  public unexpectedError = false;
  public assignmentForm: FormGroup;
  public readOnlyMode = false;
  public tasks: Task[] = [];
  public selectedTask: Task = null;

  constructor(private assignmentService: AssignmentService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private contextService: ContextService,
    private dialogService: MatDialog,
    private taskService: TaskService) {
      this.assignment.execution = new Exercise();
      this.assignment.exercise = new Exercise();
  }

  public ngOnInit() {
    this.activeRoute.params
      .subscribe(params => this.reloadData(params));
  }

  public back() {
    this.location.back();
  }

  private errorOccurred(err: Error) {
    this.unexpectedError = true;
  }

  private reloadData(params: { [key: string]: string}) {
    const therapyId = params['therapyId'];
    const assignmentId = params['assignmentId'];

    this.assignmentService.getAssignment(assignmentId)
        .subscribe(assignment => this.assignmentLoaded(assignment));
  }

  private assignmentLoaded(assignment: Assignment) {
    this.assignment = assignment;
    this.taskService.getTasksForExcersise(this.assignment.executionId)
      .subscribe(tasks => this.tasksLoaded(tasks));
  }
  private tasksLoaded(tasks: Task[]) {
    this.tasks = tasks;
    this.selectedTask = this.tasks[0];
  }
}
