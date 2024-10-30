import React, { useState } from "react";
import { Select } from "antd";
import axios from "axios";

const { Option } = Select;

const AutocompleteCity = ({ onChange }) => {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);

  const fetchCities = async (searchQuery) => {
    const url = `https://secure.geonames.org/searchJSON?q=${searchQuery}&maxRows=10&username=fertility&country=CA`;
    try {
      const response = await axios.get(url);
      setCities(response.data.geonames);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleSearch = (value) => {
    setQuery(value);
    fetchCities(value);
  };

  const handleSelect = (value) => {
    setQuery(value);
    onChange(value);
  };

  return (
    <Select
      showSearch
      value={query}
      placeholder="Enter city name"
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onSelect={handleSelect}
      notFoundContent={null}
      style={{ width: "100%" }}
      className="custom-select-style"
    >
      {cities.map((city) => (
        <Option key={city.geonameId} value={city.name}>
          {city.name}
        </Option>
      ))}
    </Select>
  );
};

export default AutocompleteCity;
