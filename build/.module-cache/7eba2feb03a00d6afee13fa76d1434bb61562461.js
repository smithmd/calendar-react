/**
 * Created by smithmd on 7/22/15.
 */

var NavigationDay = React.createClass({displayName: "NavigationDay",
  render: function () {
    return (
        React.createElement("li", null
        )
    );
  }
});
var Navigation = React.createClass({displayName: "Navigation",
  render: function () {
    var today = new Date();
    var todayInt = today.getDay();

  }
});

React.render(
    React.createElement(Navigation, null),
    document.getElementById('navigation')
);