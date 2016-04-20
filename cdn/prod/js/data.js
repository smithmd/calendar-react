/**
 * Created by smithmd on 7/22/15.
 */

var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var venues = ['Any', 'Corson Auditorium', 'Dendrinos Chapel and Recital Hall', 'DeRoy Center for Film Studies',
  'Fine Arts Building', 'Harvey Theatre', 'Interlochen Bowl', 'Kresge Auditorium', 'Mallory Towsley Center for Arts Leadership Great Room',
  'Phoenix Theatre', 'Upton-Morley Pavilion'];
var campDivisions = ['Any', 'Junior', 'Intermediate', 'High School', 'Institute'];
var eventTypes = ['Any', 'Academic Info', 'Comparative Arts', 'Creative Writing', 'Dance',
  'Motion Picture Arts / Film', 'Music', 'Student Life', 'Theatre', 'Visual Arts'];

var selectedDate = new Rx.BehaviorSubject({date: moment().format('YYYY-MM-DD')});
// selectedDate.onNext called by click and changes state

// change to startMonth, endMonth, startYear, endYear
var calendarDates = new Rx.BehaviorSubject({
  startMonth: moment().month(),
  startYear: moment().year(),
  endMonth: moment().month(),
  endYear: moment().year()
});

var dailyFilter = new Rx.BehaviorSubject(false);

var performanceFilter = new Rx.BehaviorSubject(false);

var expandAll = new Rx.BehaviorSubject(false);

var venueFilters = new Rx.BehaviorSubject({
  venues: [],
  venuesIndex: []
});

var divisionFilters = new Rx.BehaviorSubject({
  divisions: [],
  divisionsIndex: []
});

var eventTypesFilters = new Rx.BehaviorSubject({
  eventTypes: [],
  eventTypesIndex: []
});

var calendarDateRange = new Rx.BehaviorSubject({
  start: null,
  end: null
});

var searchFilter = new Rx.BehaviorSubject({
  searchString: ''
});