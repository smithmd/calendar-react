/**
 * Created by smithmd on 8/19/15.
 */
var DesktopEvent = React.createClass({
  render: function () {
    var time = printStartTime(this.props.event);
    var venue = '';
    if (this.props.event.venue != null && this.props.event.venue != '') {
      venue = <span className='venue'>({this.props.event.venue})</span>;
    }
    return (
        <div data-start-date={this.props.event.startDate}
             className={classNames('event',(this.props.isLast ? 'last' : ''))}>
          <span className='time'>{time}</span> - <span className='title'>{this.props.event.title}</span> {venue}
        </div>
    );
  }
});

var DesktopDate = React.createClass({
  getInitialState: function () {
    return {printAll: this.props.printAll};
  },
  componentWillReceiveProps: function () {
    this.setState({printAll: this.props.printAll});
  },
  handleMoreClick: function () {
    this.setState({printAll: !this.state.printAll});
  },
  render: function () {
    var component = this;
    var remainder = null;
    var eventList = [];
    // only iterate over all events if printAll is true, otherwise, just show the first <displayLength> elements
    if (component.state.printAll === true) {
      eventList = this.props.events.map(function (event, index, events) {
        return (<DesktopEvent event={event} isLast={index === (events.length - 1)} key={index}/>);
      });
    } else {
      for (var i = 0, end = component.props.displayLength; i < end; i += 1) {
        if (this.props.events[i]) {
          eventList.push(<DesktopEvent event={this.props.events[i]}
                                isLast={i === (end - 1) || (this.props.events.length-1) === i}
                                key={i}/>);
        }
      }
    }

    // display show or hide more link
    var remaining = component.props.events.length - component.props.displayLength;
    if (component.state.printAll === false && remaining > 0) {
      remainder = <a href="javascript:void(0)" onClick={this.handleMoreClick}>+ Show {remaining} More</a>
    } else if (remaining > 0) {
      remainder = <a href="javascript:void(0)" onClick={this.handleMoreClick}>- Hide {remaining}</a>
    }
    return (
        <div
            className={classNames('day', (this.props.isCurr ? null : 'notCurrentMonth'), (this.props.isToday ? 'today' : null))}>
          <header>{this.props.day}
            {this.props.isToday ? <span className='today'>Today</span> : null}
          </header>
          {eventList}
          {remainder}
        </div>
    );
  }
});

var DesktopCalendarHeader = React.createClass({
  render: function () {
    // create calendar header
    var header = weekdays.map(function (day, index) {
      return (
          <div key={index} className="dayOfWeek">
            {day}
          </div>
      );
    });
    return (
        <div className="calendarRow">
          {header}
        </div>
    );
  }
});

var DesktopCalendarRow = React.createClass({
  render: function () {
    var d = null;
    var day = null;
    var days = [];
    var today = moment().startOf('day');
    for (var i = 0; i < 7; i += 1) {
      day = this.props.startDay.day(i);
      var events = this.props.week.filter(function (event) {
        d = new Date(event.startDate);
        d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
        return (i === d.getDay());
      });

      var isCurr;
      var dispDay;
      if (this.props.range.start && this.props.range.end) {
        isCurr = (this.props.range.start <= day) && (this.props.range.end >= day);
        dispDay = (day.month() + 1) + '/' + day.date();
      } else {
        isCurr = day.month() == this.props.month;
        dispDay = day.date();
      }
      var isToday = (today.diff(day, 'days') === 0);
      days[i] = (<DesktopDate events={events} displayLength={3} day={dispDay} key={'d'+i}
                              isCurr={isCurr}
                              isToday={isToday}
                              printAll={false}/>);

    }
    return (
        <div className="calendarRow">
          {days}
        </div>
    );
  }
});

var DesktopCalendar = React.createClass({
  filterWeek: function (beginningDay, end) {
    return function (event) {
      var d = new Date(event.startDate);
      d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
      return (beginningDay <= d && end >= d);
    }
  },
  render: function () {
    var beginningDay = this.props.beginningDay;

    var eventWeeks = [];
    var maxWeeks = this.props.endingDay.diff(beginningDay, 'weeks') + 1;

    var end = beginningDay.clone();
    end.day(6);
    // create associative array for weeks of calendar
    for (var i = 0; i < maxWeeks; i += 1) {
      var week = this.props.events.filter(this.filterWeek(beginningDay, end));
      eventWeeks[i] = (<DesktopCalendarRow key={"w"+i} startDay={beginningDay} week={week}
                                           month={this.props.dates.startMonth}
                                           range={this.props.dateRange}/>);

      // move start to beginning of next week and end to end of next week
      beginningDay = beginningDay.clone().day(7);
      end = end.clone().day(13);
      if (this.props.dateRange && !this.props.dateRange.end) {
        if (beginningDay.month() != this.props.dates.startMonth) {
          break;
        }
      }
    }
    return (
        <div>
          <DesktopCalendarHeader />
          {eventWeeks}
        </div>
    );
  }
});
