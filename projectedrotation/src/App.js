import logo from './logo.svg';
import React from 'react';
import './App.css';

let starters = ['Gerrit Cole', 'Corey Kluber', 'Domingo German', 'Jordan Montgomery', 'Jameson Taillon'];

let currentRotation = () => {
  starters.map((starter) =>
    <div>{starter}</div>
  )
}

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      rotation: false,
      starterName: '',
      loaded: false
    };
    document.title = 'Projected Rotation';
  }

  showRotation = () => {
    this.state.rotation ? this.setState({ rotation : false }) : this.setState({ rotation : true })
  }

  componentDidMount = () => {
    this.setState({ loaded: true })
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
        {this.state.rotation && <div style={{ marginTop: '10px' }}>
          {starters.map((starter) => {
            return <div onClick={ () => this.setState({ starterName: starter })}>{starter}</div>
          })
        }</div>}

        {this.state.starterName != '' &&
          <div>
            <div style={{ marginTop: '50px' }}>Current pitching stats for {this.state.starterName}:</div>
            <div>Record: </div>
            <div>ERA: </div>
            <div>As of last update</div>
          </div>
        }
      </div>
    );
  }
}

export default App;
