import React, { useState,useMemo } from 'react';
import ReactSelect from 'react-select';
import countryList from 'react-select-country-list';

function CountrySelector() {
    const [value,setValue] = useState('')
    const options = useMemo(() => countryList().getData(), [])

    const changeHandler = value => {
        setValue(value)
    }

    return <ReactSelect options={options} value={value} onChange={changeHandler} />
}

export default CountrySelector

