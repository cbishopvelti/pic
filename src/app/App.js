import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import Calculator from '../calculator/Calculator';
import { Button, Link } from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {

  return (
    <Router>
      <div className="App">
        <div className='property-menu'>
          <Button variant="contained" href="/pic/calculator/pinnocksWay">Pinnocks Way</Button>
          <Button variant="contained" href="/pic/calculator/langleyCl">77 Langley Close</Button>
        </div>
        <div>
        </div>
        <div className="">
          <Routes>
            <Route path={`/pic/calculator/:propertyId`} element={<Calculator />}>
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
