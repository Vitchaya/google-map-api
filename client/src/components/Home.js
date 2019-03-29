import React, { Component } from 'react';
import Map from './Map'
class Home extends Component {

	render() {
		return(
			<div style={{ margin: '50px' }}>
				<Map
					google={this.props.google}
					center={{lat: 13.822982, lng: 100.523913}}
					height='300px'
					zoom={15}
				/>
			</div>
		);
	}
}

export default Home;