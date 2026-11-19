import { sum, clamp, round } from 'lodash';

// The calculator's sums, shared by the calculator page and the property picker.

// England's residential stamp duty bands from 1 April 2025: [from, to, rate] on the part of the price
// in each band.
const STAMP_DUTY_BANDS = [
    [0, 125000, 0.00],
    [125000, 250000, 0.02],
    [250000, 925000, 0.05],
    [925000, 1500000, 0.10],
    [1500000, Infinity, 0.12],
];
// The surcharge on an additional property (buy-to-let), on the whole price, from 31 October 2024.
const ADDITIONAL_PROPERTY_SURCHARGE = 0.05;

export const caluclateStampDuty = (state) => {
    const priceOfProperty = state.priceOfProperty || 0;

    const stampDutys = STAMP_DUTY_BANDS.map(([from, to, rate]) =>
        clamp(priceOfProperty - from, 0, to - from) * rate
    );

    return round(sum(stampDutys) + priceOfProperty * ADDITIONAL_PROPERTY_SURCHARGE, 2);
}

export const capitalNeeded = (state) => {
    return sum([
        state.priceOfProperty * (1 - (state.mortgageLtv/100)),
        caluclateStampDuty(state),
        state.whiteGoods,
        state.spare,
        state.propertyFees
    ]);
}

export const calculateMortgagePerMonth = (state) => {
    const priceOfProprty = state.priceOfProperty || 0;
    return round((priceOfProprty * (state.mortgageLtv/100) * (state.mortgagePercent / 100)) / 12, 2);
}
export const calculateExpensePerMonth = (state) => {
    return round(sum([
        state.councilTaxYear / 12,
        state.insuranceYear / 12,
        state.internetMonth,
        state.waterYear / 12,
        calculateMortgagePerMonth(state),
        state.boilerServiceYear / 12,
        state.maintinanceYear / 12
    ]), 2);
}
export const calculateExpensePerYear = (state) => {
    return round(calculateExpensePerMonth(state) * 12, 2);
}

export const calculateIncomePerYear = (state) => {
    return (sum(state.rooms) * (12 - state.emptyMonths));
}

export const calculateProfitPerYear = (state) => calculateIncomePerYear(state) - calculateExpensePerYear(state)

export const calculateProfitPercent = (state) => {
    return round((calculateProfitPerYear(state) / capitalNeeded(state)) * 100, 2);
}
