import data from './data';

// mortgageLtv is a percentage (calc.js divides it by 100), so 0.5 would mean a 0.5% mortgage.
test.each(Object.entries(data))('%s has mortgageLtv as a percentage', (_id, property) => {
  expect(property.mortgageLtv).toBeGreaterThanOrEqual(1);
  expect(property.mortgageLtv).toBeLessThanOrEqual(100);
});
