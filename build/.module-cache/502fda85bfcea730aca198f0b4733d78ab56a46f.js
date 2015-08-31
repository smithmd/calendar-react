/**
 * Created by smithmd on 7/22/15.
 */

var NavigationDay = React.createClass({displayName: "NavigationDay",
  render: function () {
    return (
        React.createElement("li", {day: this.props.day}, 
          this.props.day.format('ddd MM/DD')
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
      var tmp = moment().day(delta);
      var d = tmp.setDate(today.getDate()+delta);
      console.log(d);
      days.push(
          React.createElement(NavigationDay, {day: i, date: d})
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