/**
 * Created by smithmd on 8/7/15.
 */
var ListItem = React.createClass({displayName: "ListItem",
  render: function () {
    return (
        React.createElement("li", {onClick: this.props.updateSelected}, 
          React.createElement("input", {type: "checkbox", id: this.props.category + this.props.index, 
                 name: this.props.category + this.props.index, 
                 checked: this.props.selected.indexOf(this.props.index) > -1 ? 'checked' : ''}), 
          React.createElement("label", null, this.props.label)
        )
    );
  }
});

var PickList = React.createClass({displayName: "PickList",
  mixins: [
    OnClickOutside
  ],
  getInitialState: function () {
    return {
      hidden: true,
      selected: []
    };
  },
  handleClickOutside: function () {
    this.setState({hidden: true});
  },
  handleMainClick: function () {
    this.setState({hidden: !this.state.hidden});
  },
  handleClickChild: function (i) {
    var index = this.state.selected.indexOf(i);
    var arr = this.state.selected;
    if (i === 0) {
      if (arr.indexOf(0) > -1) {
        // 'Any' was previously selected, so empty the array when removing 'Any' option
        arr = [];
      } else {
        // 'Any' not previously selected, create array that is populated with sequence of 1..N
        arr = Array.apply(null, {length: this.props.data.length}).map(Number.call, Number);
      }
    } else {
      if (index > -1) {
        arr.splice(index, 1); // remove check from clicked
        if (arr.indexOf(0) > -1) {
          arr.splice(arr.indexOf(0), 1); // remove check from Any option
        }
      } else {
        arr.push(i);
      }
    }
    this.setState({selected: arr});

    var tmp = [];
    for (var iter = 0; iter < arr.length; iter++) {
      tmp.push(this.props.data[arr[iter]]);
    }
  },
  render: function () {
    var component = this;
    var list = null;

    if (!this.state.hidden) {
      var checkboxes = this.props.data.map(function (item, index, data) {
        return (
            React.createElement(ListItem, {category: component.props.category, index: index, label: item, selected: component.state.selected, 
                      updateSelected: component.handleClickChild.bind(component, index)})
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
        React.createElement("span", null, 
          React.createElement(PickList, {data: venues, category: "venue", title: "Venues"}), 
          React.createElement(PickList, {data: campDivisions, category: "division", title: "Camp Divisions"}), 
          React.createElement(PickList, {data: artsAreas, category: "area", title: "Arts Area"})
        )
    );
  }
});

React.render(React.createElement(MultiSelects, null), document.getElementById('multiselects'));