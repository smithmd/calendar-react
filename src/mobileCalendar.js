/**
 * Created by smithmd on 8/19/15.
 */
var MobileEvents = React.createClass({
  getInitialState: function () {
    return {selected: moment().format('YYYY-MM-DD')};
  },
  componentDidMount: function () {
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({selected: s.date});
    });
  },
  render: function () {
    var component = this;
    var events = this.props.events.filter(function (event) {
      return event.startDate === component.state.selected;
    });
    var list = events.map(function (event, index) {
      var time = printTimePhone(event);
      var meridiem = (!event.allDay ? getMeridiem(new Date(event.startTime)) : '');
      var description = event.title + (event.venue ? ' (' + printVenue(event.venue) + ')' : '');
      var zebra = (index % 2 ? '' : 'zebra');
      return (
          <div key={index} className={zebra}>
            <span className="time">{time}
              <span className="meridiem">
                {meridiem}
              </span>
            </span>
            <span className={classNames('description',(event.isDraft ? 'draft' : ''))}>{description}</span>
          </div>
      );
    });
    if (list.length === 0) {
      list = <span id='emptyList'>There are no events on this date.</span>;
    }
    return (
        <div id='eventList'>
          {list}
        </div>
    );
  }
});

var MobileDate = React.createClass({
  handleClick: function () {
    selectedDate.onNext({date: this.props.moment.format('YYYY-MM-DD')});
  },
  render: function () {
    var dot = (this.props.displayDot ? <div className="indicator"></div> : <div></div>);
    var selectedClass = (this.props.isSelected ? ' selected' : '');
    var currentMonthClass = (this.props.isCurr ? '' : ' notCurrentMonth');
    var classes = 'day' + selectedClass + currentMonthClass;
    return (
        <div
            className={classes}
            onClick={this.handleClick}>
          <header>{this.props.day}</header>
          {dot}
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
  getInitialState: function () {
    return {selected: moment().format('YYYY-MM-DD')};
  },
  componentDidMount: function () {
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({selected: s.date});
    });
  },
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
      var isSelected = false;
      if (this.state.selected) {
        isSelected = this.state.selected === day.format('YYYY-MM-DD');
      }

      // display or show dot for events
      var displayDot = (events.length > 0);
      days[i] = (<MobileDate displayDot={displayDot} day={dispDay} key={'d'+i}
                             isToday={isToday} isCurr={isCurr} isSelected={isSelected}
                             moment={day.clone()}/>);
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
          <div id="calendarHolder">
            <MobileCalendarHeader />
            {eventWeeks}
          </div>
          <MobileEvents events={this.props.events}/>
        </div>
    );
  }
});
