/**
 * Created by smithmd on 8/7/15.
 */
var ListItem = React.createClass({displayName: "ListItem",
  render: function () {
    return (
            React.createElement("li", {key: 'i'+index}, 
              React.createElement("input", {type: "checkbox", id: component.props.category + index, name: component.props.category + index}), 
              React.createElement("label", {for: component.props.category + index}, item)
            )
    );
  }
});

var PickList = React.createClass({displayName: "PickList",
  getInitialState: function () {
    return {hidden: true};
  },
  handleMainClick: function () {
    this.setState({hidden: !this.state.hidden});
  },
  render: function () {
    var component = this;
    var list = null;

    if (!this.state.hidden) {
      var checkboxes = this.props.data.map(function (item, index, data) {
        return (
            React.createElement("li", {key: 'i'+index}, 
              React.createElement("input", {type: "checkbox", id: component.props.category + index, name: component.props.category + index}), 
              React.createElement("label", {for: component.props.category + index}, item)
            )
        );
      });
      list = React.createElement("ul", null, checkboxes);
    }
    return (
        React.createElement("div", null, 
          React.createElement("span", {onClick: this.handleMainClick}, this.props.title), 
          list
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