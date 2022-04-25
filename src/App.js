import React, { Component } from 'react';
import { Routes, Route } from "react-router-dom"
import './App.css';


import Homepage from "./components/Homepage/Homepage"
import UIDebug from "./components/UIDebug/UIDebug"
import ManualHandling from "./components/ManualHandling/ManualHandling"
import TrainingData from './components/TrainingData/TrainingData';

class App extends Component {

  render() {
    return (
      <div>
        <Routes>
              <Route exact path = "/" element = { <Homepage /> } />
              <Route path = "uidebug" element = { <UIDebug /> } />
              <Route path ="manualhandling" element={ <ManualHandling /> } />
			  <Route path = "trainingdata" element={ <TrainingData />} />
          </Routes>
      </div>
    )
  }
}

export default App;