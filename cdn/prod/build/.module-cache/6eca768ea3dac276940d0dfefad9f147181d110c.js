/**
 * Created by smithmd on 8/19/15.
 */
var DesktopEvent = React.createClass({displayName: "DesktopEvent",
  render: function () {
    var time = printStartTime(this.props.event);
    var venue = '';
    if (this.props.event.venue != null && this.props.event.venue != '') {
      venue = React.createElement("span", {className: "venue"}, "(", this.props.event.venue, ")");
    }
    return (
        React.createElement("div", {"data-start-date": this.props.event.startDate, 
             className: classNames('event',(this.props.isLast ? 'last' : ''))}, 
          React.createElement("span", {className: "time"}, time), " - ", React.createElement("span", {className: "title"}, this.props.event.title), " ", venue
        )
    );
  }
});

var DesktopDate = React.createClass({displayName: "DesktopDate",
  getInitialState: function () {
    return {printAll: this.props.printAll};
  },
  componentWillReceiveProps: function () {
    console.log(this.props);
    console.log(this.props.printAll);
    this.setState({printAll: this.props.printAll});
  },
  handleMoreClick: function () {
    this.setState({printAll: !this.state.printAll});
  },
  render: function () {
    console.log('printAll: ' + (this.state.printAll));
    var component = this;
    var remainder = null;
    var eventList = [];
    // only iterate over all events if printAll is true, otherwise, just show the first <displayLength> elements
    if (component.state.printAll === true) {
      eventList = this.props.events.map(function (event, index, events) {
        return (React.createElement(DesktopEvent, {event: event, isLast: index === (events.length - 1), key: index}));
      });
    } else {
      for (var i = 0, end = component.props.displayLength; i < end; i += 1) {
        if (this.props.events[i]) {
          eventList.push(React.createElement(DesktopEvent, {event: this.props.events[i], 
                                       isLast: i === (end - 1) || (this.props.events.length-1) === i, 
                                       key: i}));
        }
      }
    }

    // display show or hide more link
    var remaining = component.props.events.length - component.props.displayLength;
    if (component.state.printAll === false && remaining > 0) {
      remainder = React.createElement("a", {href: "javascript:void(0)", onClick: this.handleMoreClick}, "+ Show ", remaining, " More")
    } else if (remaining > 0) {
      remainder = React.createElement("a", {href: "javascript:void(0)", onClick: this.handleMoreClick}, "- Hide ", remaining)
    }
    return (
        React.createElement("div", {
            className: classNames('day', (this.props.isCurr ? null : 'notCurrentMonth'), (this.props.isToday ? 'today' : null))}, 
          React.createElement("header", null, this.props.day, 
            this.props.isToday ? React.createElement("span", {className: "today"}, "Today") : null
          ), 
          eventList, 
          remainder
        )
    );
  }
});

var DesktopCalendarHeader = React.createClass({displayName: "DesktopCalendarHeader",
  render: function () {
    // create calendar header
    var header = weekdays.map(function (day, index) {
      return (
          React.createElement("div", {key: index, className: "dayOfWeek"}, 
            day
          )
      );
    });
    return (
        React.createElement("div", {className: "calendarRow"}, 
          header
        )
    );
  }
});

var DesktopCalendarRow = React.createClass({displayName: "DesktopCalendarRow",
  getInitialState: function () {
    return {
      expandAll: false
    };
  },
  componentWillMount: function () {
    var component = this;
    expandAll.subscribe(function (s) {
      component.setState({expandAll: s});
    });
  },
  render: function () {
    console.log('expand: ' + this.state.expandAll);
    var printAll = this.state.expandAll;
    var d = null, day = null;
    var days = [];
    var today = moment().startOf('day');
    for (var i = 0; i < 7; i += 1) {
      day = this.props.startDay.day(i);
      var events = this.props.week.filter(function (event) {
        d = new Date(event.startDate);
        d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
        return (i === d.getDay());
      });

      var isCurr;
      var dispDay;
      if (this.props.range.start && this.props.range.end) {
        isCurr = (this.props.range.start <= day) && (this.props.range.end >= day);
        dispDay = (day.month() + 1) + '/' + day.date();
      } else {
        isCurr = day.month() == this.props.month;
        dispDay = day.date();
      }
      var isToday = (today.diff(day, 'days') === 0);

      console.log('parent printAll: ' + printAll);
      days[i] = (React.createElement(DesktopDate, {events: events, displayLength: 3, day: dispDay, key: 'd'+i, 
                              isCurr: isCurr, isToday: isToday, printAll: printAll}));

    }
    return (
        React.createElement("div", {className: "calendarRow"}, 
          days
        )
    );
  }
});

var DesktopCalendar = React.createClass({displayName: "DesktopCalendar",
  filterWeek: function (beginningDay, end) {
    return function (event) {
      var d = new Date(event.startDate);
      d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
      return (beginningDay <= d && end >= d);
    }
  },
  render: function () {
    var beginningDay = this.props.beginningDay;

    var eventWeeks = [];
    var maxWeeks = this.props.endingDay.diff(beginningDay, 'weeks') + 1;

    var end = beginningDay.clone();
    end.day(6);
    // create associative array for weeks of calendar
    for (var i = 0; i < maxWeeks; i += 1) {
      var week = this.props.events.filter(this.filterWeek(beginningDay, end));
      eventWeeks[i] = (React.createElement(DesktopCalendarRow, {key: "w"+i, startDay: beginningDay, week: week, 
                                           month: this.props.dates.startMonth, 
                                           range: this.props.dateRange}));

      // move start to beginning of next week and end to end of next week
      beginningDay = beginningDay.clone().day(7);
      end = end.clone().day(13);
      if (this.props.dateRange && !this.props.dateRange.end) {
        if (beginningDay.month() != this.props.dates.startMonth) {
          break;
        }
      }
    }
    return (
        React.createElement("div", null, 
          React.createElement(DesktopCalendarHeader, null), 
          eventWeeks
        )
    );
  }
});
