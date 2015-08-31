/**
 * Created by smithmd on 8/19/15.
 */
var MobileDate = React.createClass({displayName: "MobileDate",
  handleClick: function () {
    console.log('clicked: ' + this.props.moment.format('YYYY-MM-DD'));
    selectedDate.onNext({selected: this.props.moment.format('YYYY-MM-DD')});
  },
  render: function () {
    var dot = (this.props.displayDot ? React.createElement("div", {id: "indicator"}) : React.createElement("div", {id: "no-indicator"}));
    console.log(this.props.moment.format('YYYY-MM-DD'));
    return (
        React.createElement("div", {
            className: classNames('day',
                (this.props.isCurr ? null : 'notCurrentMonth'),
                (this.props.isSelected ? 'selected' : null)), 
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
  componentWillMount: function () {
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({selected: s.selected});
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
      var isSelected = this.state.selected == day.format('YYYY-MM-DD');
      console.log(day.format('YYYY-MM-DD'));
      console.log(this.state.selected);
      // display or show dot for events
      var displayDot = (events.length > 0);
      days[i] = (React.createElement(MobileDate, {displayDot: displayDot, day: dispDay, key: 'd'+i, 
                             isToday: isToday, isCurr: isCurr, isSelected: isSelected, 
                             moment: day}));
    }
    return (
        React.createElement("div", {className: "calendarRow"}, 
          days
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
          React.createElement(MobileCalendarHeader, null), 
          eventWeeks
        )
    );
  }
});
