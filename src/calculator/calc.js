import { sum, clamp, round } from 'lodash';

// The calculator's sums, shared by the calculator page and the property picker.

export const caluclateStampDuty = (state) => {
    const priceOfProperty = state.priceOfProperty || 0;

    const stampDutys = [
        clamp(priceOfProperty - 125000, 0, 125000) * 0.00,
        clamp(priceOfProperty - 250000, 0, 670000) * 0.05,
        clamp(priceOfProperty - 925000, 0, 575000) * 0.10,
        clamp(priceOfProperty - 1500000, 0, Number.MIN_SAFE_INTEGER) * 0.20,
        priceOfProperty * 0.05
    ]

    return sum(stampDutys);
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
