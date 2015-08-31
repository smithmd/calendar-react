var Event = React.class({
  render: function () {
    return (
        React.createElement("span", null
        )
    );
  }
});

var EventList = React.class({
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