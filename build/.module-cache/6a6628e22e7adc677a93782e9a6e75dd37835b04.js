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
    var eventList = this.props.events.map(function (event, index, events) {
      var last = false;
      if (component.state.printAll === true) {
        last = index === (events.length - 1);
        return (React.createElement(Event, {event: event, isLast: last, key: index}));
      } else if (index < component.props.displayLength) {
        last = index === (component.props.displayLength - 1) || index === (events.length - 1);
        return (React.createElement(Event, {event: event, isLast: last, key: index}));
      }
    });
    if (component.state.printAll === false && remaining > 0) {
      remainder = React.createElement("a", {href: "javascript:void(0)", onClick: this.handleMoreClick}, "+ Show ", remaining, " More")
    } else if (remaining > 0) {
      remainder = React.createElement("a", {href: "javascript:void(0)", onClick: this.handleMoreClick}, "- Hide ", remaining)
    }

    return (
        React.createElement("div", {className: classNames('day', (this.props.isCurr ? null : 'notCurrentMonth'), (this.props.isToday ? 'today' : null))}, 
          React.createElement("header", null, this.props.day), 
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
    for (var i = 0; i < 7; i++) {
      var key = 'k' + i;
      if (this.props.week[0]) {
        day = moment(this.props.week[0].startDate).day(i);
      }
      else {
        day = moment(this.props.finalWeek).day(i);
      }
      var events = this.props.week.filter(function (event) {
        return (i === moment(event.startDate).day());
      });
      if (day != null) {
        var isToday = (moment().diff(day, 'days') === 0);
        if (isToday) {
          console.log(day);
          console.log(moment);
        }
        days.push(React.createElement(EventDate, {events: events, displayLength: 3, day: day.date(), key: key, 
                             isCurr: day.month() == this.props.month, 
                             isToday: isToday, 
                             printAll: false}));
      }

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
        start.day(-7);
        break;
      }
    }
    var eventWeeks = weeks.map(function (week, index) {
      var key = "w" + index;
      return (
          React.createElement(EventCalendarRow, {key: key, week: week, finalWeek: start, month: component.state.dates.currentMonth})
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