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
    return (
        React.createElement("div", null, 
          React.createElement(EventDate, null)
        )
    );
  }
});

React.render(
    React.createElement(EventCalendar, null),
    document.getElementById("Calendar")
);