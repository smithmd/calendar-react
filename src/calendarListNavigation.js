/**
 * Created by smithmd on 7/22/15.
 */

var NavigationDay = React.createClass({
  handleClick: function () {

  },
  render: function () {
    return (
        <li className={classNames({isSelected: this.props.isSelected})} data-day={this.props.date.format('YYYY/MM/DD')}>
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
      console.log(i + ": " + dayInt + " / " + (i - dayInt) + ' date: ' + d.format('MM/DD/YYYY'));
      days.push(
          <NavigationDay day={i} date={d} key={'m'+d.format('YYYY/MM/DD')} isSelected={isSelected}/>
      );
    }
    return (
        <ul>
          {days}
          <li className="navPaging">
            <span id="prev">&lsaquo;</span>
            <span id="next">&rsaquo;</span>
          </li>
        </ul>
    );
  }
});

React.render(
    <Navigation />,
    document.getElementById('navigation')
);