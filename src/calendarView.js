var Event = React.createClass({
  render: function () {
    return (
        <span>
        </span>
    );
  }
});

var EventList = React.createClass({
  render: function () {
    return (
        <div>
        </div>
    );
  }
});

var EventDate = React.createClass({
  render: function () {

    return (
        <div classes={classNames("day", (this.props.isCurr ? '' : 'notCurrent'))} >
          <header>{this.props.day}</header>
        </div>
    );
  }
});

var EventCalendarHeader = React.createClass({
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

var EventCalendarRow = React.createClass({
  render: function () {
    var day = null;
    var days = [];
    for(var i = 0; i < 7; i++) {
      if (this.props.week[0]) {
        day = moment(this.props.week[0].startDate).day(i);
      }
      else {
        day = null;
      }
      var events = this.props.week.filter(function(event) {
        return (i === moment(event.startDate).day());
      });
      if (events.length > 0) {
        if (day != null)
          days.push(<EventDate day={day.date()} />);
      } else {
        if (day != null)
          days.push(<EventDate day={day.date()} />);
      }

    }
    return (
        <div className="calendarRow">
          {days}
        </div>
    );
  }
});

var EventCalendar = React.createClass({
  loadEvents: function () {
    var calendar = this;
    marmottajax({
      url: calendar.props.url,
      json: true
    }).then(function (result) {
      calendar.setState({data: result.sort(dateSort)});
    }).error(function (err) {
      console.error("Something went wrong", err);
    });
  },
  getInitialState: function () {
    return {data: [], dates: {}};
  },
  componentDidMount: function () {
    this.loadEvents();
    var component = this;
    calendarDates.subscribe(function (s) {
      component.setState({dates: s});
      // re-render list of events with new date
      React.render(<EventCalendar url="json/calendar.json"/>, document.getElementById("Calendar"));
    });
  },
  render: function () {
    var component = this;
    // filter to only get events from currently selected month
    var events = this.state.data.filter(function (event) {
      var m = moment(event.startDate);
      return (m.month() == component.state.dates.currentMonth && m.year() == component.state.dates.currentYear );
    });
    console.log(events);
    var weeks = [];
    var start = moment([component.state.dates.currentYear, component.state.dates.currentMonth]).day(0);
    var end = start.clone().day(6);
    // needs to be a loop
    for (var i = 0; i <= 5; i++) {
      weeks[i] = events.filter(function (event) {
        var m = moment(event.startDate);
        return (start <= m && end >= m);
      });
      // move start to beginning of next week and end to end of next week
      start.day(7);
      end.day(15);
      if (start.month() != component.state.dates.currentMonth) {
        break;
      }
    }
    var eventWeeks = weeks.map(function(week,index) {
      var key = "w" + index;
      return(
          <EventCalendarRow key={key} week={week} />
      );
    });
    return (
        <div>
          <EventCalendarHeader />
          {eventWeeks}
        </div>
    );
  }
});

React.render(
    <EventCalendar url="json/calendar.json"/>,
    document.getElementById("Calendar")
);