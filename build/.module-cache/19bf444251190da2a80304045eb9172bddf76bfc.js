/**
 * Created by smithmd on 7/21/15.
 */

var EventDate = React.createClass({displayName: "EventDate",
  render: function () {
    return (
        React.createElement("fieldset", null, 
          React.createElement("legend", null)
        )
    );
  }
});
var EventDateList = React.createClass({displayName: "EventDateList",
  render: function() {
    return (
      React.createElement(EventDate, null)
    );
  }
});