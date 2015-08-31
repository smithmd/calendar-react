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
    var day = null;
    var days = [];
    for (var i = 0; i < 7; i += 1) {
      day = this.props.startDay.day(i);
      var events = this.props.week.filter(function (event) {
        return (i === moment(event.startDate, 'YYYY-MM-DD').day());
      });
      var isToday = (moment().startOf('day').diff(day, 'days') === 0);
      days[i] = (React.createElement(EventDate, {events: events, displayLength: 3, day: day.date(), key: 'd'+i, 
                            isCurr: day.month() == this.props.month, 
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
    return {data: [], dates: {}, filters: {}, venues: [], artsAreas: [], divisions: []};
  },
  componentDidMount: function () {
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
  },
  filterVenue: function (event, venues) {
    var show = true;
    // venue filter
    if (venues.indexOf('Any') < 0 && venues.length > 0) {
      var showVenue = false;
      for (var i = 0; i < this.state.venues.length; i++) {
        if (event.venue === venues[i]) {
          showVenue = true;
          break;
        }
      }
      show = showVenue;
    }
    return show;
  },
  filterDivisions: function (event, divisions) {
    var show = true;
    if (divisions.indexOf('Any') < 0 && divisions.length > 0) {
      var showDivision = false;
      for (var i = 0; i < component.state.divisions.length; i++) {
        if (event.campDivision && ~event.campDivision.indexOf(divisions[i])) {
          showDivision = true;
          break;
        }
      }
      show = showDivision;
    }
    return show;
  },
  filterArtsAreas: function (event, artsAreas) {
    var show = true;
      if (artsAreas.indexOf('Any') < 0 && artsAreas.length > 0) {
        var showArtsArea = false;
        for (var i = 0; i < artsAreas.length; i++) {
          if (~event.artsAreas.indexOf(artsAreas[i])) {
            showArtsArea = true;
            break;
          }
        }
        show = showArtsArea;
      }
      return show;
  },
  render: function () {
    var component = this;
    // filter to only get events from currently selected month and surrounding days
    var beginningDay = moment([component.state.dates.currentYear, component.state.dates.currentMonth]);
    beginningDay.day(0);
    // moments are bound to last day of month, so we can assume the 31st will always get us the last day
    var endingDay = moment([component.state.dates.currentYear, component.state.dates.currentMonth, 31]);
    endingDay.day(6);

    // filter checks all filters to see if data matches and returns true if all are true
    // TODO: really wish I could figure out how to pull the date filter out and store the result in state. Might speed the
    // TODO: rest of the page up during summer/busy months.
    var events = this.state.data.filter(function (event) {
      // check to see if date is in or very near selected month
      var m = moment(event.startDate, 'YYYY-MM-DD');
      var show = (m >= beginningDay && m <= endingDay);
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

      // venue filter
      // return if we know we already don't want this event
      if (component.filterVenue(event, component.state.venues) === false) return false;

      // divisions filter
      // return if we know we already don't want this event
      if (component.filterDivisions(event, component.state.divisions) === false) return false;

      // arts area filter
      // return if we know we already don't want this event
      if (component.filterArtsAreas(event, component.state.artsAreas) === false) return false;


      return show;
    });

    var eventWeeks = [];

    var end = beginningDay.clone();
    end.day(6);
    // create associative array for weeks of calendar
    for (var i = 0; i < 6; i += 1) {
      var week = events.filter(function (event) {
        var m = moment(event.startDate, 'YYYY-MM-DD');
        return (beginningDay <= m && end >= m);
      });
      eventWeeks[i] = (React.createElement(EventCalendarRow, {key: "w"+i, startDay: beginningDay, week: week, 
                                         month: component.state.dates.currentMonth}));

      // move start to beginning of next week and end to end of next week
      beginningDay = beginningDay.clone().day(7);
      end = end.clone().day(13);
      if (beginningDay.month() != this.state.dates.currentMonth) {
        break;
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