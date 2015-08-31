/**
 * Created by smithmd on 8/7/15.
 */

var Picklist = React.createClass({displayName: "Picklist",
  render: function () {
    var data = this.props.source;
  }
});

var MultiSelects = React.createClass({displayName: "MultiSelects",
  render: function () {
    return (
        React.createElement(PickList, {source: campDivisions})
    );
  }
});

React.render(React.createElement(MultiSelects, null), document.getElementById('multiselects'));