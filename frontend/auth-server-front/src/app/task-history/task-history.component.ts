import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PagingController } from "src/common/paging";
import { TaskHistory } from "src/common/task";
import { TaskService } from "../task.service";
import { isEnterKey } from "../../common/condition";

export interface TaskHistoryData {
  taskId: number;
}

@Component({
  selector: "app-task-history",
  templateUrl: "./task-history.component.html",
  styleUrls: ["./task-history.component.css"],
})
export class TaskHistoryComponent implements OnInit {
  readonly COLUMNS_TO_BE_DISPLAYED: string[] = [
    "taskId",
    "jobName",
    "startTime",
    "endTime",
    "runBy",
    "runResult",
  ];

  jobName: string = null;
  taskId: number = null;
  runBy: string = "";
  pagingController: PagingController;
  taskHistoryList: TaskHistory[] = [];
  startDate: Date = null;
  endDate: Date = null;

  datePickerLowerbound: Date;
  datePickerUpperbound: Date;

  isEnter = isEnterKey;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    let ld = new Date();
    ld.setFullYear(ld.getFullYear() - 1);
    this.datePickerLowerbound = ld;

    let ud = new Date();
    ud.setFullYear(ud.getFullYear() + 1);
    this.datePickerUpperbound = ud;

    this.route.paramMap.subscribe((params) => {
      let ti = params.get("taskId");
      if (ti != null) this.taskId = Number(ti);
    });
  }

  fetchHistoryList() {
    const start: Date = this.startDate;
    const end: Date = this.endDate;
    this.taskService
      .fetchTaskHistory({
        pagingVo: this.pagingController.paging,
        jobName: this.jobName,
        taskId: this.taskId,
        startTime: start ? formatDate(start, 'yyyy-MM-dd hh:mm:ss', 'en-US') : null,
        endTime: end ? formatDate(end, 'yyyy-MM-dd hh:mm:ss', 'en-US') : null,
        runBy: this.runBy,
      })
      .subscribe({
        next: (resp) => {
          this.taskHistoryList = resp.data.list;
          this.pagingController.onTotalChanged(resp.data.pagingVo);
        },
      });
  }

  onDatePickerChanged(): void {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      let temp = this.endDate;
      this.endDate = this.startDate;
      this.startDate = temp;
    }
  }

  reset(): void {
    this.jobName = null;
    this.taskId = null;
    this.startDate = null;
    this.endDate = null;
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchHistoryList();
    this.fetchHistoryList();
  }
}
