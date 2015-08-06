/**
 * Created by smithmd on 7/22/15.
 */

var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var selectedDate = new Rx.BehaviorSubject({date: moment().format('YYYY-MM-DD')});
// selectedDate.onNext called by click and changes state

var calendarDates = new Rx.BehaviorSubject({
  currentMonth: moment().month(),
  currentYear: moment().year(),
  startDate: null,
  endDate: null
});

var calendarFilters = new Rx.BehaviorSubject({
  showOnlyDaily:true
});