'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import customdata from './data.json';

var ClientData = React.createClass({
	componentDidMount: function() {
		console.log("success",customdata);
		if(1 == 2){
			console.log('no')
		}
		
		moo = 1;
	},
	render: function() {
		return (
			<div>	
				<h1 className="success">Success 1</h1>
			</div>
		);
	}
});

ReactDOM.render(
	<ClientData/>,document.getElementById('react')
);