import { useState, useEffect } from 'react';
import { Grid, Box } from "@mui/material"
import { sum } from 'lodash';
import { useParams } from 'react-router-dom';
import data, { defaultData } from '../data/data';
import NumberField, { formatNumber } from './NumberField';
import {
    caluclateStampDuty,
    capitalNeeded,
    calculateMortgagePerMonth,
    calculateExpensePerMonth,
    calculateExpensePerYear,
    calculateIncomePerYear,
    calculateProfitPercent,
} from './calc';

const Calculator = ({

}) => {
    const { propertyId } = useParams()

    const [state, setState]  = useState({
        ...defaultData,
        ...data[propertyId]
    });

    useEffect(() => {
        setState({
            ...defaultData,
            ...data[propertyId]
        });
    }, [propertyId])

    const changeValue = (path) => (value) => {
        setState((prev) => ({ ...prev, [path]: value }));
    }
    const changeRoom = (index) => (value) => {
        setState((prev) => {
            const rooms = [...prev.rooms];
            rooms[index] = value;
            return { ...prev, rooms };
        });
    }

    return (<div>
        <h1>{state.name}</h1>
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Box
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                >
                    <h3>Capital</h3>
                    <NumberField value={state?.priceOfProperty} id="priceOfProperty" label="Price of property" onChange={changeValue("priceOfProperty")} />
                    <NumberField value={state?.propertyFees} id="propertyFees" label="Fees" onChange={changeValue("propertyFees")} />
                    <NumberField value={state?.whiteGoods} id="whiteGoods" label="White Goods" onChange={changeValue("whiteGoods")} />
                    <NumberField value={state?.spare} id="spare" label="Renovation" onChange={changeValue("spare")} />
                    <div>
                        <h4>Stamp duty: {formatNumber(caluclateStampDuty(state))}</h4>
                    </div>
                    <div>
                        <h4>Capital Needed: {formatNumber(capitalNeeded(state))}</h4>
                    </div>
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Box
                    sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                >
                    <h3>Expeses</h3>
                    <NumberField value={state?.councilTaxYear} id="councilTaxYear" label="Council tax per year" onChange={changeValue("councilTaxYear")} />
                    <NumberField value={state?.insuranceYear} id="insuranceYear" label="Inusance per year" onChange={changeValue("insuranceYear")} />
                    <NumberField value={state?.internetMonth} id="internetMonth" label="Internet per month" onChange={changeValue("internetMonth")} />
                    <NumberField value={state?.waterYear} id="waterYear" label="Water per year" onChange={changeValue("waterYear")} />
                    <NumberField value={state?.mortgagePercent} id="mortgagePercent" label="Mortgage %" onChange={changeValue("mortgagePercent")} />
                    <NumberField value={state?.mortgageLtv} id="mortgageLtv" label="Mortgage Ltv %" onChange={changeValue("mortgageLtv")} />
                    <NumberField value={state?.boilerServiceYear} id="boilerServiceYear" label="Boiler service" onChange={changeValue("boilerServiceYear")} />
                    <NumberField value={state?.maintinanceYear} id="maintinanceYear" label="Maintinance per year" onChange={changeValue("maintinanceYear")} />
                    <div>
                        <h4>Mortgage per month: {calculateMortgagePerMonth(state)}</h4>
                    </div>
                    <div>
                        <h4>Expense per month: {calculateExpensePerMonth(state)}</h4>
                    </div>
                    <div>
                        <h4>Expense per year: {formatNumber(calculateExpensePerMonth(state) * 12)}</h4>
                    </div>
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Box
                    sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                >
                    <h3>Income</h3>
                    <NumberField value={state?.emptyMonths} id="emptyMonths" label="Empty Months" onChange={changeValue("emptyMonths")} />
                    {
                        state.rooms.map((room, index) => {
                            return <NumberField key={`room${index + 1}`} value={room} id={`room${index + 1}`} label={`Room ${index + 1}`} onChange={changeRoom(index)} />
                        })
                    }
                    <div>
                        <h4>Income per month: {formatNumber(sum(state.rooms))}</h4>
                    </div>
                    <div>
                        <h4>Income per year: {formatNumber(calculateIncomePerYear(state))}</h4>
                    </div>
                </Box>
            </Grid>
            <Grid item xs={3}>
                <h3>Profit</h3>
                <h4>Profit per month: {formatNumber((calculateIncomePerYear(state) - calculateExpensePerYear(state)) / 12)}</h4>
                <h4>Profit per year: {formatNumber(calculateIncomePerYear(state) - calculateExpensePerYear(state))}</h4>
                <h4>Profit %: {calculateProfitPercent(state)}</h4>
                <a href={state.link} target="_blank">{state.link}</a>
            </Grid>
        </Grid>
    </div>)
}

export default Calculator
