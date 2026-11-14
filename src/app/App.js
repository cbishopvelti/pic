import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import Calculator from '../calculator/Calculator';
import PropertyPicker from '../properties/PropertyPicker';
import useProperties from '../properties/useProperties';
import { Box, Button, Typography } from '@mui/material';
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// The home page: every property as a card. Picking one opens its calculator.
const PropertiesPage = () => {
  const { properties, loading } = useProperties();
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', textAlign: 'left' }}>
      <Typography variant="h5" component="h1" fontWeight={700} sx={{ px: 2, pt: 3 }}>
        Properties
      </Typography>
      <PropertyPicker
        properties={properties}
        loading={loading}
        hrefFor={(id) => `#/calculator/${id}`}
      />
    </Box>
  );
};

const CalculatorPage = () => (
  <>
    <Box sx={{ textAlign: 'left', px: 2, pt: 2 }}>
      <Button href="#/" startIcon={<span aria-hidden="true">←</span>}>
        All properties
      </Button>
    </Box>
    <Calculator />
  </>
);

function App() {

  return (
    <Router>
      <div className="App">
        <div className="">
          <Routes>
            <Route path="/" element={<PropertiesPage />} />
            <Route path={`/calculator/:propertyId`} element={<CalculatorPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
