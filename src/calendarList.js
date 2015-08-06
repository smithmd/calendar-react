/**
 * Created by smithmd on 7/21/15.
 */
// rendering for each individual event
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
// rendering for list of events
var EventList = React.createClass({
  render: function () {
    var elementId = this.props.date + "-events";
    var events = this.props.events.map(function (ev, index) {
      return (
          <Event key={ev.uid} event={ev} classes={classNames('event',{ zebra: (index % 2 === 0) })}/>
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
    //var prettyDate = printDate(new Date(this.props.date));
    var eventList = null;
    if (this.props.events.length <= 0) {
      eventList = <span id="emptyList">There are no events on this date.</span>;
    } else {
      eventList = <EventList date={this.props.date} events={this.props.events}/>;
    }
    return (
        <div id={this.props.date} className="day">
          {eventList}
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
    return {data: [], selDate: ''};
  },
  componentDidMount: function () {
    this.loadEvents();
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({selDate: s.date});
    });
  },
  render: function () {
    var edl = this;
    var events = this.state.data.filter(function (event) {
      return edl.state.selDate == event.startDate;
    });
    return (
        <EventDate key={edl.state.selDate} date={edl.state.selDate} events={events}/>
    );
  }
});

React.render(
    <EventDateList url="json/calendar.json"/>,
    document.getElementById('prettyEvents')
);
