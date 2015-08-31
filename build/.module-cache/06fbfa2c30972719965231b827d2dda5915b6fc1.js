/**
 * Created by smithmd on 7/21/15.
 */
// rendering for each individual event
var Event = React.createClass({displayName: "Event",
  render: function () {
    var time = printTime(this.props.event);
    var venue = printVenue(this.props.event.venue);
    return (
        React.createElement("div", {className: this.props.classes}, 
          React.createElement("span", {className: "time"}, time), 
          React.createElement("span", {className: "title"}, this.props.event.title), 
          React.createElement("span", {className: "venue"}, venue)
        )
    );
  }
});
// rendering for list of events
var EventList = React.createClass({displayName: "EventList",
  render: function () {
    var elementId = this.props.date + "-events";
    var events = this.props.events.map(function (ev, index) {
      return (
          React.createElement(Event, {key: ev.uid, event: ev, classes: classNames('event',{ zebra: (index % 2 === 0) })})
      )
    });
    return (
        React.createElement("div", {id: elementId, className: "bordered"}, 
          events
        )
    );
  }
});

// rendering for new fieldset/legend for each date in list of events
var EventDate = React.createClass({displayName: "EventDate",
  render: function () {
    //var prettyDate = printDate(new Date(this.props.date));
    var eventList = null;
    if (this.props.events.length <= 0) {
      eventList = React.createElement("span", {id: "emptyList"}, "There are no events on this date.");
    } else {
      eventList = React.createElement(EventList, {date: this.props.date, events: this.props.events});
    }
    return (
        React.createElement("div", {id: this.props.date, className: "day"}, 
          eventList
        )
    );
  }
});
// rendering for complete list of events
var EventDateList = React.createClass({displayName: "EventDateList",
  loadEvents: function () {
    var list = this;
    marmottajax({
      url: list.props.url,
      json: true
    }).then(function (result) {
      list.setState({data: result.sort(dateSort)});
    }).error(function (err) {
      console.error("Something went wrong", err);
    });
  },
  getInitialState: function () {
    return {data: [], selDate: ''};
  },
  componentDidMount: function () {
    this.loadEvents();
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({selDate: s.date});
    });
    // debounce prevents the function from running every 20ms, instead run 100ms after last resize event
    window.addEventListener('resize', debounce(this.handleResize, 100));
  },
  componentWillUnmount: function () {
    // debounce prevents the function from running every 20ms, instead run 100ms after last resize event
    window.removeEventListener('resize', debounce);
  },
  render: function () {
    var edl = this;
    var events = this.state.data.filter(function (event) {
      return edl.state.selDate == event.startDate;
    });
    return (
        React.createElement(EventDate, {key: edl.state.selDate, date: edl.state.selDate, events: events})
    );
  }
});

React.render(
    React.createElement(EventDateList, {url: "json/calendar.json"}),
    document.getElementById('prettyEvents')
);
