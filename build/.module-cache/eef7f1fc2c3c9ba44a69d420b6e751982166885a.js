/**
 * Created by smithmd on 8/19/15.
 */


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
                              isToday: isToday, 
                              printAll: false}));

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
