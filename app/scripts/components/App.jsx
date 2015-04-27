var React = require('react');
var mui = require('material-ui');
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var DropDownMenu = mui.DropDownMenu;


var filterOptions = [
{ payload: '1', text: 'All Broadcasts' },
{ payload: '2', text: 'All Voice' },
{ payload: '3', text: 'All Text' },
{ payload: '4', text: 'Complete Voice' },
{ payload: '5', text: 'Complete Text' },
{ payload: '6', text: 'Active Voice' },
{ payload: '7', text: 'Active Text' },
];
var iconMenuItems = [
{ payload: '1', text: 'Download' },
{ payload: '2', text: 'More Info' }
];

var App = React.createClass({
  render: function(){
    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <DropDownMenu menuItems={filterOptions} />
        </ToolbarGroup>
      </Toolbar>
    )
  }
})

module.exports = App;
