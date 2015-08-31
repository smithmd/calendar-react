var Event = React.createClass({displayName: "Event",
  render: function () {
    var time = printStartTime(this.props.event);
    var venue = '';
    if (this.props.event.venue != null && this.props.event.venue != '') {
      venue = React.createElement("span", {className: "venue"}, "(", this.props.event.venue, ")");
    }
    return (
        React.createElement("div", {"data-start-date": this.props.event.startDate, 
             className: classNames('event',(this.props.isLast ? 'last' : ''))}, 
          React.createElement("span", {className: "time"}, time), " - ", React.createElement("span", {className: "title"}, this.props.event.title), " ", venue
        )
    );
  }
});

var EventDate = React.createClass({displayName: "EventDate",
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
        return (React.createElement(Event, {event: event, isLast: index === (events.length - 1), key: index}));
      });
    } else {
      for (var i = 0, end = component.props.displayLength; i < end; i += 1) {
        if (this.props.events[i]) {
          eventList.push(React.createElement(Event, {event: this.props.events[i], 
                                isLast: i === (end - 1) || (this.props.events.length-1) === i, 
                                key: i}));
        }
      }
    }

    // display show or hide more link
    var remaining = component.props.events.length - component.props.displayLength;
    if (component.state.printAll === false && remaining > 0) {
      remainder = React.createElement("a", {href: "javascript:void(0)", onClick: this.handleMoreClick}, "+ Show ", remaining, " More")
    } else if (remaining > 0) {
      remainder = React.createElement("a", {href: "javascript:void(0)", onClick: this.handleMoreClick}, "- Hide ", remaining)
    }
    return (
        React.createElement("div", {
            className: classNames('day', (this.props.isCurr ? null : 'notCurrentMonth'), (this.props.isToday ? 'today' : null))}, 
          React.createElement("header", null, this.props.day, 
            this.props.isToday ? React.createElement("span", {className: "today"}, "Today") : null
          ), 
          eventList, 
          remainder
        )
    );
  }
});

var EventCalendarHeader = React.createClass({displayName: "EventCalendarHeader",
  render: function () {
    // create calendar header
    var header = weekdays.map(function (day, index) {
      return (
          React.createElement("div", {key: index, className: "dayOfWeek"}, 
            day
          )
      );
    });
    return (
        React.createElement("div", {className: "calendarRow"}, 
          header
        )
    );
  }
});

var EventCalendarRow = React.createClass({displayName: "EventCalendarRow",
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
      if (this.props.range.start && this.props.range.end) {
        isCurr = (this.props.range.start <= day) && (this.props.range.end >= day);
      } else {
        isCurr = day.month() == this.props.month;
      }
      var isToday = (today.diff(day, 'days') === 0);
      days[i] = (React.createElement(EventDate, {events: events, displayLength: 3, day: day.date(), key: 'd'+i, 
                            isCurr: isCurr, 
                            isToday: isToday, 
                            printAll: false}));

    }
    return (
        React.createElement("div", {className: "calendarRow"}, 
          days
        )
    );
  }
});

var EventCalendar = React.createClass({displayName: "EventCalendar",
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
    return {
      data: [],
      dates: {},
      dateRange: {start: null, end: null},
      filters: {},
      venues: [],
      artsAreas: [],
      divisions: []
    };
  },
  componentWillMount: function () {
    this.loadEvents();
    var component = this;
    calendarDates.subscribe(function (s) {
      component.setState({dates: s});
    });
    calendarFilters.subscribe(function (s) {
      component.setState({filters: s});
    });
    venueFilters.subscribe(function (s) {
      component.setState({venues: s.venues});
    });
    artsAreaFilters.subscribe(function (s) {
      component.setState({artsAreas: s.artsAreas});
    });
    divisionFilters.subscribe(function (s) {
      component.setState({divisions: s.divisions});
    });
    calendarDateRange.subscribe(function (s) {
      component.setState({dateRange: s});
    });
  },
  componentDidMount: function () {
  },
  filterArray: function (str, array) {
    var show = true;
    if (array.indexOf('Any') < 0 && array.length > 0) {
      var display = false;
      for (var i = 0; i < array.length; i++) {
        if (str && ~str.indexOf(array[i])) {
          display = true;
          break;
        }
      }
      show = display;
    }
    return show;
  },
  render: function () {
    var component = this;
    // filter to only get events from currently selected month and surrounding days
    var beginningDay, endingDay;
    if (this.state.dateRange && this.state.dateRange.start && this.state.dateRange.end) {
      beginningDay = moment(this.state.dateRange.start);
      endingDay = moment(this.state.dateRange.end).endOf('day');
    } else {
      beginningDay = moment([component.state.dates.currentYear, component.state.dates.currentMonth]);
      // moments are bound to last day of month, so we can assume the 31st will always get us the last day
      endingDay = moment([component.state.dates.currentYear, component.state.dates.currentMonth, 31]);
    }
    beginningDay.day(0);
    endingDay.day(6);

    // filter checks all filters to see if data matches and returns true if all are true
    var d;
    var events = this.state.data.filter(function (event) {
      // check to see if date is in or very near selected month
      d = new Date(event.startDate);
      d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
      var show = (d >= beginningDay.toDate() && d <= endingDay.toDate());
      // return if we know we already don't want this event
      if (show === false) return false;

      if (component.state.dailyFilter.showOnlyDaily === true) {
        show = event.includeOnDaily;
      }
      // return if we know we already don't want this event
      if (show === false) return false;

      if (component.state.dailyFilter.showOnlyPerformances === true) {
        show = event.isPerformance;
      }
      // return if we know we already don't want this event
      if (show === false) return false;

      // return if we find out we don't want to show this event
      if (component.filterArray(event.campDivision, component.state.divisions) === false) return false;
      if (component.filterArray(event.venue, component.state.venues) === false) return false;
      if (component.filterArray(event.artsAreas, component.state.artsAreas) === false) return false;

      // should be true at this point
      return show;
    });

    var eventWeeks = [];
    var maxWeeks = endingDay.diff(beginningDay, 'weeks') + 1;

    var end = beginningDay.clone();
    end.day(6);
    // create associative array for weeks of calendar
    for (var i = 0; i < maxWeeks; i += 1) {
      var week = events.filter(function (event) {
        d = new Date(event.startDate);
        d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
        return (beginningDay <= d && end >= d);
      });
      eventWeeks[i] = (React.createElement(EventCalendarRow, {key: "w"+i, startDay: beginningDay, week: week, 
                                         month: component.state.dates.currentMonth, 
                                         range: this.state.dateRange}));

      // move start to beginning of next week and end to end of next week
      beginningDay = beginningDay.clone().day(7);
      end = end.clone().day(13);
      if (!this.state.dateRange.end) {
        if (beginningDay.month() != this.state.dates.currentMonth) {
          break;
        }
      }
    }
    return (
        React.createElement("div", null, 
          React.createElement(EventCalendarHeader, null), 
          eventWeeks
        )
    );
  }
});

React.render(
    React.createElement(EventCalendar, {url: "json/calendar.json"}),
    document.getElementById("Calendar")
);