/**
 * Created by smithmd on 8/7/15.
 */
var ListItem = React.createClass({displayName: "ListItem",
  render: function () {
    return (
        React.createElement("li", {onClick: this.props.updateSelected}, 
          React.createElement("input", {type: "checkbox", id: this.props.category + this.props.index, 
                 name: this.props.category + this.props.index}), 
          React.createElement("label", {htmlFor: this.props.category + this.props.index}, this.props.label)
        )
    );
  }
});

var PickList = React.createClass({displayName: "PickList",
  mixins: [
    OnClickOutside
  ],
  handleClickOutside: function () {
    this.setState({hidden: true});
  },
  getInitialState: function () {
    return {
      hidden: true,
      selected: []
    };
  },
  handleMainClick: function () {
    this.setState({hidden: !this.state.hidden});
  },
  handleClickChild: function (i) {

  },
  render: function () {
    var component = this;
    var list = null;

    if (!this.state.hidden) {
      var checkboxes = this.props.data.map(function (item, index, data) {
        return (
            React.createElement(ListItem, {category: component.props.category, index: index, label: item, selected: component.state.selected, 
                      updateSelected: component.handleClickChild.bind(component, index) })
        );
      });
      list = React.createElement("ul", null, checkboxes);
    }
    return (
        React.createElement("div", {className: "pickList"}, 
          React.createElement("span", {onClick: this.handleMainClick}, this.props.title), 
          list
        )
    );
  }
});

var MultiSelects = React.createClass({displayName: "MultiSelects",
  render: function () {
    return (
        React.createElement(PickList, {data: campDivisions, category: "division", title: "Camp Divisions"})
    );
  }
});

React.render(React.createElement(MultiSelects, null), document.getElementById('multiselects'));