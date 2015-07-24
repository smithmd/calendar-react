/**
 * Created by smithmd on 7/22/15.
 */

var NavigationPaging = React.createClass({
  handleClick: function (date,toPrev) {

    var m = moment(date);
    var newDate = m.clone();
    if (toPrev) {
      newDate.subtract(m.day()+ 7, 'days');
    } else {
      newDate.add(7 - m.day(),'days');
    }
    console.log("o: " + m.format('YYYY-MM-DD') + " n:" + newDate.format('YYYY-MM-DD'));
    selectedDate.onNext({date:newDate.format('YYYY-MM-DD')});
  },
  render: function () {
    return (
        <li className="navPaging">
          <span id="prev" onClick={this.handleClick.bind(this,this.props.date,true)}>&lsaquo;</span>
          <span id="next" onClick={this.handleClick.bind(this,this.props.date,false)}>&rsaquo;</span>
        </li>
    );
  }
});
var NavigationDay = React.createClass({
  handleClick: function (date) {
    selectedDate.onNext({date:date.format('YYYY-MM-DD')});
  },
  render: function () {
    var boundClick = this.handleClick.bind(this,this.props.date);
    return (
        <li className={classNames({isSelected: this.props.isSelected})} data-day={this.props.date.format('YYYY/MM/DD')} onClick={boundClick} >
          <span className={classNames('dayOfWeek')}>{this.props.date.format('ddd')}&nbsp;</span>
          <span className='navDate'>{this.props.date.format('MM/DD')}</span>
        </li>
    );
  }
});
var Navigation = React.createClass({
  getInitialState: function () {
    return {date: moment()};
  },
  componentDidMount: function () {
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({date: moment(s.date)});
      React.render(<Navigation />, document.getElementById('navigation'));
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
          <NavigationDay day={i} date={d} key={'m'+d.format('YYYY/MM/DD')} isSelected={isSelected} />
      );
    }
    return (
        <ul>
          {days}
          <NavigationPaging date={this.state.date} />
        </ul>
    );
  }
});

React.render(
    <Navigation />,
    document.getElementById('navigation')
);