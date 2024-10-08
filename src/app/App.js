import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import Calculator from '../calculator/Calculator';
import { Button, Link } from '@mui/material';
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {

  return (
    <Router>
      <div className="App">
        <div className='property-menu'>
          <Button variant="contained" href="#/calculator/pinnocksWay">Pinnocks Way</Button>
          <Button variant="contained" href="#/calculator/langleyCl">77 Langley Close</Button>
          <Button variant="contained" href="#/calculator/deneRoad">2 Dene road</Button>
          <Button variant="contained" href="#/calculator/cricketRd">11 Cricket Road</Button>
          <Button variant="contained" href="#/calculator/poplarRoad">13 poplar road</Button>
          <Button variant="contained" href="#/calculator/deneRoad81">81 Dene road</Button>
          <Button variant="contained" href="#/calculator/cowleyRd">455 Cowley Road</Button>
          <Button variant="contained" href="#/calculator/bracegirdle18">18 Bracegirdle</Button>
          <Button variant="contained" href="#/calculator/londonRoad">London Road</Button>
        </div>
        <div>
        </div>
        <div className="">
          <Routes>
            <Route path={`/calculator/:propertyId`} element={<Calculator />}>
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
