/**
 * Created by smithmd on 8/7/15.
 */
var ListItem = React.createClass({
  render: function () {
    return (
        <li onClick={this.props.updateSelected}>
          <input readOnly='readonly' type='checkbox' id={this.props.category + this.props.index}
                 name={this.props.category + this.props.index}
                 checked={this.props.selected.indexOf(this.props.index) > -1 ? 'checked' : ''}/>
          <label>{this.props.label}</label>
        </li>
    );
  }
});

var PickList = React.createClass({
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
    this.setState({selected: arr});

    var tmp = [];
    for (var it = 0; it < arr.length; it++) {
      tmp.push(this.props.data[arr[it]]);
    }
    var obj = {};
    obj[this.props.category] = tmp;
    filter.onNext(obj);
  },
  render: function () {
    var component = this;
    var list = null;

    if (!this.state.hidden) {
      var checkboxes = this.props.data.map(function (item, index) {
        return (
            <ListItem key={index} index={index} label={item}
                      selected={component.state.selected} category={component.props.category}
                      updateSelected={component.handleClickChild.bind(component, index, component.props.filter)}/>
        );
      });
      list = <ul>{checkboxes}</ul>;
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
        <li className='pickList'>
          <span onClick={this.handleMainClick}>{title}</span>
          {list}
        </li>
    );
  }
});

var FilterList = React.createClass({
  render: function () {
    return (
        <ul>
          <li>
            <span>
              <input id="dailyFilter" type="checkbox" name="dailyFilter" onchange="filterClick()"/>
              <label htmlFor="dailyFilter">Daily Events</label>
            </span>
          </li>
          <li>
            <span>
              <input id="performanceFilter" type="checkbox" name="performanceFilter" onchange="filterClick()"/>
              <label htmlFor="performanceFilter">Performances</label>
            </span>
          </li>
          <li>
            <span>
              <input id="datepicker" name="datepicker" placeholder="Custom Date"/>
            </span>
          </li>
          <PickList data={venues} category='venues' title='Venues' filter={venueFilters}/>
          <PickList data={campDivisions} category='divisions' title='Camp Divisions' filter={divisionFilters}/>
          <PickList data={artsAreas} category='artsAreas' title='Arts Areas' filter={artsAreaFilters}/>
        </ul>
    );
  }
});

React.render(<FilterList />, document.getElementById('filters'));