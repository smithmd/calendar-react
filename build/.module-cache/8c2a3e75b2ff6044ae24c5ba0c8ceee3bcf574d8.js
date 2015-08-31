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
    var eventDateMap = new Map();
    this.props.data.map(function (event) {
      var date = eventDateMap.get(event.startDate);
      if (!date) {
        date = [];
      }
      date.push(event);
      eventDateMap.set(date);
    });
    var eventDateNodes = eventDateMap.keys().map(function (comment) {
      return (
          React.createElement(Comment, {author: comment.author}, 
            comment.text
          )
      );
    });
    return (
        React.createElement("div", {className: "commentList"}, 
          eventDateNodes
        )
    );
  }
});

React.render(
    React.createElement(EventDateList, {url: "json/calendar.json"}),
    document.getElementById('container')
);