import logo from './logo.svg';
import './App.css';
import { createServer } from "miragejs";
import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';


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

class rotationApp extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      rotation: false,
      starterName: '',
      stats: [],
      starterStats: {},
      open: false,
      loaded: false
    };
    document.title = 'Projected Rotation';
  }

  submitValues = {};

  componentWillMount = () => {
    fetch("/api/stats")
      .then((response) => response.json())
      .then((json) => this.setState({ stats: json, loaded: true, starterName: '', starterStats: {} })
    )

    starters = ['Gerrit Cole', 'Corey Kluber', 'Domingo German', 'Jordan Montgomery', 'Jameson Taillon'];
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

  submitPitcher = () => {
    this.submitValues = {};

    for (let key in document.getElementsByTagName('input')) {
      if (document.getElementsByTagName('input')[key].style != undefined) {
        document.getElementsByTagName('input')[key].style.borderColor = '';
      }
    }

    this.submitValues.name = document.getElementById('name').value;
    this.submitValues.record = document.getElementById('record').value;
    this.submitValues.ERA = document.getElementById('ERA').value;
    this.submitValues.image = document.getElementById('image').value;

    if (this.submitValues.name.length == 0) {
      document.getElementsByTagName('input')[0].style.borderColor = 'red';
      alert('Name cannot be blank');
    } else if (this.submitValues.record.length == 0) {
      document.getElementsByTagName('input')[1].style.borderColor = 'red';
      alert('Record cannot be blank');
    } else if (this.submitValues.ERA.length == 0) {
      document.getElementsByTagName('input')[2].style.borderColor = 'red';
      alert('ERA cannot be blank');
    } else if (this.submitValues.image.length == 0) {
      document.getElementsByTagName('input')[3].style.borderColor = 'red';
      alert('Image URL cannot be blank');
    }

    this.state.stats.push(this.submitValues);
    starters.push(this.submitValues.name);
    this.setState({ stats: this.state.stats, open: false })
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

render() {
  return (
      <div className="App">

      <div style={{fontSize: '11px' }}>
        <p>This is a small personal project application designed to showcase various features of ReactJS and NodeJS.</p>
        <p>This single page application starts by having the user click to view the rotation, then select a pitcher of their choice.</p>
        <p>After clicking a pitcher's name, the record and ERA as of the latest update will be displayed. Pitchers can be both added and removed from the rotation.</p>
        <p>This application mainly features React state changes and API calls through a MirageJS backend of hard coded data</p>
        <p>Full code is available on <a href='https://github.com/rdjulier/projectedRotation'>GitHub</a>.</p>
      </div>
      <hr />
        <p>
          The current projected starting rotation for the New York Yankees.
        </p>
        {!this.state.rotation &&
          <div onClick={this.showRotation} style={{ color: 'blue', cursor: 'pointer' }}>View Rotation</div>
        }
        {this.state.rotation && <div onClick={this.showRotation} style={{ color: 'blue', cursor: 'pointer' }}>Hide Rotation</div>}
        {this.state.rotation && <div style={{ marginTop: '10px' }}>To see more information about a pitcher, click on the name.</div>}
        {this.state.rotation && <button className="buttonAdd" onClick={this.onOpenModal}>Add Pitcher</button>}

        <Modal open={this.state.open} onClose={this.onCloseModal}>
          <h2>Add Pitcher</h2>
          <p>
            To add a pitcher to the rotation, fill out the below fields and click submit.
          <p style={{ fontWeight: 'bold' }}>Name: <input id='name' style={{ marginLeft: '35px' }} type='text' /></p>
          <p style={{ fontWeight: 'bold' }}>Record: <input id='record' style={{ marginLeft: '27px' }} type='text' /></p>
          <p style={{ fontWeight: 'bold' }}>ERA: <input id='ERA' style={{ marginLeft: '50px' }} type='number' /></p>
          <p style={{ fontWeight: 'bold' }}>Image URL: <input id='image' style={{ marginLeft: '-1px' }} type='text' /></p>
          </p>
          <p>
            <button className="buttonModal" onClick={this.submitPitcher}>Submit</button>
            <button className="buttonModal" style={{ marginLeft: '5px' }} onClick={this.onCloseModal}>Cancel</button>
          </p>
        </Modal>

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

export default rotationApp;
