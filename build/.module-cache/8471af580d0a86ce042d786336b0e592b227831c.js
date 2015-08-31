/**
 * Created by smithmd on 7/22/15.
 */

var NavigationDay = React.createClass({displayName: "NavigationDay",
  handleClick: function () {

  },
  render: function () {
    return (
        React.createElement("li", {className: classNames({isSelected: this.props.isSelected}), "data-day": this.props.date.format('YYYY/MM/DD')}, 
          React.createElement("span", {className: classNames('dayOfWeek')}, this.props.date.format('ddd'), " "), 
          React.createElement("span", {className: "navDate"}, this.props.date.format('MM/DD'))
        )
    );
  }
});
var Navigation = React.createClass({displayName: "Navigation",
  getInitialState: function () {
    return {date: moment()};
  },
  componentDidMount: function () {
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({date: moment(s.date)});
      React.render(React.createElement(Navigation, null), document.getElementById('navigation'));
    });
  },
  render: function () {
    var date = this.state.date;
    var dayInt = date.day();
    var days = [];
    for (var i = 0; i < 7; i++) {
      var d = date.add(i - dayInt, 'days');
      var isSelected = date.isSame(d, 'day');
      console.log(i + ": " + dayInt + " / " + (i - dayInt) + ' date: ' + d.format('MM/DD/YYYY'));
      days.push(
          React.createElement(NavigationDay, {day: i, date: d, key: 'm'+d.format('YYYY/MM/DD'), isSelected: isSelected})
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