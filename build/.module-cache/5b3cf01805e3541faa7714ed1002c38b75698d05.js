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

var DesktopDate = React.createClass({displayName: "DesktopDate",
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

var DesktopCalendarHeader = React.createClass({displayName: "DesktopCalendarHeader",
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

var DesktopCalendarRow = React.createClass({displayName: "DesktopCalendarRow",
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
      days[i] = (React.createElement(DesktopDate, {events: events, displayLength: 3, day: dispDay, key: 'd'+i, 
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

var DesktopCalendar = React.createClass({displayName: "DesktopCalendar",
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
      eventWeeks[i] = (React.createElement(DesktopCalendarRow, {key: "w"+i, startDay: beginningDay, week: week, 
                                           month: this.props.dates.startMonth, 
                                           range: this.props.dateRange}));

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
        React.createElement("div", null, 
          React.createElement(DesktopCalendarHeader, null), 
          eventWeeks
        )
    );
  }
});

var MobileCalendarHeader = React.createClass({displayName: "MobileCalendarHeader",
  render: function () {
    // create calendar header
    var header = weekdays.map(function (day, index) {
      return (
          React.createElement("div", {key: index, className: "dayOfWeek"}, 
            day.substr(0,2)
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

var MobileCalendar = React.createClass({displayName: "MobileCalendar",
  render: function () {
    // display calendar
    // display list, defaulted to today
    return (
        React.createElement("div", null, 
          React.createElement(MobileCalendarHeader, null)
        )
    );
  }
});

var Calendar = React.createClass({displayName: "Calendar",
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
  filterData: function (component, beginningDay, endingDay) {
    return function (event) {
      // check to see if date is in or very near selected month
      var d = new Date(event.startDate);
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
    }
  },
  componentWillMount: function () {
    this.loadEvents();
    var component = this;
    calendarDates.subscribe(function (s) {
      component.setState({dates: s});
    });
    calendarFilters.subscribe(function (s) {
      component.setState({dailyFilter: s});
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
      if (s.start && s.end) {
        var beginningDay = moment(s.start).startOf('day');
        var endingDay = moment(s.end).endOf('day');
        calendarDates.onNext({
          startMonth: beginningDay.month(),
          startYear: beginningDay.year(),
          endMonth: endingDay.month(),
          endYear: endingDay.year()
        });
      }
    });
  },
  getInitialState: function () {
    return {
      windowWidth: window.innerWidth,
      data: [],
      dates: {},
      dateRange: {start: null, end: null},
      dailyFilter: {},
      venues: [],
      artsAreas: [],
      divisions: []
    };
  },
  render: function () {
    var component = this;
    // filter to only get events from currently selected month and surrounding days
    var beginningDay, endingDay;
    if (this.state.dateRange && this.state.dateRange.start && this.state.dateRange.end) {
      beginningDay = moment(this.state.dateRange.start).startOf('day');
      endingDay = moment(this.state.dateRange.end).endOf('day');
    } else {
      beginningDay = moment([component.state.dates.startYear, component.state.dates.startMonth]);
      // moments are bound to last day of month, so we can assume the 31st will always get us the last day
      endingDay = moment([component.state.dates.startYear, component.state.dates.startMonth, 31]);
    }
    beginningDay.day(0);
    endingDay.day(6);

    // filter checks all filters to see if data matches and returns true if all are true
    var events = this.state.data.filter(this.filterData(component, beginningDay, endingDay));


    var ret = null;
    if (this.state.windowWidth > 480) {
      ret = (React.createElement(DesktopCalendar, {events: events, beginningDay: beginningDay, endingDay: endingDay, dates: this.state.dates, dateRange: this.state.dateRange}));
    } else {
      ret = (React.createElement(MobileCalendar, {events: events, beginningDay: beginningDay, endingDay: endingDay, dates: this.state.dates, dateRange: this.state.dateRange}));
    }
    return ret;
  }
});

React.render(
    React.createElement(Calendar, {url: "json/calendar.json"}),
    document.getElementById("Calendar")
);