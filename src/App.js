import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    venues: []
  }



  componentDidMount() {
    this.getVenues()
    this.renderMap()
  }

  renderMap = () => {
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBgtzCcU3cMjtTQJ03SRVa1-CNoPn7HkpA&callback=initMap')
    window.initMap = this.initMap
  }

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "1FBUUYE1FOUN1FZ14UDOSYY2SAV41CPFIIGGVRKUMZJ3BACC",
      client_secret: "EWZO0YLIZST1NVZOEDIZCECCNWFODUIYVIWXINRDVKJYGAO5",
      query: "coffee",
      near: "Nashville",
      v: "20181002",
      limit: 10
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        })
      })
      .catch(error => {
        console.log("ERROR! " + error);
      })
  }

  initMap = () => {
        var map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
      }


  render() {
    return (
      <main>
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