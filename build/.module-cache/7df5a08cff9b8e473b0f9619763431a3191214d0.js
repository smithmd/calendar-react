/**
 * Created by smithmd on 8/19/15.
 */
var MobileDate = React.createClass({displayName: "MobileDate",
  getInitialState: function () {
    return {printAll: this.props.printAll};
  },
  componentWillReceiveProps: function () {
    this.setState({printAll: this.props.printAll});
  },
  render: function () {
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
          eventList.push(React.createElement(MobileEvent, {event: this.props.events[i], 
                                      isLast: i === (end - 1) || (this.props.events.length-1) === i, 
                                      key: i}));
        }
      }
    }
    // display or show dot for events
    return (
        React.createElement("div", {
            className: classNames('day', (this.props.isCurr ? null : 'notCurrentMonth'), (this.props.isToday ? 'today' : null))}, 
          React.createElement("header", null, this.props.day), 
          eventList, 
          remainder
        )
    );
  }
});
var MobileCalendarHeader = React.createClass({displayName: "MobileCalendarHeader",
  render: function () {
    // create calendar header
    var header = weekdays.map(function (day, index) {
      return (
          React.createElement("div", {key: index, className: "dayOfWeek"}, 
            day.substr(0, 2)
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

var MobileCalendarRow = React.createClass({displayName: "MobileCalendarRow",
  render: function () {
    var d = null;
    var day = null;
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
      days[i] = (React.createElement(MobileDate, {events: events, displayLength: 3, day: dispDay, key: 'd'+i, 
                             isCurr: isCurr, 
                             isToday: isToday}));

    }
    return (
        React.createElement("div", {className: "calendarRow"}, 
          days
        )
    );
  }
});

var MobileCalendar = React.createClass({displayName: "MobileCalendar",
  render: function () {
    // display calendar
    // display list, defaulted to today
    return (
        React.createElement("div", null, 
          React.createElement(MobileCalendarHeader, null)
        )
    );
  }
});
