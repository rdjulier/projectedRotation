import logo from './logo.svg';
import React from 'react';
import './App.css';
import { createServer } from "miragejs";

let starters = ['Gerrit Cole', 'Corey Kluber', 'Domingo German', 'Jordan Montgomery', 'Jameson Taillon'];

let currentRotation = () => {
  starters.map((starter) =>
    <div>{starter}</div>
  )
}

createServer({
  routes() {
    this.get("/api/stats", () => [
      { name: "Gerrit Cole", record: '6-2', ERA: '1.81'},
      { name: "Corey Kluber", record: '4-3', ERA: '3.04' },
      { name: "Domingo German", record: '4-2', ERA: '3.05' },
      { name: "Jordan Montgomery", record: '2-1', ERA: '4.07' },
      { name: "Jameson Taillon", record: '1-3', ERA: '5.06' }
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
    this.state.rotation ? this.setState({ rotation : false }) : this.setState({ rotation : true })
  }

  currentStats = () => {
    for (let key in this.state.stats) {
      if (this.state.stats[key].name == this.state.starterName) {
        this.setState({ starterStats: this.state.stats[key]})
      }
    }
  }

render() {
  return (
      <div className="App">
        <p>
          The current projected starting rotation for the New York Yankees.
        </p>
        {!this.state.rotation &&
          <div onClick={this.showRotation} style={{ color: 'blue' }}>View Rotation</div>
        }
        {this.state.rotation && <div onClick={this.showRotation} style={{ color: 'blue' }}>Hide Rotation</div>}
        {this.state.rotation && <div style={{ marginTop: '10px' }}>To see more information about a pitcher, click on the name.</div>}
        {this.state.rotation && <div style={{ marginTop: '10px' }}>
          {starters.map((starter) => {
            return <div title={'Click for more details'} style={{ cursor: 'pointer' }} onClick={ () => { this.setState({ starterName: starter }, () => { this.state.loaded && this.currentStats() })}}>{starter}</div>
          })
        }</div>}

        {this.state.starterName != '' &&
          <div>
            <div style={{ marginTop: '50px' }}>Current pitching stats for <span style={{ fontWeight: 'bold' }}>{this.state.starterName}</span>:</div>
            <div style={{ marginTop: '10px' }}>Record: {this.state.starterStats.record}</div>
            <div>ERA: {this.state.starterStats.ERA}</div>
            <div style={{ fontSize: '10px', marginTop: '10px' }}>As of last update</div>
          </div>
        }
      </div>
    );
  }
}

export default App;
