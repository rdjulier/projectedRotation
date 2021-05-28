import logo from './logo.svg';
import React from 'react';
import './App.css';
import { createServer } from "miragejs";

const $ = require('jquery');

let starters = ['Gerrit Cole', 'Corey Kluber', 'Domingo German', 'Jordan Montgomery', 'Jameson Taillon'];

let currentRotation = () => {
  starters.map((starter) =>
    <div>{starter}</div>
  )
}

createServer({
  routes() {
    this.get("/api/stats", () => [
      { name: "Gerrit Cole", record: '6-2', ERA: '1.81', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/32081.png'},
      { name: "Corey Kluber", record: '4-3', ERA: '3.04', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/30981.png' },
      { name: "Domingo German", record: '4-2', ERA: '3.05', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/33660.png' },
      { name: "Jordan Montgomery", record: '2-1', ERA: '4.07', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/38173.png' },
      { name: "Jameson Taillon", record: '1-3', ERA: '5.06', image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/31258.png' }
    ])
  },
})

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      rotation: false,
      starterName: '',
      stats: [],
      starterStats: {},
      loaded: false
    };
    document.title = 'Projected Rotation';
  }

  componentWillMount = () => {
    fetch("/api/stats")
      .then((response) => response.json())
      .then((json) => this.setState({ stats: json, loaded: true })
    )
  }

  showRotation = () => {
    this.state.rotation ? this.setState({ rotation : false, starterName: '' }) : this.setState({ rotation : true }, () => $('#pitchers').hide().fadeIn(), this.componentWillMount())
  }

  currentStats = () => {
    for (let key in this.state.stats) {
      if (this.state.stats[key].name == this.state.starterName) {
        this.setState({ starterStats: this.state.stats[key]})
      }
    }
  }

  removePitcher = () => {
    for (let key in this.state.stats) {
      if (this.state.stats[key].name == this.state.starterName) {
        this.state.stats.splice(key, 1);

        for (let key in document.getElementById('pitchers').children) {
          if (document.getElementById('pitchers').children[key].innerText == this.state.starterName) {
            document.getElementById('pitchers').children[key].style.display = 'none';
          }
        }

        this.setState({ starterStats: this.state.stats[key], starterName: ''})
      }
    }
  }

render() {
  return (
      <div className="App">

      <div style={{fontSize: '11px' }}>
        <p>This is a small personal project application designed to showcase various features of ReactJS and NodeJS.</p>
        <p>This single page application starts by having the user click to view the rotation, then select a pitcher of their choice.</p>
        <p>After clicking a pitcher's name, the record and ERA as of the latest update will be displayed. Click 'Remove' to remove a pitcher from the rotation.</p>
        <p>This application mainly features React state changes and API calls through a MirageJS backend of hard coded data</p>
        <p>Full code is available on <a href='https://github.com/rdjulier/projectedRotation'>GitHub</a>.</p>
      </div>
        <p>
          The current projected starting rotation for the New York Yankees.
        </p>
        {!this.state.rotation &&
          <div onClick={this.showRotation} style={{ color: 'blue', cursor: 'pointer' }}>View Rotation</div>
        }
        {this.state.rotation && <div onClick={this.showRotation} style={{ color: 'blue', cursor: 'pointer' }}>Hide Rotation</div>}
        {this.state.rotation && <div style={{ marginTop: '10px' }}>To see more information about a pitcher, click on the name.</div>}
        {this.state.rotation && <div id='pitchers' style={{ marginTop: '10px' }}>
          {starters.map((starter) => {
            return <div title={'Click for more details'} style={{ cursor: 'pointer' }} onClick={ () => { this.setState({ starterName: starter }, () => { this.currentStats(); $('#stats').hide().fadeIn() })}}>{starter}</div>
          })
        }</div>}

        {this.state.starterName != '' && this.state.starterStats &&
          <div id='stats'>
            <div style={{ marginTop: '20px', fontSize: '12px' }}><span onClick={this.removePitcher} style={{ cursor: 'pointer', color: 'blue' }}>Remove</span> from rotation</div>
            <div style={{ marginTop: '5px' }}>Current pitching stats for <span style={{ fontWeight: 'bold' }}>{this.state.starterName}</span>:</div>
            <div style={{ marginTop: '5px' }}>Record: {this.state.starterStats.record}</div>
            <div>ERA: {this.state.starterStats.ERA}</div>
            <div style={{ fontSize: '10px', marginTop: '10px' }}>As of last update</div>
            <img src={this.state.starterStats.image}/>
          </div>
        }
      </div>
    );
  }
}

export default App;
