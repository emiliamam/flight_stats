import React, { useState, useEffect } from 'react';
import { NativeSelect, FormControl } from '@material-ui/core';

import { fetchCountries } from '../../api';

import styles from './CountryPicker.module.css';

const Countries = ({ handleCountryChange }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/airports.json');  
        const data = await response.json();
        setCountries(data);
        console.log(data, 'data')
      } catch (error) {
        console.error('Error loading airports:', error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <FormControl className={styles.formControl}>
    <NativeSelect defaultValue="" onChange={(e) => handleCountryChange(e.target.value)}>
      <option value="">Выберите город</option>
      {countries.map((airport, i) => (
        <option key={i} value={airport.IATA}>
          {airport.City} ({airport.Airport})
        </option>
      ))}
    </NativeSelect>
  </FormControl>
  );
};

export default Countries;
