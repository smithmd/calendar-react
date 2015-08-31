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
  render: function () {
    var eventList = this.props.events.map(function (event, index, events) {
      var last = index === (events.length-1);
      return (React.createElement(Event, {event: event, isLast: last}));
    });
    return (
        React.createElement("div", {className: classNames('day', (this.props.isCurr ? '' : 'notCurrentMonth'))}, 
          React.createElement("header", null, this.props.day), 
          eventList
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
    for (var i = 0; i < 7; i++) {
      var key = 'k' + i;
      if (this.props.week[0]) {
        day = moment(this.props.week[0].startDate).day(i);
      }
      else {
        day = null;
      }
      var events = this.props.week.filter(function (event) {
        return (i === moment(event.startDate).day());
      });
      if (day != null)
        days.push(React.createElement(EventDate, {events: events, day: day.date(), key: key, isCurr: day.month() == this.props.month}));

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
      // re-render list of events with new date
      React.render(React.createElement(EventCalendar, {url: "json/calendar.json"}), document.getElementById("Calendar"));
    });
  },
  render: function () {
    var component = this;
    // filter to only get events from currently selected month
    var events = this.state.data.filter(function (event) {
      var m = moment(event.startDate);
      return (m.month() == component.state.dates.currentMonth && m.year() == component.state.dates.currentYear );
    });
    var weeks = [];
    var start = moment([component.state.dates.currentYear, component.state.dates.currentMonth]).day(0);
    var end = start.clone().day(6);
    // create associative array for weeks of calendar
    for (var i = 0; i <= 5; i++) {
      weeks[i] = events.filter(function (event) {
        var m = moment(event.startDate);
        return (start <= m && end >= m);
      });
      // move start to beginning of next week and end to end of next week
      start.day(7);
      end.day(15);
      if (start.month() != component.state.dates.currentMonth) {
        break;
      }
    }
    var eventWeeks = weeks.map(function (week, index) {
      var key = "w" + index;
      return (
          React.createElement(EventCalendarRow, {key: key, week: week, month: component.state.dates.currentMonth})
      );
    });
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