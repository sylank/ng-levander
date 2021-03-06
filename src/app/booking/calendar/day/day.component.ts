import { Component, OnInit, HostBinding, Input, AfterContentChecked, OnDestroy } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Subscription } from 'rxjs';
import { ReservedRange } from '../reserved.range';

@Component({
  selector: 'calendar-day',
  template: '{{ content }}',
  styleUrls: ['./day.component.sass']
})
export class DayComponent implements OnInit, OnDestroy, AfterContentChecked {

  constructor(private calendarService: CalendarService) { }

  @Input() content: number;
  @Input() currentDate: { currentYear: number, currentMonth: number };
  @Input() selectedDate: Date;
  @HostBinding('class.selected') selected = false;
  @HostBinding('class.disabled') disabled = false;
  @HostBinding('class.reserved') reserved = false;
  @HostBinding('class.temporary') temporary = false;

  disableDays: Subscription;

  disablePastDays(): void {
    const today = new Date();
    if (this.currentDate.currentYear === today.getFullYear() &&
        this.currentDate.currentMonth === today.getMonth() && this.content <= today.getDate()) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }

  ngOnInit() {
    this.selected = false;
    if (this.calendarService.selectedDate.getDate() === this.content) {
      this.selected = true;
    }
    this.disableDays = this.calendarService.disableDays.subscribe((reservedRanges: ReservedRange[]) => {
      this.reserved = false;
      this.temporary = false;
      reservedRanges.forEach((reservedRange: ReservedRange) => {
        if (reservedRange.range.length === 0) {
          this.reserved = false;
        }
        if (reservedRange.range.indexOf(this.content) !== -1) {
          if (reservedRange.temporary) {
            this.temporary = true;
          } else {
            this.reserved = true;
          }
        }
      });
    });
  }

  ngAfterContentChecked() {
    this.disablePastDays();
    this.selected = false;
    if (this.calendarService.selectedDate.getFullYear() === this.currentDate.currentYear &&
        this.calendarService.selectedDate.getMonth() === this.currentDate.currentMonth &&
        this.calendarService.selectedDate.getDate() === this.content) {
      this.selected = true;
    }
  }

  ngOnDestroy() {
    this.disableDays.unsubscribe();
    this.reserved = false;
  }

}
