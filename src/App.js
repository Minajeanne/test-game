import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { getCanvasPosition } from './utils/formulas';
import Canvas from './components/Canvas';
import * as Auth0 from 'auth0-web';

Auth0.configure({
  domain: 'dev-6o7426cv.auth0.com',
  clientID: 'pB1AeU0vCmhEIP2ZFz7iHQv4uKX0tGDd',
  redirectUri: 'http://localhost:3000/',
  responseType: 'token id_token',
  scope: 'openid profile manage:points',
});

class App extends Component {
  componentDidMount() {
    const self = this;

    Auth0.handleAuthCallback();

    Auth0.subscribe((auth) => {
      console.log(auth);
    });

    setInterval(() => {
        self.props.moveObjects(self.canvasMousePosition);
    }, 10);

    window.onresize = () => {
      const cnv = document.getElementById('test-game-canvas');
      cnv.style.width = `${window.innerWidth}px`;
      cnv.style.height = `${window.innerHeight}px`;
    };
    window.onresize();
  }

  trackMouse(event) {
    this.canvasMousePosition = getCanvasPosition(event);
  }
  render() {
      return (
        <Canvas
          angle={this.props.angle}
          gameState={this.props.gameState}
          startGame={this.props.startGame}
          trackMouse={event => (this.trackMouse(event))}
        />
      );
    }
  }

  App.propTypes = {
    angle: PropTypes.number.isRequired,
    gameState: PropTypes.shape({
      started: PropTypes.bool.isRequired,
      kills: PropTypes.number.isRequired,
      lives: PropTypes.number.isRequired,
      flyingObjects: PropTypes.arrayOf(PropTypes.shape({
        position: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired
        }).isRequired,
        id: PropTypes.number.isRequired,
      })).isRequired,
    }).isRequired,
    moveObjects: PropTypes.func.isRequired,
    startGame: PropTypes.func.isRequired,
  };

  export default App;
