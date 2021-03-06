var Calendar = React.createClass({displayName: "Calendar",
  loadEvents: function () {
    var calendar = this;
    marmottajax({
      url: calendar.props.url,
      json: true
    }).then(function (result) {
      calendar.setState({data: result.sort(dateSort)});

      // process events on draft calendar, if any
      var draftEvents = result.filter(function (event) {
        return event.isDraft;
      });
      if (draftEvents.length > 0) {
        draftEvents.sort(dateSort);
        var m = moment(draftEvents[0].startTime);
        calendarDates.onNext({startYear: m.year(), startMonth: m.month(), endYear: m.year(), endMonth: m.month()});
      }
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
  filterFromSearch: function (eventObj, searchString) {
    var string_exists = false;
    // check various fields
    // include multiple search terms
    if (eventObj) {
      // check if title matches string
      if (eventObj.title) {
        if (eventObj.title.toLowerCase().indexOf(searchString) > -1) {
          return true;
        }
      }

      // check if genre matches string
      if (eventObj.genre) {
        if (eventObj.genre.toLowerCase().indexOf(searchString) > -1) {
          return true;
        }
      }

      // check if division matches string
      if (eventObj.campDivision) {
        if (eventObj.campDivision.toLowerCase().indexOf(searchString) > -1) {
          return true;
        }
      }

      // check if venue matches string
      if (eventObj.venue) {
        if (eventObj.venue.toLowerCase().indexOf(searchString) > -1) {
          return true;
        }
      }
    }

    return string_exists;
  },
  filterData: function (component, beginningDay, endingDay) {
    return function (event) {
      // check to see if date is in or very near selected month
      var d = new Date(event.startDate);
      d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
      var show = (d >= beginningDay.toDate() && d <= endingDay.toDate());
      // return if we know we already don't want this event
      if (show === false) return false;

      if (component.state.dailyFilter === true) {
        show = event.includeOnDaily;
      }
      // return if we know we already don't want this event
      if (show === false) return false;

      if (component.state.performanceFilter === true) {
        show = event.isPerformance;
      }
      // return if we know we already don't want this event
      if (show === false) return false;

      // return if we find out we don't want to show this event
      if (component.filterArray(event.campDivision, component.state.divisions) === false) return false;
      if (component.filterArray(event.venue, component.state.venues) === false) return false;
      if (component.filterArray(event.artsAreas, component.state.eventTypes) === false) return false;

      var search = component.state.searchText.toLowerCase().split(' ');

      for (var i = 0; i < search.length; i += 1) {
        if (search[i].length > 0) {
          if (component.filterFromSearch(event, search[i]) === false) return false;
        }
      }

      // should be true at this point
      return show;
    }
  },
  componentWillMount: function () {
    var component = this;
    calendarDates.subscribe(function (s) {
      component.setState({dates: s});
    });
    dailyFilter.subscribe(function (s) {
      component.setState({dailyFilter: s});
    });
    performanceFilter.subscribe(function (s) {
      component.setState({performanceFilter: s});
    });
    venueFilters.subscribe(function (s) {
      component.setState({venues: s.venues});
    });
    eventTypesFilters.subscribe(function (s) {
      component.setState({eventTypes: s.eventTypes});
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
    searchFilter.subscribe(function (s) {
      component.setState({searchText: s.searchString});
    });
  },
  getInitialState: function () {
    return {
      narrow: window.matchMedia("screen and (max-width:800px)").matches,
      data: [],
      dates: {},
      dateRange: {start: null, end: null},
      dailyFilter: false,
      performanceFilter: false,
      venues: [],
      eventTypes: [],
      divisions: [],
      searchText: ''
    };
  },
  componentDidMount: function () {
    this.loadEvents();
    var component = this;
    var mql = window.matchMedia("screen and (max-width:800px)");
    mql.addListener(function (e) {
      component.setState({narrow: e.matches});
    });
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
    if (!this.state.narrow) {
      ret = (React.createElement(DesktopCalendar, {events: events, beginningDay: beginningDay, endingDay: endingDay, dates: this.state.dates, 
                              dateRange: this.state.dateRange}));
    } else {
      ret = (React.createElement(MobileCalendar, {events: events, beginningDay: beginningDay, endingDay: endingDay, dates: this.state.dates, 
                             dateRange: this.state.dateRange}));
    }
    return ret;
  }
});

React.render(
    React.createElement(Calendar, {url: window.jsonUrl, isDraft: window.isDraft}),
    document.getElementById("Calendar")
);