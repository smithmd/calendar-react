/**
 * Created by smithmd on 8/5/15.
 */
$(function () {
  var monthHead = $('#currentMonth');
  var subscription = calendarDates.subscribe(function (s) {
    var m = moment([s.currentYear, s.currentMonth]).format('MMM YYYY');
    monthHead.html(m);
  });
});
var prevMonth = function () {
  var m = moment(document.getElementById('currentMonth').innerHTML, 'MMM YYYY').subtract(1, 'months');
  calendarDates.onNext({currentYear: m.year(), currentMonth: m.month()});
};
var nextMonth = function () {
  var m = moment(document.getElementById('currentMonth').innerHTML, 'MMM YYYY').add(1, 'months');
  calendarDates.onNext({currentYear: m.year(), currentMonth: m.month()});
};