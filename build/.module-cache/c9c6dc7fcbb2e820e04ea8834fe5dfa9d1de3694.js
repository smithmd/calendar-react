/**
 * Created by smithmd on 7/22/15.
 */

var NavigationDay = React.createClass({displayName: "NavigationDay",
  handleClick: function () {

  },
  render: function () {
    return (
        React.createElement("li", {className: classNames({isToday: this.props.isToday}), "data-day": this.props.date.format('YYYY/MM/DD')}, 
          React.createElement("span", {className: classNames('dayOfWeek')}, this.props.date.format('ddd'), " "), 
          React.createElement("span", {className: "navDate"}, this.props.date.format('MM/DD'))
        )
    );
  }
});
var Navigation = React.createClass({displayName: "Navigation",
  componentDidMount: function () {
    selectedDate.subscribe();
  },
  render: function () {
    var today = moment();
    var todayInt = today.day();
    var days = [];
    for (var i = 0; i < 7; i++) {
      var delta = i - todayInt;
      var d = moment().add(delta, 'days');
      console.log('delta: ' + delta);
      console.log("moment " + today.format('ddd YYYY/MM/DD'));
      console.log("day " + d.format('ddd YYYY/MM/DD'));
      var isToday = today.isSame(d, 'day');
      days.push(
          React.createElement(NavigationDay, {day: i, date: d, key: 'm'+d.format('YYYY/MM/DD'), isToday: isToday})
      );
    }
    return (
        React.createElement("ul", null, 
          days, 
          React.createElement("li", {className: "navPaging"}, 
            React.createElement("span", {id: "prev"}, "‹"), 
            React.createElement("span", {id: "next"}, "›")
          )
        )
    );
  }
});

React.render(
    React.createElement(Navigation, null),
    document.getElementById('navigation')
);