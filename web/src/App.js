import React from 'react';
import './App.css';
import ConfigEditor from './components/ConfigEditor.js';
import { Container } from 'reactstrap';

function App() {
  return (
    <div className="App">
      <div className="top">
        <Container>
          <h3>Proxy configuration</h3>
        </Container>
      </div>
      <Container>
        <ConfigEditor />
      </Container>
    </div>
  );
}

export default App;
