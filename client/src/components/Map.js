import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps"
import Geocode from "react-geocode"
import Autocomplete from 'react-google-autocomplete'
Geocode.setApiKey( "AIzaSyASmzob5Hg6dRgJ_ruMmERBWzOR9uax0Dk" )
Geocode.enableDebug()

class Map extends Component{

	constructor( props ){
		super( props )
		this.state = {
      name: '',
			address: '',
			subdistrict: '',
			district: '',
			state: '',
			mapPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng
			},
			markerPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng
			}
		}
	}
	/**
	 * Get the current address from the default map position and set those values in the state
	 */
	componentDidMount() {
		Geocode.fromLatLng( this.state.mapPosition.lat , this.state.mapPosition.lng ).then(
			response => {
        console.log('res', response)
				const address = response.results[0].formatted_address,
					addressArray =  response.results[0].address_components,
					subdistrict = this.getSubdistrict( addressArray ),
					district = this.getDistrict( addressArray ),
					state = this.getState( addressArray )

				console.log( 'address', subdistrict, district, state )

				this.setState( {
					address: ( address ) ? address : '',
					district: ( district ) ? district : '',
					subdistrict: ( subdistrict ) ? subdistrict : '',
					state: ( state ) ? state : '',
				} )
			},
			error => {
				console.error( error )
			}
		)
	}
	/**
	 * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
	 *
	 * @param nextProps
	 * @param nextState
	 * @return {boolean}
	 */
	shouldComponentUpdate( nextProps, nextState ){
		if (
			this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.address !== nextState.address ||
      this.state.name !== nextState.name ||
			this.state.subdistrict !== nextState.subdistrict ||
			this.state.district !== nextState.district ||
			this.state.state !== nextState.state
		) {
			return true
		} else if ( this.props.center.lat === nextProps.center.lat ){
			return false
		}
	}
	/**
	 * Get the subdistrict and set the subdistrict input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getSubdistrict = ( addressArray ) => {
    console.log('addressArray', addressArray)
		let subdistrict = ''
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0]  ) {
				for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
					if ( 'sublocality_level_2' === addressArray[ i ].types[j] || 'sublocality' === addressArray[ i ].types[j] ) {
						subdistrict = addressArray[ i ].long_name
						return subdistrict
					}
				}
			}
		}
	}
	/**
	 * Get the area and set the area input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getDistrict = ( addressArray ) => {
		let district = ''
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0]  ) {
				for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
					if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
						district = addressArray[ i ].long_name
						return district
					}
				}
			}
		}
	}
	/**
	 * Get the address and set the address input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getState = ( addressArray ) => {
		let state = ''
		for( let i = 0; i < addressArray.length; i++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
					state = addressArray[ i ].long_name
					return state
				}
			}
		}
	}
	/**
	 * And function for city,state and address input
	 * @param event
	 */
	onChange = ( event ) => {
		this.setState({ [event.target.name]: event.target.value })
	}
	/**
	 * This Event triggers when the marker window is closed
	 *
	 * @param event
	 */
	onInfoWindowClose = ( event ) => {

	}

	/**
	 * When the marker is dragged you get the lat and long using the functions available from event object.
	 * Use geocode to get the address, city, area and state from the lat and lng positions.
	 * And then set those values in the state.
	 *
	 * @param event
	 */
	onMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
			newLng = event.latLng.lng()

		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
        console.log('res', response)
				const address = response.results[0].formatted_address,
					addressArray =  response.results[0].address_components,
					subdistrict = this.getSubdistrict( addressArray ),
					district = this.getDistrict( addressArray ),
					state = this.getState( addressArray )
				this.setState( {
					address: ( address ) ? address : '',
					district: ( district ) ? district : '',
					subdistrict: ( subdistrict ) ? subdistrict : '',
					state: ( state ) ? state : ''
				} )
			},
			error => {
				console.error(error)
			}
		)
	}

	/**
	 * When the user types an address in the search box
	 * @param place
	 */
	onPlaceSelected = ( place ) => {
		console.log( 'plc', place )
    const address = place.formatted_address,
      name = place.name,
			addressArray =  place.address_components,
			subdistrict = this.getSubdistrict( addressArray ),
			district = this.getDistrict( addressArray ),
			state = this.getState( addressArray ),
			latValue = place.geometry.location.lat(),
			lngValue = place.geometry.location.lng()
		// Set these values in the state.
		this.setState({
      name: ( name ) ? name : '',
			address: ( address ) ? address : '',
			district: ( district ) ? district : '',
			subdistrict: ( subdistrict ) ? subdistrict : '',
			state: ( state ) ? state : '',
			markerPosition: {
				lat: latValue,
				lng: lngValue
			},
			mapPosition: {
				lat: latValue,
				lng: lngValue
			},
		})
	}


	render(){
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<GoogleMap google={ this.props.google }
            defaultZoom={ this.props.zoom }
            defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
					>
						{/* InfoWindow on top of marker */}
						<InfoWindow
							onClose={this.onInfoWindowClose}
							position={{ lat: ( this.state.markerPosition.lat + 0.0018 ), lng: this.state.markerPosition.lng }}
						>
							<div>
								<span style={{ padding: 0, margin: 0 }}>{ this.state.address }</span>
							</div>
						</InfoWindow>
						{/*Marker*/}
						<Marker google={this.props.google}
              name={'Dolores park'}
              // draggable={true}
              // onDragEnd={ this.onMarkerDragEnd }
              position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
						/>
						<Marker />
						{/* For Auto complete Search Box */}
						<Autocomplete
							style={{
								width: '100%',
								height: '40px',
								paddingLeft: '16px',
								marginTop: '2px',
								marginBottom: '100px'
							}}
							onPlaceSelected={ this.onPlaceSelected }
              types='establishment'
              componentRestrictions={{country: "th"}}
						/>
					</GoogleMap>
				)
			)
		)
		let map
		if( this.props.center.lat !== undefined ) {
			map = <div>
				<div>
          <div className="form-group">
						<label htmlFor="">Place name</label>
						<input type="text" name="name" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.name }/>
					</div>
					<div className="form-group">
						<label htmlFor="">Sub district</label>
						<input type="text" name="subdistrict" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.subdistrict }/>
					</div>
					<div className="form-group">
						<label htmlFor="">District</label>
						<input type="text" name="district" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.district }/>
					</div>
					<div className="form-group">
						<label htmlFor="">State</label>
						<input type="text" name="state" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.state }/>
					</div>
					<div className="form-group">
						<label htmlFor="">Address</label>
						<input type="text" name="address" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.address }/>
					</div>
				</div>

				<AsyncMap
					googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyASmzob5Hg6dRgJ_ruMmERBWzOR9uax0Dk&libraries=places"
					loadingElement={
						<div style={{ height: `100%` }} />
					}
					containerElement={
						<div style={{ height: this.props.height }} />
					}
					mapElement={
						<div style={{ height: `100%` }} />
					}
				/>
			</div>
		} else {
			map = <div style={{height: this.props.height}} />
		}
		return( map )
	}
}
export default Map
