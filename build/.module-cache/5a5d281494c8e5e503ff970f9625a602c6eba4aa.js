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
        React.createElement("div", null, 
          React.createElement("header", null, "N")
        )
    );
  }
});


React.render(
    React.createElement(EventDate, null),
    document.getElementById("Calendar")
);