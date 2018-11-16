import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Sidebar from './component/Sidebar';

class App extends Component {

  state = {
    venues: []
  }

  componentDidMount() {
    this.getVenues()
  }

  renderMap = () => {
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBgtzCcU3cMjtTQJ03SRVa1-CNoPn7HkpA&callback=initMap')
    window.initMap = this.initMap
  }

  getVenues = () => {
    // Geolocation 2, needs to be passed to `ll`
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.")
    }

    function showPosition(position) {
      console.log(position.coords.latitude, position.coords.longitude);
    }
      const endPoint = "https://api.foursquare.com/v2/venues/explore?"
      const parameters = {
        client_id: "1FBUUYE1FOUN1FZ14UDOSYY2SAV41CPFIIGGVRKUMZJ3BACC",
        client_secret: "EWZO0YLIZST1NVZOEDIZCECCNWFODUIYVIWXINRDVKJYGAO5",
        query: "coffee",
        v: "20181002",
        // this needs to be the geolocation from below instead of hard-coded 
        // ll: `36.55,-88.88`,
        near: "Nashville, TN", 
        limit: 25
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.renderMap())                   // We ask React to render our map here, after it has looped the marker data, as opposed to inside of componentDidMount
      })
      .catch(error => {
        console.log("ERROR! " + error);
      })
    console.log(endPoint + new URLSearchParams(parameters));
  }

  initMap = () => {
    // Create a Google Map
    var map = new window.google.maps.Map(document.getElementById('map'), {
      // center: { lat: 26.16, lng: -86.78 },
      zoom: 12
    });

    // Create InfoWindow (outside the loop!)
    var infowindow = new window.google.maps.InfoWindow();

    const position = (pos) => {
      // var crd = pos.coords;
      var crd = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }

      console.log('Your current position is:');
      console.log(`Latitude : ${crd.lat}`);
      console.log(`Longitude: ${crd.lng}`);
      console.log(`More or less ${crd.accuracy} meters.`);
      // suuccessfully sets the map center to geolocation - needs to also set `ll` inside `getVenues`
      // console.log(map.setCenter(crd));
      map.setCenter(crd);
      console.log(`Zoom: ${map.zoom}`)
    }

    // The position callback is therefore the right place from where to call getVenues and pass it the coordinates.  https://stackoverflow.com/questions/53330310/how-to-get-value-from-inside-one-method-to-another-in-same-class?noredirect=1#comment93540945_53330310
    navigator.geolocation.getCurrentPosition(position);
    // navigator.geolocation.getVenues(position.crd);


    // Looping over venues inside our state
    this.state.venues.map(myVenue => {
      var contentString = `${myVenue.venue.name}`;
      // Create Marker
      var marker = new window.google.maps.Marker({
        position: { lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng },
        map: map,
        title: myVenue.venue.name
      });
      // Listen for click
      marker.addListener('click', function () {
        // Change the content
        infowindow.setContent(contentString);
        // Open InfoWindow
        infowindow.open(map, marker);
      });
    })
  }


  render() {
    return (
      <main className="App">
        <Sidebar {...this.state} />
        <div id="map"></div>
      </main>

    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)

}

export default App;