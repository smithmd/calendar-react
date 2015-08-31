/**
 * Created by smithmd on 7/22/15.
 */

var NavigationDay = React.createClass({displayName: "NavigationDay",
  render: function () {
    return (
        React.createElement("li", {day: this.props.date.format('YYYY/MM/DD')}, 
          React.createElement("span", {className: "dayOfWeek"}, this.props.date.format('ddd')), 
          React.createElement("span", {className: "navDate"}, this.props.date.format('MM/DD'))
        )
    );
  }
});
var Navigation = React.createClass({displayName: "Navigation",
  render: function () {
    var today = moment();
    var todayInt = today.day();
    var days = [];
    for (var i = 0; i < 7; i++) {
      var delta = i - todayInt;
      var d = moment().day(delta);
      days.push(
          React.createElement(NavigationDay, {day: i, date: d, key: 'm'+d.format('YYYY/MM/DD')})
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