import logo from './logo.svg';
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
  useMatch,
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

// Header menu. The current page's item is underlined.
const MenuItem = ({ to, children }) => {
  const active = !!useMatch(to);
  return (
    <Button
      href={`#${to}`}
      aria-current={active ? 'page' : undefined}
      sx={{
        fontWeight: 600,
        borderRadius: 0,
        borderBottom: 2,
        borderColor: active ? 'primary.main' : 'transparent',
      }}
    >
      {children}
    </Button>
  );
};

function App() {

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <a href="#/" className="App-brand">
            <img src={logo} className="App-logo" alt="pic logo" />
            <span className="App-title">Property Investment Calculator</span>
          </a>
          <nav className="App-nav" aria-label="Main">
            <MenuItem to="/">Properties</MenuItem>
          </nav>
        </header>
        <div className="">
          <Routes>
            <Route path="/" element={<PropertiesPage />} />
            <Route path={`/calculator/:propertyId`} element={<Calculator />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
