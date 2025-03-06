import React, { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import { Timeline } from "vis-timeline/standalone";
import './Timeline.css';


const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3u5fcAva6Kfvn_b-i6HP1DYhbjDjSnOTfMnAH-KiaDJRHQcIquizOpSfrkVRsIcugG1MmutirHftr/pub?gid=0&single=true&output=csv"; // Replace with the actual URL

const TimelineApp = () => {
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [states, setStates] = useState([]);
  const [policyTypes, setPolicyTypes] = useState([]);
  const [policyStatuses, setPolicyStatuses] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPolicyType, setSelectedPolicyType] = useState("");
  const [selectedPolicyStatus, setSelectedPolicyStatus] = useState("");

  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const comparisonRef = useRef(null);

  // GET THE DATA
  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            //convert dates to ISO
            const convertedData = result.data.map((item) => {
              const updatedItem = { ...item };
              updatedItem["start"] = null;
              updatedItem["end"] = null;

              if (updatedItem["First Day of Action"] && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(updatedItem["First Day of Action"])) {
                const [month, day, year] = updatedItem["First Day of Action"].split('/');
                updatedItem["start"] = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                delete updatedItem["First Day of Action"]; // Remove the old key
              }
              if (updatedItem["Last day active"] && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(updatedItem["Last day active"])) {
                const [month, day, year] = updatedItem["Last day active"].split('/');
                updatedItem["end"] = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                delete updatedItem["Last day active"]; // Remove the old key
              }
              return updatedItem;
            });

            // get states, policy types, and status as filterable values
            const uniqueStates = [...new Set(result.data.map((item) => item.State).filter(Boolean))];
            const uniquePolicyTypes = [...new Set(result.data.map((item) => item["Type of Government"]).filter(Boolean))];
            const uniquePolicyStatuses = [...new Set(result.data.map((item) => item.Status).filter(Boolean))];
            setStates(uniqueStates);
            setPolicyTypes(uniquePolicyTypes);
            setPolicyStatuses(uniquePolicyStatuses);

            // set the data...
            setData(convertedData);
          },
        });
      } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
      }
    };
    fetchCsv();
  }, []);

  // CREATE THE TIMELINE
  useEffect(() => {
    if (containerRef.current && timelineRef.current === null) {
      console.log('making timeline!!');
      const options = {
        stack: true,
        verticalScroll: true,
        horizontalScroll: true,
        zoomKey: "ctrlKey",
        start: "1970-01-01",
        end: "2026-01-01",
        orientation: "both",
        zoomMin: 1000 * 60 * 60 * 240,
      };
      const timeline = new Timeline(containerRef.current);
      timeline.setOptions(options);
      timelineRef.current = timeline;
    }
  }, []);

  // ONCLICK EVENT, for ITEM COMPARISON
  const doCompare = (e, data) => {
    var itemId = e.item;
    var target = e.event.target;
    if (itemId === null || !comparisonRef.current || comparisonRef.current.classList.contains(itemId))
      return;
    const newDiv = document.createElement('div');
    target.classList.add('selected');

    // the new div container gets all classes of the vis item
    var targetParent = target.closest(".vis-item");
    if (targetParent) {
      targetParent.classList.forEach((c) => {
        if (['vis-item', 'vis-range', 'vis-selected', 'vis-readonly'].indexOf(c) === -1) {
          newDiv.classList.add(c)
        }
      });
    }

    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.classList.add("close-btn");
    closeButton.addEventListener('click', () => {
      newDiv.remove();
      target.classList.remove('selected');
      comparisonRef.current.classList.remove(itemId);
    });
    newDiv.appendChild(closeButton);
    // ^close the new div

    var entry = data[itemId];
    Object.entries(entry).forEach(([key, value]) => {
      const header = document.createElement('b');
      header.innerText = key;
      newDiv.appendChild(header);

      const paragraph = document.createElement('p');
      paragraph.innerText = value;
      newDiv.appendChild(paragraph);
    });
    //^ populate the new div with text from the data

    comparisonRef.current.appendChild(newDiv);
    comparisonRef.current.classList.add(itemId);
    // ^hack to prevent you from adding same item twice
  };

  // SET THE FILTERED DATA
  useEffect(() => {
    let filtered = data;
    filtered = filtered.filter((item) => item["start"] && item["end"]);

    if (selectedState)
      filtered = filtered.filter((item) => item.State === selectedState);
    if (selectedPolicyType)
      filtered = filtered.filter((item) => item["Type of Government"] === selectedPolicyType);
    if (selectedPolicyStatus)
      filtered = filtered.filter((item) => item.Status === selectedPolicyStatus);
    setFilteredData(filtered);
  }, [selectedState, selectedPolicyType, selectedPolicyStatus, data]);

  // UPDATE THE TIMELINE WITH DATA
  useEffect(() => {
    let filtered = filteredData.filter((item) => item["start"] && item["end"]);
    var groups = [ ...policyTypes];
    groups.push('Unknown');
    const items = filtered.map((item, index) => ({
      id: index,
      content: item.Policy,
      start: item["start"],
      end: item["end"],
      group: groups.indexOf(item["Type of Government"] || "Unknown"), //group items based on federal project status
      className: item.Status, // color items based on status
    }));
    groups = groups.map((item, index) => ({id: index, content: item,}));

    if (timelineRef.current) {
      console.log('setting timeline datsetting timeline dataa!');
      var timeline = timelineRef.current;

      timeline.setItems(items);
      timeline.setGroups(groups); // set items and groups

      // on click, do comparisons
      timeline.off("click");
      timeline.on("click", function (e) {
        doCompare(e, filtered);
      });
    }
  }, [filteredData, policyTypes]);


  return (
    <div class="appWrapper">
      <div className="timelineWrapper">
        <div className="selectWrapper">
          <select onChange={(e) => setSelectedState(e.target.value)}>
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <select onChange={(e) => setSelectedPolicyStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {policyStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select onChange={(e) => setSelectedPolicyType(e.target.value)}>
            <option value="">All Policy Types</option>
            {policyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div ref={containerRef}></div>
      </div>
      <div ref={comparisonRef} className="comparisonWrapper"></div>
    </div>
  );
};


export default TimelineApp;

