/**
 * Created by smithmd on 7/21/15.
 */
// rendering for each individual event
var Event = React.createClass({
  render: function () {
    var time = printTime(this.props.event);
    var venue = printVenue(this.props.event.venue);
    var titleTag;
    var venueTag;
    if (this.props.narrow) {
      var shortTitle = this.props.event.title + ' (' + venue + ')';
      titleTag = <span className="title">{shortTitle}</span>;
      venueTag = null;
    } else {
      titleTag = <span className="title">{this.props.event.title}</span>;
      venueTag = <span className="venue">{venue}</span>;
    }
    return (
        <div className={this.props.classes}>
          <span className="time">{time}</span>
          {titleTag}
          {venueTag}
        </div>
    );
  }
});
// rendering for list of events
var EventList = React.createClass({
  render: function () {
    var component = this;
    var elementId = this.props.date + "-events";
    var events = this.props.events.map(function (ev, index) {
      return (
          <Event key={ev.uid} event={ev}
                 classes={classNames('event',{ zebra: (index % 2 === 0) })}
                 narrow={component.props.narrow}/>
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
      eventList = <EventList date={this.props.date} events={this.props.events} narrow={this.props.narrow}/>;
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
        return {
          data: [],
          selDate: '',
          windowWidth: window.innerWidth
        };
      },
      handleResize: function () {
        this.setState({windowWidth: window.innerWidth});
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
        var narrow = this.state.windowWidth < 801;
        return (
            <EventDate key={edl.state.selDate} date={edl.state.selDate} events={events} narrow={narrow}/>
        );
      }
    })
    ;

React.render(
    <EventDateList url="json/calendar.json"/>,
    document.getElementById('prettyEvents')
);
