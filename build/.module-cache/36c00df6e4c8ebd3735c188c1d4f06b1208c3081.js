/**
 * Created by smithmd on 7/22/15.
 */

var NavigationPaging = React.createClass({displayName: "NavigationPaging",
  handleClick: function (date,toPrev) {

    var m = moment(date);
    var newDate = m.clone();
    if (toPrev) {
      newDate.subtract(m.day() + 7, 'days');
    } else {
      newDate.add(7 - m.day(),'days');
    }
    console.log("o: " + m.format('YYYY-MM-DD') + " n:" + newDate.format('YYYY-MM-DD'));
    selectedDate.onNext({date:newDate.format('YYYY-MM-DD')});
  },
  render: function () {
    return (
        React.createElement("li", {className: "navPaging"}, 
          React.createElement("span", {id: "prev", onClick: this.handleClick.bind(this,this.props.date,true)}, "‹"), 
          React.createElement("span", {id: "next", onClick: this.handleClick.bind(this,this.props.date,false)}, "›")
        )
    );
  }
});
var NavigationDay = React.createClass({displayName: "NavigationDay",
  handleClick: function (date) {
    selectedDate.onNext({date:date.format('YYYY-MM-DD')});
  },
  render: function () {
    var boundClick = this.handleClick.bind(this,this.props.date);
    return (
        React.createElement("li", {className: classNames({isSelected: this.props.isSelected}), "data-day": this.props.date.format('YYYY/MM/DD'), onClick: boundClick}, 
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
      var d = date.clone().add(i - dayInt, 'days');
      var isSelected = date.isSame(d, 'day');
      days.push(
          React.createElement(NavigationDay, {day: i, date: d, key: 'm'+d.format('YYYY/MM/DD'), isSelected: isSelected})
      );
    }
    return (
        React.createElement("ul", null, 
          days, 
          React.createElement(NavigationPaging, {date: this.state.date})
        )
    );
  }
});

React.render(
    React.createElement(Navigation, null),
    document.getElementById('navigation')
);