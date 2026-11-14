import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import Calculator from '../calculator/Calculator';
import PropertyPicker from '../properties/PropertyPicker';
import useProperties from '../properties/useProperties';
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  Routes,
  Route,
  useMatch,
} from "react-router-dom";

const PropertyMenu = () => {
  const { properties, loading } = useProperties();
  const match = useMatch('/calculator/:propertyId');
  return (
    <PropertyPicker
      properties={properties}
      loading={loading}
      selectedId={match?.params.propertyId}
      hrefFor={(id) => `#/calculator/${id}`}
    />
  );
};

function App() {

  return (
    <Router>
      <div className="App">
        <div className='property-menu'>
          <PropertyMenu />
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
