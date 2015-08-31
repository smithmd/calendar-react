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

var EventCalendar = React.createClass({displayName: "EventCalendar",
  render: function () {
    // create calendar header
    var header = weekdays.map(function (day, index) {
      return (
          React.createElement("div", {className: "dayOfWeek"}, 
            day
          )
      );
    });
    return (
      {header}
    );
  }
});

React.render(
    React.createElement(EventCalendar, null),
    document.getElementById("Calendar")
);