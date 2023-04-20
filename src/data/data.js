
export const defaultData = {
  priceOfProperty: 500000,
  propertyFees: 2000,
  whiteGoods: 5000,
  spare: 10000,

  councilTaxYear: 2169.23,
  insuranceYear: 700,
  internetMonth: 40,
  waterYear: 600,
  mortgagePercent: 5,
  mortgageLtv: 50,
  boilerServiceYear: 80,
  maintinanceYear: 2000,

  emptyMonths: 1,
  rooms: [
      600,
      600,
      600,
      500
  ]
}

const data = {
  "pinnocksWay": {
    ...defaultData,
    name: "Pinnocks way",
    priceOfProperty: 365000,
    rooms: [
      680,
      650,
      600
    ],
    spare: 0,
    whiteGoods: 0,
    propertyFees: 0,
    mortgagePercent: 1.6,
  },
  langleyCl: {
    ...defaultData,
    name: "77 Langley close",
    priceOfProperty: 450000,
    rooms: [
      600,
      600,
      600,
      600,
      500
    ],
    link: "https://www.zoopla.co.uk/for-sale/details/53768724/",
    spare: 50000
  },
  deneRoad: {
    ...defaultData,
    name: "2 Dene road",
    priceOfProperty: 425000,
    rooms: [
      500,
      500,
      500,
      500
    ],
    link: "https://www.zoopla.co.uk/for-sale/details/60588847/",
    spare: 10000
  },
  cricketRd: {
    ...defaultData,
    name: "11 Cricket road",
    priceOfProperty: 500000,
    rooms: [
      600,
      600,
      600,
      550
    ],
    link: "https://www.zoopla.co.uk/for-sale/details/60645737/?search_identifier=6d2ef058666e20016a56de9f44f00bd8",
    spare: 50000
  },
  cowleyRd: {
    ...defaultData,
    name: "455 Cowley Road",
    priceOfProperty: 450000,
    rooms: [
      650,
      650,
      650,
      650
    ],
    link: "https://www.zoopla.co.uk/for-sale/details/62864203/?search_identifier=27391afbce5088b53272b295f23905f7",
    spare: 80000
  },
  poplarRoad: {
    ...defaultData,
    name: "13 Poplar road",
    priceOfProperty: 350000,
    rooms: [
      550,
      550,
      500,
    ],
    link: "https://www.zoopla.co.uk/for-sale/details/60664531/",
    spare: 50000
  },
  deneRoad81: {
    ...defaultData,
    priceOfProperty: 450000,
    name: "81 Dene road",
    rooms: [
      500,
      500,
      500,
      500
    ],
    link: "https://www.zoopla.co.uk/for-sale/details/60664645/",
    spare: 20000
  },
  bracegirdle18: {
    ...defaultData,
    priceOfProperty: 325000,
    name: "18 Bracegirdle Rd",
    emptyMonths: 0,
    councilTaxYear: 0,
    waterYear: 0,
    internetMonth: 0,
    whiteGoods: 0,
    boilerServiceYear: 0,
    mortgagePercent: 6.19,
    emptyMonths: 11,
    rooms: [
      17500
    ],
    link: "https://www.rightmove.co.uk/properties/131007605",
    spare: 0
  },
  bracegirdle18b: {
    ...defaultData,
    priceOfProperty: 325000,
    name: "18 Bracegirdle Rd",
    emptyMonths: 0,
    councilTaxYear: 0,
    waterYear: 0,
    internetMonth: 0,
    whiteGoods: 0,
    boilerServiceYear: 0,
    mortgagePercent: 6.19,
    mortgageLtv: 0.5,
    emptyMonths: 1,
    rooms: [
      500,
      500,
      500,
      500
    ],
    link: "https://www.rightmove.co.uk/properties/131007605",
    spare: 0
  }
}

export default data;
