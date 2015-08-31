var Event = React.createClass({displayName: "Event",
  render: function () {
    var time = formatTime(new Date(this.props.event.startTime));
    var venue = '';
    if (this.props.event.venue != null && this.props.event.venue != '') {
      venue = React.createElement("span", {className: "venue"}, "(", this.props.event.venue, ")");
    }
    return (
        React.createElement("div", {className: classNames('event',(this.props.isLast ? 'last' : ''))}, 
          React.createElement("span", {className: "time"}, time), " - ", React.createElement("span", {className: "title"}, this.props.event.title), " ", venue
        )
    );
  }
});

var EventDate = React.createClass({displayName: "EventDate",
  getInitialState: function () {
    return {printAll: this.props.printAll};
  },
  handleMoreClick: function () {
    console.log('attempting to re-render: click');
    this.setState({printAll: !this.state.printAll});
  },
  render: function () {
    var component = this;
    var remaining = component.props.events.length - component.props.displayLength;
    var remainder = null;
    var eventList = [];
    if (component.state.printAll === true) {
      eventList = this.props.events.map(function (event, index, events) {
        return (React.createElement(Event, {event: event, isLast: index === (events.length - 1), key: index}));
      });
    } else {
      for (var i = 0; i < 3; i+=1) {
        if (this.props.events[i]) {
          eventList.push(React.createElement(Event, {event: this.props.events[i], 
                                isLast: i === (component.props.displayLength - 1) || events.length === i, 
                                key: i}));
        }
      }
    }
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

var EventCalendarHeader = React.createClass({displayName: "EventCalendarHeader",
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

var EventCalendarRow = React.createClass({displayName: "EventCalendarRow",
  render: function () {
    var day = null;
    var days = [];
    for (var i = 0; i < 7; ) {
      var key = 'k' + i;
      if (this.props.week[0]) {
        day = moment(this.props.week[0].startDate,'YYYY-MM-DD').day(i);
      }
      else {
        day = this.props.startDay.day(i);
      }
      var events = this.props.week.filter(function (event) {
        return (i === moment(event.startDate,'YYYY-MM-DD').day());
      });
      if (day != null) {
        var isToday = (moment().startOf('day').diff(day, 'days') === 0);
        days[i] = (React.createElement(EventDate, {events: events, displayLength: 3, day: day.date(), key: key, 
                             isCurr: day.month() == this.props.month, 
                             isToday: isToday, 
                             printAll: false}));
      }
      i+=1;
    }
    return (
        React.createElement("div", {className: "calendarRow"}, 
          days
        )
    );
  }
});

var EventCalendar = React.createClass({displayName: "EventCalendar",
  loadEvents: function () {
    var calendar = this;
    marmottajax({
      url: calendar.props.url,
      json: true
    }).then(function (result) {
      calendar.setState({data: result.sort(dateSort)});
    }).error(function (err) {
      console.error("Something went wrong", err);
    });
  },
  getInitialState: function () {
    return {data: [], dates: {}};
  },
  componentDidMount: function () {
    this.loadEvents();
    var component = this;
    calendarDates.subscribe(function (s) {
      component.setState({dates: s});
    });
  },
  render: function () {
    var component = this;
    // filter to only get events from currently selected month and surrounding days
    var beginningDay = moment([component.state.dates.currentYear, component.state.dates.currentMonth]).day(0);
    // moments are bound to last day of month, so we can assume the 31st will always get us the last day
    var endingDay = moment([component.state.dates.currentYear, component.state.dates.currentMonth, 31]).day(6);

    var events = this.state.data.filter(function (event) {
      var m = moment(event.startDate, 'YYYY-MM-DD');
      return (m >= beginningDay && m <= endingDay);
    });

    var eventWeeks = [];

    var end = beginningDay.clone().day(6);
    // create associative array for weeks of calendar
    for (var i = 0; i <= 5; i+=1) {
      var week = events.filter(function (event) {
        var m = moment(event.startDate, 'YYYY-MM-DD');
        return (beginningDay <= m && end >= m);
      });
      eventWeeks[i] = React.createElement(EventCalendarRow, {key: "w"+i, startDay: beginningDay, week: week, 
                                        month: component.state.dates.currentMonth});

      // move start to beginning of next week and end to end of next week
      beginningDay.day(7);
      end.day(15);
      if (beginningDay.month() != this.state.dates.currentMonth) {
        break;
      }
    }
    return (
        React.createElement("div", null, 
          React.createElement(EventCalendarHeader, null), 
          eventWeeks
        )
    );
  }
});

React.render(
    React.createElement(EventCalendar, {url: "json/calendar.json"}),
    document.getElementById("Calendar")
);