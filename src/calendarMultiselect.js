/**
 * Created by smithmd on 8/7/15.
 */
var ListItem = React.createClass({
  render: function () {
    return (
        <li>
          <input type='checkbox' id={this.props.category + this.props.index} name={this.props.category + this.props.index}/>
          <label htmlFor={this.props.category + this.props.index}>{this.props.label}</label>
        </li>
    );
  }
});

var PickList = React.createClass({
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
            <ListItem category={component.props.category} index={index} label={item} />
        );
      });
      list = <ul>{checkboxes}</ul>;
    }
    return (
        <div className='pickList'>
          <span onClick={this.handleMainClick}>{this.props.title}</span>
          {list}
        </div>
    );
  }
});

var MultiSelects = React.createClass({
  render: function () {
    return (
        <PickList data={campDivisions} category='division' title='Camp Divisions' />
    );
  }
});

React.render(<MultiSelects />, document.getElementById('multiselects'));