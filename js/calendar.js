/**
 * Created by smithmd on 8/5/15.
 */
$(function () {
  var monthHead = $('#currentMonth');

  // start calendar at beginning of current month
  var start = 1 - moment().date();
  var range = {start: null, end: null};

  $("#datepicker").daterangepicker({
    presetRanges: [],
    datepickerOptions: {
      minDate: start,
      maxDate: null
    },
    onChange: function () {
      range = $('#datepicker').daterangepicker('getRange');
      if (range == null) {
        range = {start: null, end: null};
        monthHead.html(monthHead.html().substring(0, monthHead.html().indexOf(' -')));
      }
      calendarDateRange.onNext(range);
    }
  });

  calendarDates.subscribe(function (s) {
    var m;
    if (s.startYear == s.endYear && s.startMonth == s.endMonth) {
      m = moment([s.startYear, s.startMonth]).format('MMM YYYY');
    } else {
      m = moment([s.startYear, s.startMonth]).format('MMM YYYY') + ' - ' + moment([s.endYear, s.endMonth]).format('MMM YYYY');
    }
    monthHead.html(m);
  });
  calendarFilters.subscribe(function (s) {
    document.getElementById('dailyFilter').checked = s.showOnlyDaily;
    document.getElementById('performanceFilter').checked = s.showOnlyPerformances;
  });
});
var prevMonth = function () {
  $('#datepicker').daterangepicker('clearRange');
  calendarDateRange.onNext({start: null, end: null});
  var date = document.getElementById('currentMonth').innerHTML.split(' - ');
  var m = moment(date[0], 'MMM YYYY').subtract(1, 'months');
  calendarDates.onNext({startYear: m.year(), startMonth: m.month(), endYear: m.year(), endMonth: m.month()});
};
var nextMonth = function () {
  $('#datepicker').daterangepicker('clearRange');
  calendarDateRange.onNext({start: null, end: null});
  var date = document.getElementById('currentMonth').innerHTML.split(' - ');
  var m = moment(date[date.length - 1], 'MMM YYYY').add(1, 'months');
  calendarDates.onNext({startYear: m.year(), startMonth: m.month(), endYear: m.year(), endMonth: m.month()});
};
var filterClick = function () {
  calendarFilters.onNext({
    showOnlyDaily: document.getElementById('dailyFilter').checked,
    showOnlyPerformances: document.getElementById('performanceFilter').checked
  });
};
