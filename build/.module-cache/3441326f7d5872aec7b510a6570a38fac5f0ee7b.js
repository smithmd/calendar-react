/**
 * Created by smithmd on 7/22/15.
 */

var NavigationDay = React.createClass({displayName: "NavigationDay",
  render: function () {
    return (
        React.createElement("li", {day: this.props.day}, 
          weekdays[this.props.day].substring(0, 3), " ", this.props.date
        )
    );
  }
});
var Navigation = React.createClass({displayName: "Navigation",
  render: function () {
    var today = new Date();
    var todayInt = today.getDay();
    var days = [7];
    for (var i = 0; i < 7; i++) {
      days.push(
          React.createElement(NavigationDay, null)
      );
    }
    return (
        React.createElement("ul", null, 
          days
        )
    );
  }
});

React.render(
    React.createElement(Navigation, null),
    document.getElementById('navigation')
);