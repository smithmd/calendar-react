// function to sort events based on dates
var dateSort = function (a, b) {
  return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
};

var printDate = function (d) {
  d = new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
  return weekdays[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear();
};

var formatTime = function (d) {
  var meridiem = "am";
  var h = d.getHours();
  if (h > 12) {
    h = h - 12;
    meridiem = "pm";
  }
  if (h == 12) {
    meridiem = "pm";
  }
  var m = d.getMinutes();
  if (m < 10) {
    m = "0" + m;
  }
  return h + ':' + m + meridiem;
};

var printTime = function (event) {
  return (event.allDay === false ? formatTime(new Date(event.startTime)) + '-' + formatTime(new Date(event.endTime)) : 'All Day');
};

var printStartTime = function (event) {
  return (event.allDay === false ? formatTime(new Date(event.startTime)) : 'All Day');
};

var printVenue = function (venue) {
  return (venue !== null ? venue : '');
};

/* INFO: http://davidwalsh.name/javascript-debounce-function */
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}