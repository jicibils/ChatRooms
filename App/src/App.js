import React from 'react';
import RootRoutes from 'routes/rootRoutes';

import './App.scss';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <RootRoutes />
      </div>
    );
  }
}

export default App;
