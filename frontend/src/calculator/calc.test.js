import { caluclateStampDuty } from './calc';

// Worked examples: the bands, plus the 5% additional property surcharge on the whole price.
test.each([
  [0, 0],
  [100000, 5000],                                   // 0 + 5,000
  [250000, 2500 + 12500],                           // 2% of 125k
  [325000, 2500 + 3750 + 16250],                    // + 5% of 75k
  [1000000, 2500 + 33750 + 7500 + 50000],           // + 5% of 675k, 10% of 75k
  [2000000, 2500 + 33750 + 57500 + 60000 + 100000], // + 10% of 575k, 12% of 500k
])('stamp duty on £%i is £%i', (price, expected) => {
  expect(caluclateStampDuty({ priceOfProperty: price })).toBe(expected);
});

test('no price means no stamp duty', () => {
  expect(caluclateStampDuty({})).toBe(0);
});
