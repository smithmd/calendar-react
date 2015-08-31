/**
 * Created by smithmd on 8/19/15.
 */
var MobileDate = React.createClass({displayName: "MobileDate",
  handleClick: function () {
    selectedDate.onNext({date: this.props.moment.format('YYYY-MM-DD')});
  },
  render: function () {
    var dot = (this.props.displayDot ? React.createElement("div", {className: "indicator"}) : React.createElement("div", null));
    var selectedClass = (this.props.isSelected ? ' selected' : '');
    var currentMonthClass = (this.props.isCurr ? '' : ' notCurrentMonth');
    if (this.props.isSelected) {
      console.log(this.props.day);
      console.log(selectedClass);
    }
    var classes = 'day' + selectedClass + currentMonthClass;
    return (
        React.createElement("div", {
            className: classes, 
            onClick: this.handleClick}, 
          React.createElement("header", null, this.props.day), 
          dot
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
  getInitialState: function () {
    return {selected: moment().format('YYYY-MM-DD')};
  },
  componentDidMount: function () {
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({selected: s.date});
    });
  },
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
      var isSelected = false;
      if (this.state.selected) {
        isSelected = this.state.selected === day.format('YYYY-MM-DD');
        //console.log(this.state.selected);
      }
      (isSelected ? console.log('s:' + day.format('YYYY-MM-DD')) : null);

      // display or show dot for events
      var displayDot = (events.length > 0);
      days[i] = (React.createElement(MobileDate, {displayDot: displayDot, day: dispDay, key: 'd'+i, 
                             isToday: isToday, isCurr: isCurr, isSelected: isSelected, 
                             moment: day.clone()}));
    }
    return (
        React.createElement("div", {className: "calendarRow"}, 
          days
        )
    );
  }
});

var MobileEvents = React.createClass({displayName: "MobileEvents",
  getInitialState: function () {
    return {selected: moment().format('YYYY-MM-DD')};
  },
  componentDidMount: function () {
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({selected: s.date});
    });
  },
  render: function () {
    var component = this;
    var events = this.props.events.filter(function (event) {
      return event.startDate === component.state.selected;
    });

    var list = events.map(function (event) {
      var time = printStartTime(event);
      var venue = printVenue(event.venue);
      return (
          React.createElement("div", null, 
            React.createElement("span", {className: "time"}, time), 
            React.createElement("span", {className: "title"}, event.title), 
            React.createElement("span", null, "(", venue, ")")
          )
      );
    });
    return (
        React.createElement("div", null, 
          list
        )
    );
  }
});

var MobileCalendar = React.createClass({displayName: "MobileCalendar",
  filterWeek: function (beginningDay, end) {
    return function (event) {
      var d = new Date(event.startDate);
      d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
      return (beginningDay <= d && end >= d);
    }
  },
  render: function () {
    // display calendar
    // display list, defaulted to today
    var beginningDay = this.props.beginningDay;

    var eventWeeks = [];
    var maxWeeks = this.props.endingDay.diff(beginningDay, 'weeks') + 1;

    var end = beginningDay.clone();
    end.day(6);
    // create associative array for weeks of calendar
    for (var i = 0; i < maxWeeks; i += 1) {
      var week = this.props.events.filter(this.filterWeek(beginningDay, end));
      eventWeeks[i] = (React.createElement(MobileCalendarRow, {key: "w"+i, startDay: beginningDay, week: week, 
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
          React.createElement("div", {id: "calendarHolder"}, 
            React.createElement(MobileCalendarHeader, null), 
            eventWeeks
          ), 
          React.createElement("div", null, 
            React.createElement(MobileEvents, {events: this.props.events})
          )
        )
    );
  }
});
