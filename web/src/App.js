import React from 'react';
import logo from './logo.svg';
import './App.css';
import ConfigEditor from './components/ConfigEditor.js';
import { Container, Row, Col } from 'reactstrap';

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
