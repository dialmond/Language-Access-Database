import React, { useEffect, useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

const SHEET_ID = "16UtlJFycIEUffjiRWpJymOkRGsJjq15W-UhFkBnwxw4";
const API_KEY = "AIzaSyBUx1B1zDWEUhMINgyZnPRuK63yJsta_vU"; // Need to actually add proper API key.
const RANGE = "Data!A:AD"; // Put areas to include in visualization. Update if columns and rows change.

const TimelineApp = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ category: "" });
  const timelineRef = React.createRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
        );
        const result = await response.json();
        const headers = result.values[0]; // First row as categories
        const rows = result.values.slice(1).map((row, index) => ({
          id: index,
          content: row[1], // Event Name
          start: row[8], // Start Date from Column I
          end: row[9], // End Date from Column J
          category: headers[3] ? row[3] : "", // Metadata for filtering based on header
        }));
        setData(rows);
        setFilteredData(rows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (timelineRef.current && filteredData.length) {
      const container = timelineRef.current;
      new Timeline(container, filteredData, {});
    }
  }, [filteredData]);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilters({ category: value });
    setFilteredData(value ? data.filter((d) => d.category === value) : data);
  };

  return (
    <div>
      <h1>Google Sheets Timeline</h1>
      <label>Filter by Category:</label>
      <select onChange={handleFilterChange}>
        <option value="">All</option>
        {[...new Set(data.map((d) => d.category))].map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <div ref={timelineRef} style={{ height: "500px" }}></div>
    </div>
  );
};

export default TimelineApp;

