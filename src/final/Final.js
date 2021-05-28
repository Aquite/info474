import React, { useState } from "react";
import { useFetch } from "./hooks/useFetch";
import { scaleLinear } from "d3-scale";
import { group, mean } from "d3-array";
import { scaleTime } from "@vx/scale";
import { AxisBottom, AxisLeft } from "@vx/axis";
import WorldMap from "./components/WorldMap.js";
import ReactTooltip from "react-tooltip";
import { groupings, badCodes } from "./Groupings.js";
import ControlGroups from "./components/ControlGroups.js";
import Barcode from "./components/Barcode.js";
import Timeline from "./components/Timeline.js";

const Final = () => {
  const [data, loading] = useFetch(
    "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/social-protection-and-labor/social-protection-and-labor.csv"
  );

  // Use `if highlight.has(c["Country Code"])` to test wether or not to highlight your country
  // Do not use setHighlight because you won't do it properly. See the below function
  const [highlight, setHighlight] = useState(new Set(groupings[0].codes));

  // Use this to toggle the highlight by calling toggleHighlight(c) like if someone clicks on a specific thing.
  const toggleHighlight = (c) => {
    if (c != null) {
      if (highlight.has(c["Country Code"])) {
        highlight.delete(c["Country Code"]);
        setHighlight(new Set(highlight));
      } else {
        setHighlight(new Set(highlight.add(c["Country Code"])));
      }
    }
  };

  // Use this with onMouseEnter and onMouseLeave to highlight areas you want
  const [tooltipContent, setTooltipContent] = useState("");

  // Use this to set the years the data set focuses on. Use if(yearRange[0] == yearRange[1] to determine whether line or bar)
  const [yearRange, setYearRange] = useState([2017, 2017]);

  const changeYear = (y) => {
    if (yearRange[0] != y && yearRange[1] != y) {
      setYearRange([y, y]);
    }
  };

  // Checks whether a country's code is included in the dataset
  const checkCode = (d) => {
    return !badCodes.includes(d["Country Code"]);
  };

  // The data we want to work with
  const dataCountriesOnly = data.filter(checkCode);

  const dataYearOnly = (y) => {
    return dataCountriesOnly.filter((d) => {
      return d.Year == y;
    });
  };

  // filters the range of data to endyears based on years

  // Column names. used in d[women] to pull column
  const women = "Labor force, female (% of total labor force)";

  // Border designs. 500x500 but working area is 460 x 460
  const s = 500; // viz size
  const m = 20; // margin size
  const t = 4; // text alignment factor

  const yScale = scaleLinear()
    .domain([0, 100])
    .range([s - m, m]);

  // Right Side: Choropleth

  const worldData = data
    .filter((d) => {
      return d["Country Code"] == "WLD";
    })
    .sort((d, e) => {
      return +d.Year > +e.Year;
    });

  const dataRangedEnds = (r) => {
    return Array.from(
      group(
        dataCountriesOnly.filter((d) => {
          return +d.Year == r[0] || +d.Year == r[1];
        }),
        (d) => d["Country Code"]
      )
    )
      .map((d) => {
        return d[1].sort((a, b) => {
          return +a.Year > +b.Year;
        });
      })
      .filter((d) => {
        return r[0] != r[1] ? d.length == r.length : d.length == 1;
      });
  };

  const dataRangedHighlight = (r) => {
    return Array.from(
      group(
        dataCountriesOnly.filter((d) => {
          return (
            highlight.has(d["Country Code"]) &&
            +d.Year >= r[0] &&
            +d.Year <= r[1]
          );
        }),
        (d) => +d.Year
      )
    ).map((y) => {
      y[1] = mean(y[1], (c) => +c[women]);
      return y;
    });
  };

  // Alternate Left Side: line plot stuff

  let highlightArray = [...highlight];

  const minYear = yearRange[0]; //set to a random year for testing
  const maxYear = yearRange[1]; //set to a random year for testing
  /*if (yearRange[0] + 5 > yearRange[1]) {
    maxYear = yearRange[0] + 5;
  }*/
  let xAxisLength = s - m - 45;
  let xintervalLength = xAxisLength / (maxYear - minYear);
  function getXForYear(year) {
    return 45 + xintervalLength * (year - minYear);
  }
  let yAxisLength = s - m + t - (m + t);
  function getYForPercentage(percentage) {
    return s - m - yAxisLength * (percentage / 100);
  }
  const xScale = scaleLinear()
    .domain([minYear, maxYear])
    .range([m, s - m]);

  let [constLineplotColors, updateLineplotColors] = useState({});

  let highLightedCountryData = highlightArray.map(function (countryCode) {
    let countryData = {};
    let countryName = "Unknown Country";
    data.forEach(function (row) {
      if (
        row["Country Code"] === countryCode &&
        row["Year"] >= minYear &&
        row["Year"] <= maxYear
      ) {
        countryData[parseInt(row["Year"])] = row[women];
        countryName = row["Country Name"];
        if (constLineplotColors[countryCode] === undefined) {
          constLineplotColors[countryCode] =
            "#" + Math.floor(Math.random() * 16777215).toString(16);
          updateLineplotColors({ ...constLineplotColors });
        }
      }
    });
    let color = constLineplotColors[countryCode];
    let countryDots = Object.keys(countryData).map(function (year) {
      return (
        <circle
          key={countryCode + year + " circle"}
          cx={getXForYear(year)}
          cy={getYForPercentage(countryData[year])}
          r="3"
          stroke="black"
          fill={color}
        >
          <title>{countryName + ", " + year + ": " + countryData[year]}</title>
        </circle>
      );
    });
    let countryLines = Object.keys(countryData).map(function (year, index) {
      let nextYear = parseInt(year) + 1;
      if (year < maxYear && countryData[nextYear] !== undefined) {
        // || year === minYear + 1)
        if (countryData[year] != 0 && countryData[nextYear] != 0) {
          return (
            <line
              key={countryCode + year + "line"}
              x1={getXForYear(year) - 1}
              y1={getYForPercentage(countryData[year]) + 1}
              x2={getXForYear(nextYear) - 1}
              y2={getYForPercentage(countryData[nextYear]) + 1}
              stroke="#776865"
            >
              <title>
                {countryName +
                  ", " +
                  year +
                  ": " +
                  Math.round(countryData[year] * 100) / 100 +
                  "%"}
              </title>
            </line>
          );
        }
      }
    });
    return {
      country: countryCode,
      countryColor: color,
      dots: countryDots,
      lines: countryLines,
    };
  });
  let dots = highLightedCountryData.map(function (row, index) {
    return row.dots;
  });
  let lines = highLightedCountryData.map(function (row, index) {
    return row.lines;
  });

  const timeScaleLineGraph = scaleTime()
    .domain([new Date(minYear, 1, 1), new Date(maxYear - 1, 12, 01)])
    .range([45, s - m]);

  const Linegraph = (
    <svg width={s} height={s}>
      {lines}
      {highlight.size == 0 ? (
        <text
          textAnchor="middle"
          style={{
            fontSize: 14,
            fontFamily: "Gill Sans, sans-serif",
          }}
          x={s / 2}
          y={s / 2}
        >
          Choose some countries above or on the map
        </text>
      ) : (
        <React.Fragment />
      )}
      <AxisBottom
        scale={timeScaleLineGraph}
        top={s - m - 1}
        stroke={"#333333"}
        tickTextFill={"#333333"}
        numTicks={
          maxYear - minYear > 15 ? (maxYear - minYear) / 2 : maxYear - minYear
        }
      />
      <AxisLeft
        scale={yScale}
        top={-1}
        left={2 * m + 5}
        stroke={"#333333"}
        tickTextFill={"#333333"}
        numTicks={5}
      />
    </svg>
  );
  //end of line plot stuff

  return (
    <div>
      <h2>Assignment 3</h2>

      <p>
        Team: Pavel Batalov, Michael Doyle, Chandrashree Karnani, Ramiro
        Steinmann Petrasso, and Nikki Demmel
      </p>
      {loading ? (
        <p>loading data...</p>
      ) : (
        <div>
          <Timeline
            s={s}
            m={m}
            worldData={worldData}
            yearRange={yearRange}
            setYearRange={setYearRange}
            dataRangedHighlight={dataRangedHighlight}
          />
          <br />

          {yearRange[0] != yearRange[1] ? (
            Linegraph
          ) : (
            <React.Fragment>
              <Barcode
                s={s}
                m={m}
                yScale={yScale}
                yearRange={yearRange}
                highlight={highlight}
                toggleHighlight={toggleHighlight}
                dataYearOnly={dataYearOnly}
                setTooltipContent={setTooltipContent}
              />
              <ReactTooltip id={"line"}></ReactTooltip>
            </React.Fragment>
          )}
          <svg width={s} height={s}>
            <WorldMap
              dataRangedEnds={dataRangedEnds}
              setTooltipContent={setTooltipContent}
              yearRange={yearRange}
              highlight={highlight}
              toggleHighlight={toggleHighlight}
            />

            <text
              x={s - m}
              textAnchor="end"
              y={m}
              style={{ fontSize: 10, fontFamily: "Gill Sans, sans-serif" }}
            >
              {yearRange[0] == yearRange[1]
                ? yearRange[0]
                : yearRange[0] + " - " + yearRange[1]}
            </text>
          </svg>
          <ReactTooltip>{tooltipContent}</ReactTooltip>
          <br />
          <ControlGroups
            groupings={groupings}
            s={s}
            highlight={highlight}
            setHighlight={setHighlight}
          />
          <br />
        </div>
      )}
    </div>
  );
};

export default Final;
