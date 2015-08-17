/**
 * Created by smithmd on 7/22/15.
 */

var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var venues = ['Any', 'Corson Auditorium', 'Dendrinos Chapel and Recital Hall', 'DeRoy Center for Film Studies',
  'Fine Arts Building', 'Harvey Theatre', 'Interlochen Bowl', 'Kresge Auditorium', 'Mallory Towsley Center for Arts Leadership Great Room', 'Phoenix Theatre',
  'Upton-Morley Pavilion'];
var campDivisions = ['Any', 'Junior', 'Intermediate', 'High School', 'Institute'];
var artsAreas = ['Any', 'Comparative Arts', 'Creative Writing', 'Dance', 'MPA', 'Music', 'Theatre', 'Visual Arts'];

var selectedDate = new Rx.BehaviorSubject({date: moment().format('YYYY-MM-DD')});
// selectedDate.onNext called by click and changes state

// change to startMonth, endMonth, startYear, endYear
var calendarDates = new Rx.BehaviorSubject({
  startMonth: moment().month(),
  startYear: moment().year(),
  endMonth: moment().month(),
  endYear: moment().year()
});

var calendarFilters = new Rx.BehaviorSubject({
  showOnlyDaily: true,
  showOnlyPerformances: false
});

var venueFilters = new Rx.BehaviorSubject({
  venues: []
});

var divisionFilters = new Rx.BehaviorSubject({
  divisions: []
});

var artsAreaFilters = new Rx.BehaviorSubject({
  artsAreas: []
});

var calendarDateRange = new Rx.BehaviorSubject({
  start: null,
  end: null
});