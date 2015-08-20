var Calendar = React.createClass({
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

      if (component.state.filters.showOnlyDaily === true) {
        show = event.includeOnDaily;
      }
      // return if we know we already don't want this event
      if (show === false) return false;

      if (component.state.filters.showOnlyPerformances === true) {
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
      filters: {},
      venues: [],
      artsAreas: [],
      divisions: []
    };
  },
  handleResize: function () {
    this.setState({windowWidth: window.innerWidth});
  },
  componentDidMount: function () {
    // debounce prevents the function from running every 20ms, instead run 100ms after last resize event
    window.addEventListener('resize', debounce(this.handleResize, 100));
  },
  componentWillUnmount: function () {
    // debounce prevents the function from running every 20ms, instead run 100ms after last resize event
    window.removeEventListener('resize', debounce);
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
    if (this.state.windowWidth > 800) {
      ret = (<DesktopCalendar events={events} beginningDay={beginningDay} endingDay={endingDay} dates={this.state.dates}
                              dateRange={this.state.dateRange}/>);
    } else {
      ret = (<MobileCalendar events={events} beginningDay={beginningDay} endingDay={endingDay} dates={this.state.dates}
                             dateRange={this.state.dateRange}/>);
    }
    return ret;
  }
});

React.render(
    <Calendar url="json/calendar.json"/>,
    document.getElementById("Calendar")
);