/**
 * Created by smithmd on 7/21/15.
 */

var Event = React.createClass({displayName: "Event",
  render: function () {
    return (
        React.createElement("p", null, 
          React.createElement("span", null, "Date"), 
          React.createElement("span", null, "Title"), 
          React.createElement("span", null, "Venue")
        )
    );
  }
});
var EventList = React.createClass({displayName: "EventList",
  render: function () {
    return (
        React.createElement(Event, null)
    );
  }
});
var EventDate = React.createClass({displayName: "EventDate",
  render: function () {
    return (
        React.createElement("fieldset", null, 
          React.createElement("legend", null), 
          React.createElement(EventList, null)
        )
    );
  }
});
var EventDateList = React.createClass({displayName: "EventDateList",
  loadEvents: function () {
    var list = this;
    marmottajax({
      url: this.props.url,
      json: true
    }).then(function (result) {
      list.setState({data: result.sort(dateSort)})
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
    var eventDates = {};
    this.state.data.map(function (event) {
      // add events to map keyed on date to iterate over when drawing events on list
      var date = event.startDate;
      if (!date) {
        date = [];
      }
      date.push(event);
      eventDates.set(date);
    });
    var eventDateNodes = eventDateMap.keys().map(function (date) {
      return (
          React.createElement("fieldset", null, 
            React.createElement("legend", null, date)
          )
      );
    });
    return (
      {eventDateNodes}
    );
  }
});

React.render(
    React.createElement(EventDateList, {url: "json/calendar.json"}),
    document.getElementById('container')
);