/**
 * Created by smithmd on 8/19/15.
 */
var MobileDate = React.createClass({
  render: function () {
    // display or show dot for events
    var displayDot = (this.props.events.length > 0);
    return (
        <div
            className={classNames('day', (this.props.isCurr ? null : 'notCurrentMonth'), (this.props.isToday ? 'today' : null))}>
          <header>{this.props.day}</header>
        </div>
    );
  }
});
var MobileCalendarHeader = React.createClass({
  render: function () {
    // create calendar header
    var header = weekdays.map(function (day, index) {
      return (
          <div key={index} className="dayOfWeek">
            {day.substr(0, 2)}
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

var MobileCalendarRow = React.createClass({
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
      days[i] = (<MobileDate events={events} displayLength={3} day={dispDay} key={'d'+i}
                             isCurr={isCurr}/>);
    }
    return (
        <div className="calendarRow">
          {days}
        </div>
    );
  }
});

var MobileCalendar = React.createClass({
  filterWeek: function (beginningDay, end) {
    return function (event) {
      var d = new Date(event.startDate);
      d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
      return (beginningDay <= d && end >= d);
    }
  },
  render: function () {
    // display calendar
    // display list, defaulted to today
    var beginningDay = this.props.beginningDay;

    var eventWeeks = [];
    var maxWeeks = this.props.endingDay.diff(beginningDay, 'weeks') + 1;

    var end = beginningDay.clone();
    end.day(6);
    // create associative array for weeks of calendar
    for (var i = 0; i < maxWeeks; i += 1) {
      var week = this.props.events.filter(this.filterWeek(beginningDay, end));
      eventWeeks[i] = (<MobileCalendarRow key={"w"+i} startDay={beginningDay} week={week}
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
          <MobileCalendarHeader />
          {eventWeeks}
        </div>
    );
  }
});
