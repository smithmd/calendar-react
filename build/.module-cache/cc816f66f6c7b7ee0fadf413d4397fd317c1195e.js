/**
 * Created by smithmd on 8/7/15.
 */

var PickList = React.createClass({displayName: "PickList",
  handleMainClick: function () {

  },
  render: function () {
    var component = this;
    var checkboxes = this.props.data.map(function (item, index, data) {
      return(
          React.createElement("li", {key: 'i'+index}, 
            React.createElement("input", {type: "checkbox", id: component.props.category + index, name: component.props.category + index}), 
            React.createElement("label", {for: component.props.category + index}, item)
          )
      );
    });
    return (
        React.createElement("div", null, 
          React.createElement("span", {onClick: this.handleMainClick}, this.props.title), 
          React.createElement("ul", null, 
            checkboxes
          )
        )
    );

  }
});

var MultiSelects = React.createClass({displayName: "MultiSelects",
  render: function () {
    return (
        React.createElement(PickList, {data: campDivisions, category: "div", title: "Camp Divisions"})
    );
  }
});

React.render(React.createElement(MultiSelects, null), document.getElementById('multiselects'));