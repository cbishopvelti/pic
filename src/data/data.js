
export const defaultData = {
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
}

const data = {
  "pinnocksWay": {
    ...defaultData,
    name: "Pinnocks way",
    priceOfProperty: 365000,
    rooms: [
      600,
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
  }
}

export default data;
