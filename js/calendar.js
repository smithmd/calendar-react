/**
 * Created by smithmd on 8/5/15.
 */
$(function () {
  var monthHead = $('#currentMonth');

  // start calendar at beginning of current month
  var start = 1 - moment().date();
  var range = {start: null, end: null};

  $("#mob-datepicker").daterangepicker({
    presetRanges: [],
    datepickerOptions: {
      minDate: start,
      maxDate: null,
      numberOfMonths: 1
    },
    onChange: function () {
      range = $('#mob-datepicker').daterangepicker('getRange');
      if (range == null) {
        range = {start: null, end: null};
        if (~monthHead.html().indexOf('-')) {
          monthHead.html(monthHead.html().substring(0, monthHead.html().indexOf(' -')));
        }
      }
      calendarDateRange.onNext(range);
    }
  });

  $("#dsk-datepicker").daterangepicker({
    presetRanges: [],
    datepickerOptions: {
      minDate: start,
      maxDate: null,
      numberOfMonths: 2
    },
    onChange: function () {
      range = $('#dsk-datepicker').daterangepicker('getRange');
      if (range == null) {
        range = {start: null, end: null};
        if (~monthHead.html().indexOf('-')) {
          monthHead.html(monthHead.html().substring(0, monthHead.html().indexOf(' -')));
        }
      }
      calendarDateRange.onNext(range);
    }
  });
  calendarDateRange.subscribe(function (s) {
    var ddp = $('#dsk-datepicker');
    var mdp = $('#mob-datepicker');
    if (ddp.daterangepicker && mdp.daterangepicker) {
      if (JSON.stringify(ddp.daterangepicker('getRange')) !== JSON.stringify(s)) {
        ddp.daterangepicker('setRange', s);
      }
      if (JSON.stringify(mdp.daterangepicker('getRange')) !== JSON.stringify(s)) {
        mdp.daterangepicker('setRange', s);
      }
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
  dailyFilter.subscribe(function (s) {
    document.getElementById('mob-dailyFilter').checked = s;
    document.getElementById('dsk-dailyFilter').checked = s;
  });
  performanceFilter.subscribe(function (s) {
    document.getElementById('mob-performanceFilter').checked = s;
    document.getElementById('dsk-performanceFilter').checked = s;
  });

  $('.ui.sidebar').first().sidebar('attach events', '#open-menu');
});

var prevMonth = function () {
  $('#mob-datepicker').daterangepicker('clearRange');
  $('#dsk-datepicker').daterangepicker('clearRange');
  calendarDateRange.onNext({start: null, end: null});
  var date = document.getElementById('currentMonth').innerHTML.split(' - ');
  var m = moment(date[0], 'MMM YYYY').subtract(1, 'months');
  calendarDates.onNext({startYear: m.year(), startMonth: m.month(), endYear: m.year(), endMonth: m.month()});
};
var nextMonth = function () {
  $('#mob-datepicker').daterangepicker('clearRange');
  $('#dsk-datepicker').daterangepicker('clearRange');
  calendarDateRange.onNext({start: null, end: null});
  var date = document.getElementById('currentMonth').innerHTML.split(' - ');
  var m = moment(date[date.length - 1], 'MMM YYYY').add(1, 'months');
  calendarDates.onNext({startYear: m.year(), startMonth: m.month(), endYear: m.year(), endMonth: m.month()});
};