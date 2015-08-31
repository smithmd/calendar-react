var Event = React.createClass({displayName: "Event",
  render: function () {
    return (
        React.createElement("span", null
        )
    );
  }
});

var EventList = React.createClass({displayName: "EventList",
  render: function () {
    return (
        React.createElement("div", null
        )
    );
  }
});

var EventDate = React.createClass({displayName: "EventDate",
  render: function () {
    return (
        React.createElement("div", {className: "day"}, 
          React.createElement("header", null, "N")
        )
    );
  }
});

var EventCalendarRow = React.createClass({displayName: "EventCalendarRow",
  render:function () {

  }
});

var EventCalendar = React.createClass({displayName: "EventCalendar",
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

React.render(
    React.createElement(EventCalendar, null),
    document.getElementById("Calendar")
);