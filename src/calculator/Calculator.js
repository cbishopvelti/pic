import { useState, useEffect } from 'react';
import { Grid, TextField, Box } from "@mui/material"
import { sum, set } from 'lodash';
import { useParams } from 'react-router-dom';
import data, { defaultData } from '../data/data';
import {
    caluclateStampDuty,
    capitalNeeded,
    calculateMortgagePerMonth,
    calculateExpensePerMonth,
    calculateExpensePerYear,
    calculateIncomePerYear,
    calculateProfitPercent,
} from './calc';

const formatNumber = (number) => {
    if (number === undefined) {
        return "";
    }
    return number.toLocaleString();
}

const Calculator = ({

}) => {
    const { propertyId } = useParams()

    const [state, setState]  = useState({
        ...defaultData,
        ...data[propertyId]
    });

    useEffect(() => {
        setState(data[propertyId]);
    }, [propertyId])

    const changeValue = (path, isFloat = false) => (event) => {

        const newValue = isFloat ? parseFloat(event.target.value.replace(/,/g, '')) : parseInt(event.target.value.replace(/,/g, ''));
        console.log("001", newValue)
        setState(
            {
                ...state,
                [path]: isNaN(newValue) ? event.target.value : newValue
            }
        )
    }
    const changeValueDeep = (path) => (event) => {
        const newValue = parseInt(event.target.value.replace(/,/g, ''));
        const value = (isNaN(newValue) ? event.target.value : newValue);
        set(state, path, value);
        setState(
            {...state}
        );
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
                    <TextField value={(formatNumber(state?.priceOfProperty))} id="priceOfProperty" label="Price of property" onChange={changeValue("priceOfProperty")} />
                    <TextField value={(formatNumber(state?.propertyFees))} id="propertyFees" label="Fees" onChange={changeValue("propertyFees")} />
                    <TextField value={(formatNumber(state?.whiteGoods))} id="whiteGoods" label="White Goods" onChange={changeValue("whiteGoods")} />
                    <TextField value={(formatNumber(state?.spare))} id="spare" label="Renovation" onChange={changeValue("spare")} />
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
                    <TextField value={(formatNumber(state?.councilTaxYear))} id="councilTaxYear" label="Council tax per year" onChange={changeValue("councilTaxYear")} />
                    <TextField value={(formatNumber(state?.insuranceYear))} id="insuranceYear" label="Inusance per year" onChange={changeValue("insuranceYear")} />
                    <TextField value={(formatNumber(state?.internetMonth))} id="internetMonth" label="Internet per month" onChange={changeValue("internetMonth")} />
                    <TextField value={(formatNumber(state?.waterYear))} id="waterYear" label="Water per year" onChange={changeValue("waterYear")} />
                    <TextField value={(formatNumber(state?.mortgagePercent))} id="mortgagePercent" label="Mortgage %" onChange={changeValue("mortgagePercent", true)} />
                    <TextField value={(formatNumber(state?.mortgageLtv))} id="mortgageLtv" label="Mortgage Ltv %" onChange={changeValue("mortgageLtv", true)} />
                    <TextField value={(formatNumber(state?.boilerServiceYear))} id="boilerServiceYear" label="Boiler service" onChange={changeValue("boilerServiceYear")} />
                    <TextField value={(formatNumber(state?.maintinanceYear))} id="maintinanceYear" label="Maintinance per year" onChange={changeValue("maintinanceYear")} />
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
                    <TextField value={(formatNumber(state?.emptyMonths))} id="emptyMonths" label="Empty Months" onChange={changeValue("emptyMonths")} />
                    {
                        state.rooms.map((room, index) => {
                            return <TextField key={`room${index + 1}`} value={(formatNumber(room))} id={`room${index + 1}`} label={`Room ${index + 1}`} onChange={changeValueDeep(`rooms[${index}]`)} />
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
