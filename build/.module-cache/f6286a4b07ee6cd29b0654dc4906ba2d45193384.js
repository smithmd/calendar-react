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
    marmottajax({
      url: this.props.url,
      json: true
    }).then(function (result) {
      this.setState({data: result})
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
    return (
        React.createElement(EventDate, null)
    );
  }
});

React.render(
    React.createElement(EventDateList, {url: "json/calendar.json"}),
    document.getElementById('container')
);