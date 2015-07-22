/**
 * Created by smithmd on 7/21/15.
 */
// rendering for each individual event.
var Event = React.createClass({
  render: function () {
    var time = printTime(this.props.event);
    var venue = printVenue(this.props.event.venue);
    return (
        <div className={this.props.classes}>
          <span className="time">{time}</span>
          <span className="title">{this.props.event.title}</span>
          <span className="venue">{venue}</span>
        </div>
    );
  }
});
// rendering for list of events.d
var EventList = React.createClass({
  render: function () {
    var elementId = this.props.date + "-events";
    var events = this.props.events.map(function (ev, index) {
      var zebra = index % 2 === 0;
      var classes = "event" + (zebra ? " zebra" : "");
      return (
          <Event key={ev.uid} event={ev} classes={classes} />
      )
    });
    return (
        <div id={elementId} className="bordered">
          {events}
        </div>
    );
  }
});
// rendering for new fieldset/legend for each date in list of events
var EventDate = React.createClass({
  render: function () {
    var prettyDate = printDate(new Date(this.props.date));
    return (
        <div id={this.props.date} className="day">
          <header className="date">{prettyDate}</header>
          <EventList date={this.props.date} events={this.props.events}/>
        </div>
    );
  }
});
// rendering for complete list of events
var EventDateList = React.createClass({
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
          <EventDate  key={date} date={date} events={eventsByDates[index]}/>
      );
    });
    return (
        <div>
          {eventDateNodes}
        </div>
    );
  }
});

React.render(
    <EventDateList url="json/calendar.json"/>,
    document.getElementById('prettyEvents')
);