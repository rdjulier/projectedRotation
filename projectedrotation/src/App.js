import logo from './logo.svg';
import React from 'react';
import './App.css';

let starters = ['Gerrit Cole', 'Corey Kluber', 'Domingo German', 'Jordan Montgomery', 'Jameson Taillon'];

let currentRotation = starters.map((starter) =>
  <div>{starter}</div>
)

let showRotation = () => {
  document.getElementById('rotation').style.display = '';
}

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      rotation: []
    };
    document.title = 'Projected Rotation';
  }

render() {
  return (
    <div className="App">
      <p>
        The current projected starting rotation for the New York Yankees.
      </p>
      <div onClick={showRotation} style={{ color: 'blue' }}>View Rotation</div>
        <div id='rotation' style={{ display: 'none', marginTop: '10px' }}>
          {currentRotation}
        </div>
      </div>
    );
  }
}

export default App;
