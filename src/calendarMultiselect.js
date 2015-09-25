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
            <ListItem key={'li'+index} index={index} label={item}
                      selected={component.state.selected} category={component.props.category}
                      updateSelected={component.handleClickChild.bind(component, index, component.props.filt)}/>
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
          <span onClick={this.handleMainClick}>
            {title}
            <div className='bg-img'></div>
          </span>
          {list}
        </li>
    );
  }
});

var FilterList = React.createClass({
  filterClick: function () {
    dailyFilter.onNext(document.getElementById(this.props.prefix + 'dailyFilter').checked);
    performanceFilter.onNext(document.getElementById(this.props.prefix + 'performanceFilter').checked);
    expandAll.onNext(document.getElementById(this.props.prefix + 'expand').checked);

  },
  render: function () {
    return (
        <ul className='filterList'>
          <li>
            <span onClick={this.filterClick}>
              <input id={this.props.prefix + "dailyFilter"} type="checkbox" name="dailyFilter"/>
              <label htmlFor={this.props.prefix + "dailyFilter"}>Daily Events</label>
            </span>
          </li>
          <li>
            <span onClick={this.filterClick}>
              <input id={this.props.prefix + "performanceFilter"} type="checkbox" name="performanceFilter" />
              <label htmlFor={this.props.prefix + "performanceFilter"}>Performances</label>
            </span>
          </li>
          <li>
            <span onClick={this.filterClick}>
              <input id={this.props.prefix + "expand"} type="checkbox" name="expandAll" />
              <label htmlFor={this.props.prefix + "expand"}>Expand All</label>
            </span>
          </li>
          <li>
            <span>
              <input id={this.props.prefix + "datepicker"} name={this.props.prefix + "datepicker"} placeholder="Custom Date"/>
            </span>
          </li>
          <PickList data={venues} category='venues' title='Venues' filt={venueFilters}/>
          <PickList data={campDivisions} category='divisions' title='Camp Divisions' filt={divisionFilters}/>
          <PickList data={eventTypes} category='eventTypes' title='Event Types' filt={eventTypesFilters}/>
        </ul>
    );
  }
});

React.render(<FilterList prefix='dsk-'/>, document.getElementById('filters'));

React.render(<FilterList prefix='mob-'/>, document.getElementById('filters-mobile'));