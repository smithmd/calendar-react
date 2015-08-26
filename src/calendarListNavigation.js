/**
 * Created by smithmd on 7/22/15.
 */

var NavigationPaging = React.createClass({
  handleClick: function (date, toPrev) {

    var m = moment(date);
    var newDate = m.clone();
    if (toPrev) {
      if (this.props.pageDays === 7) {
        newDate.subtract(m.day() + 7, 'days');
      } else {
        newDate.subtract(this.props.pageDays, 'days');
      }
    } else {
      if (this.props.pageDays === 7) {
        newDate.add(7 - m.day(), 'days');
      } else {
        newDate.add(this.props.pageDays, 'days');
      }
    }
    console.log("o: " + m.format('YYYY-MM-DD') + " n:" + newDate.format('YYYY-MM-DD'));
    selectedDate.onNext({date: newDate.format('YYYY-MM-DD')});
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
    selectedDate.onNext({date: date.format('YYYY-MM-DD')});
  },
  render: function () {
    var boundClick = this.handleClick.bind(this, this.props.date);
    return (
        <li className={classNames({isSelected: this.props.isSelected})} data-day={this.props.date.format('YYYY/MM/DD')}
            onClick={boundClick}>
          <span className={classNames('dayOfWeek')}>{this.props.date.format('ddd')}&nbsp;</span>
          <span className='navDate'>{this.props.date.format('MM/DD')}</span>
        </li>
    );
  }
});
var Navigation = React.createClass({
  getInitialState: function () {
    return {
      date: moment(),
      originalDate: moment(),
      windowWidth: window.innerWidth
    };
  },
  handleResize: function () {
    this.setState({windowWidth: window.innerWidth});
  },
  componentDidMount: function () {
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({date: moment(s.date)});
    });
    // debounce prevents the function from running every 20ms, instead run 100ms after last resize event
    window.addEventListener('resize', debounce(this.handleResize, 100));
  },
  componentWillUnmount: function () {
    // debounce prevents the function from running every 20ms, instead run 100ms after last resize event
    window.removeEventListener('resize', debounce);
  },
  render: function () {
    var date = this.state.date;
    var dayInt = date.day();
    var days = [];
    var pageDays = 7;
    if (this.state.windowWidth < 801) {
      pageDays = 3;
    }
    console.log('date: ' + date.format('YYYY-MM-DD') + ' | orig: ' + this.state.originalDate.format('YYYY-MM-DD'));
    for (var i = 0; i < pageDays; i++) {
      var d;
      if (pageDays === 7) {
        d = date.clone().add(i - dayInt, 'days');
      } else {
        var diffDays = date.startOf('day').diff(this.state.originalDate.startOf('day'), 'days');
        console.log('i: ' + i + ' | diffDays: ' + diffDays + ' | pageDays: ' + pageDays);
        if (diffDays >= 0) {
          console.log('d%p: ' + (diffDays % pageDays) + ' | i-d%p: ' + (i - (diffDays % pageDays)));
          d = date.clone().add(i - (diffDays % pageDays), 'days');
        } else {
          console.log('d%p: ' + (diffDays % pageDays) + ' | i-d%p: ' + (i + (diffDays % pageDays)));
          d = date.clone().add(i - mod(diffDays,pageDays), 'days');
        }
      }
      var isSelected = date.isSame(d, 'day');
      days.push(
          <NavigationDay day={i} date={d} key={'m'+d.format('YYYY/MM/DD')} isSelected={isSelected}/>
      );
    }
    return (
        <ul>
          {days}
          <NavigationPaging pageDays={pageDays} date={this.state.date}/>
        </ul>
    );
  }
});

React.render(
    <Navigation />,
    document.getElementById('navigation')
);