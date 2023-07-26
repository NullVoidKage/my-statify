import React, { Component } from 'react';

class MyComponent extends Component {
  spotifyLoginSection() {
    return (
      <div className="welcome-container">
        <div className='welcome'>
          Welcome to <div className='welcome-chart'>My Statify</div>
        </div>
      </div>
    );
  }
  

  render() {
    return (
      <div>
        {this.spotifyLoginSection()}
        
        {/* Any other methods or JSX can go here */}
      </div>
    );
  }
}

export default MyComponent;
