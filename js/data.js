/**
 * Created by smithmd on 7/22/15.
 */

var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var venues = ['Corson Auditorium', 'Kresge Auditorium', 'DeRoy Center for Film Studies', 'Dendrinos Chapel and Recital Hall',
  'Fine Arts Building', 'Harvey Theatre', 'Phoenix Theatre', 'Mallory Towsley Center for Arts Leadership Great Room',
  'Upton-Morley Pavilion', 'Interlochen Bowl'];
var campDivisions = ['Institute', 'High School', 'Intermediate', 'Junior'];
var artsAreas = ['Visual Arts', 'Theatre', 'Music', 'MPA', 'Dance', 'Creative Writing', 'Comparative Arts'];

var selectedDate = new Rx.BehaviorSubject({date: moment().format('YYYY-MM-DD')});
// selectedDate.onNext called by click and changes state

var calendarDates = new Rx.BehaviorSubject({
  currentMonth: moment().month(),
  currentYear: moment().year(),
  startDate: null,
  endDate: null
});

var calendarFilters = new Rx.BehaviorSubject({
  showOnlyDaily: true,
  showOnlyPerformances: false
});