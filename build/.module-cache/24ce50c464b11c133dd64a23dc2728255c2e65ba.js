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
    var prettyDate = printDate(new Date(this.props.date));
    return (
        React.createElement("div", {id: this.props.date, className: "day"}, 
          React.createElement("header", {className: "date"}, prettyDate), 
          React.createElement(EventList, {date: this.props.date, events: this.props.events})
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
    return {data: []};
  },
  componentDidMount: function () {
    this.loadEvents();
  },
  render: function () {
    var eventDateIndex = [];
    var eventsByDates = [[]];
    this.state.data.map(function (event) {
      // add events to map keyed on date to iterate over when drawing events on list
      var date = event.startDate;
      if (eventDateIndex.indexOf(date) === -1) {
        eventDateIndex.push(date);
        eventsByDates[eventDateIndex.indexOf(date)] = [];
      }
      eventsByDates[eventDateIndex.indexOf(date)].push(event);
    });
    var eventDateNodes = eventDateIndex.map(function (date, index) {
      return (
          React.createElement(EventDate, {key: date, date: date, events: eventsByDates[index]})
      );
    });
    return (
        React.createElement("div", null, 
          eventDateNodes
        )
    );
  }
});

React.render(
    React.createElement(EventDateList, {url: "json/calendar.json", startDate: "", endDate: ""}),
    document.getElementById('prettyEvents')
);