import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import Calculator from '../calculator/Calculator';
import { Button } from '@mui/material';

function App() {

  const defaultState = {
    priceOfProperty: 500000,
    propertyFees: 2000,
    whiteGoods: 5000,
    spare: 10000,

    councilTaxYear: 2169.23,
    insuranceYear: 600,
    internetMonth: 40,
    waterYear: 600,
    mortgagePercent: 1.8,
    boilerServiceYear: 80,
    maintinanceYear: 1000,

    emptyMonths: 2,
    rooms: [
        600,
        600,
        600,
        500
    ]
  };

  const [state, setState] = useState(defaultState);

  return (
    <div className="App">
      <div className='property-menu'>
        <Button
          variant='contained'
          onClick={() => setState({
            ...defaultState,
            name: "Bulan Road",
            priceOfProperty: 550000,
            rooms: [
              600,
              600,
              600,
              600,
              700
            ],
            spare: 15000,
            link: "https://www.zoopla.co.uk/for-sale/details/60438228/"
          })}>Bulan Road</Button>
          <Button
          variant='contained'
          onClick={() => setState({
            ...defaultState,
            name: "Mogridge Drive",
            priceOfProperty: 495000,
            rooms: [
              600,
              600,
              600,
              600,
              800
            ],
            spare: 0,
            maintinanceYear: 0,
            link: "https://www.zoopla.co.uk/new-homes/details/59843841/"
          })}>Mogridge Drive</Button>
          <Button
          variant='contained'
          onClick={() => setState({
            ...defaultState,
            name: "Yeats close",
            priceOfProperty: 475000,
            rooms: [
              600,
              600,
              600,
              600
            ],
            link: "https://www.zoopla.co.uk/for-sale/details/60452620/"
          })}>Yeats close</Button>
      </div>
      <div>
      </div>
      <div className="">
        <Calculator 
        state={state}
        setState={setState} />
      </div>
    </div>
  );
}

export default App;
