/**
 * Created by smithmd on 8/7/15.
 */
var ListItem = React.createClass({displayName: "ListItem",
  render: function () {
    return (
        React.createElement("li", {onClick: this.props.updateSelected}, 
          React.createElement("input", {readOnly: "readonly", type: "checkbox", id: this.props.category + this.props.index, 
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
  componentWillMount: function () {
    var component = this;
    this.props.filt.subscribe(function (s) {
      component.setState({selected: s[component.props.category + 'Index']});
    });
  },
  handleClickOutside: function () {
    this.setState({hidden: true});
  },
  handleMainClick: function () {
    this.setState({hidden: !this.state.hidden});
  },
  handleClickChild: function (i, filter) {
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
    //this.setState({selected: arr});

    var tmp = [];
    for (var it = 0; it < arr.length; it++) {
      tmp.push(this.props.data[arr[it]]);
    }
    var obj = {};
    obj[this.props.category] = tmp;
    obj[this.props.category + 'Index'] = arr;
    filter.onNext(obj);
  },
  render: function () {
    var component = this;
    var list = null;

    if (!this.state.hidden) {
      var checkboxes = this.props.data.map(function (item, index) {
        return (
            React.createElement(ListItem, {key: 'li'+index, index: index, label: item, 
                      selected: component.state.selected, category: component.props.category, 
                      updateSelected: component.handleClickChild.bind(component, index, component.props.filt)})
        );
      });
      list = React.createElement("ul", null, checkboxes);
    }
    var title = this.props.title;
    if (component.state.selected.length > 0) {
      if (component.state.selected.length === 1) {
        title = this.props.data[component.state.selected[0]];
      } else {
        if (component.state.selected.indexOf(0) < 0) {
          title = component.state.selected.length + ' ' + title;
        }
      }
    }
    return (
        React.createElement("li", {className: "pickList"}, 
          React.createElement("span", {onClick: this.handleMainClick}, 
            title, 
            React.createElement("div", {className: "bg-img"})
          ), 
          list
        )
    );
  }
});

var FilterList = React.createClass({displayName: "FilterList",
  filterClick: function () {
    dailyFilter.onNext(document.getElementById(this.props.prefix + 'dailyFilter').checked);
    performanceFilter.onNext(document.getElementById(this.props.prefix + 'performanceFilter').checked);
    expandAll.onNext(document.getElementById(this.props.prefix + 'expand').checked);

  },
  render: function () {
    return (
        React.createElement("ul", {className: "filterList"}, 
          React.createElement("li", null, 
            React.createElement("span", {onClick: this.filterClick}, 
              React.createElement("input", {id: this.props.prefix + "dailyFilter", type: "checkbox", name: "dailyFilter"}), 
              React.createElement("label", {htmlFor: this.props.prefix + "dailyFilter"}, "Daily Events")
            )
          ), 
          React.createElement("li", null, 
            React.createElement("span", {onClick: this.filterClick}, 
              React.createElement("input", {id: this.props.prefix + "performanceFilter", type: "checkbox", name: "performanceFilter"}), 
              React.createElement("label", {htmlFor: this.props.prefix + "performanceFilter"}, "Performances")
            )
          ), 
          React.createElement("li", null, 
            React.createElement("span", {onClick: this.filterClick}, 
              React.createElement("input", {id: this.props.prefix + "expand", type: "checkbox", name: "expandAll"}), 
              React.createElement("label", {htmlFor: this.props.prefix + "expand"}, "Expand All")
            )
          ), 
          React.createElement("li", null, 
            React.createElement("span", null, 
              React.createElement("input", {id: this.props.prefix + "datepicker", name: this.props.prefix + "datepicker", placeholder: "Custom Date"})
            )
          ), 
          React.createElement(PickList, {data: venues, category: "venues", title: "Venues", filt: venueFilters}), 
          React.createElement(PickList, {data: campDivisions, category: "divisions", title: "Camp Divisions", filt: divisionFilters}), 
          React.createElement(PickList, {data: artsAreas, category: "artsAreas", title: "Arts Areas", filt: artsAreaFilters})
        )
    );
  }
});

React.render(React.createElement(FilterList, {prefix: "dsk-"}), document.getElementById('filters'));

React.render(React.createElement(FilterList, {prefix: "mob-"}), document.getElementById('filters-mobile'));