/**
 * Created by smithmd on 8/7/15.
 */

var Picklist = React.createClass({displayName: "Picklist",
  handleMainClick: function () {

  },
  render: function () {
    var checkbox = this.props.data.map(function () {
      return (
        React.createElement("span", {onClick: this.handleMainClick})
      );
    });
  }
});

var MultiSelects = React.createClass({displayName: "MultiSelects",
  render: function () {
    return (
        React.createElement(PickList, {data: campDivisions})
    );
  }
});

React.render(React.createElement(MultiSelects, null), document.getElementById('multiselects'));