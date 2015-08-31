/**
 * Created by smithmd on 7/21/15.
 */
// rendering for each individual event.
var Event = React.createClass({displayName: "Event",
  render: function () {
    return (
        React.createElement("p", null, 
          React.createElement("span", null, this.props.event.startTime), 
          React.createElement("span", null, this.props.event.title), 
          React.createElement("span", null, this.props.event.venue)
        )
    );
  }
});
// rendering for list of events.
var EventList = React.createClass({displayName: "EventList",
  render: function () {
    var events = this.props.events.map(function (ev) {
      return (
          React.createElement(Event, {key: ev.uid, event: ev})
      )
    });
    return (
        React.createElement("div", null, 
          events
        )
    );
  }
});
// rendering for new fieldset/legend for each date in list of events
var EventDate = React.createClass({displayName: "EventDate",
  render: function () {
    return (
        React.createElement("fieldset", null, 
          React.createElement("legend", null, this.props.date), 
          React.createElement(EventList, {events: this.props.events})
        )
    );
  }
});
// rendering for complete list of events
var EventDateList = React.createClass({displayName: "EventDateList",
  loadEvents: function () {
    var list = this;
    marmottajax({
      url: this.props.url,
      json: true
    }).then(function (result) {
      list.setState({data: result.sort(dateSort)})
      console.log(list.state.data);
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
    var eventDateNodes = eventDateIndex.map(function (date, index, arr) {
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
    React.createElement(EventDateList, {url: "json/calendar.json"}),
    document.getElementById('container')
);