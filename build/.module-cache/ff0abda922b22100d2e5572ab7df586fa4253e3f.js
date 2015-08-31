/**
 * Created by smithmd on 7/22/15.
 */

var NavigationDay = React.createClass({displayName: "NavigationDay",
  render: function () {
    var date = new Date(this.props.date);
    return (
        React.createElement("li", {day: this.props.day}, 
          weekdays[this.props.day].substring(0, 3), " ", date
        )
    );
  }
});
var Navigation = React.createClass({displayName: "Navigation",
  render: function () {
    var today = new Date();
    var todayInt = today.getDay();
    var days = [];
    for (var i = 0; i < 7; i++) {
      var d = i - todayInt;
      days.push(
          React.createElement(NavigationDay, {day: i, date: today.getDate()+d})
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