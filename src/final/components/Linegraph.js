import React, { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear } from "d3-scale";
import { group, mean } from "d3-array";
import { scaleTime } from "@vx/scale";
import { AxisBottom, AxisLeft } from "@vx/axis";


export default function Linegraph(props) {

  
  const women = "Labor force, female (% of total labor force)";

  let s = props.s;
  let m = props.m;
  let t = props.t;
  let col = props.col;
  let yScale = props.yScale;
  let yearRange = props.yearRange;
  let highlight = props.highlight;
  let dataInDateRange = props.dataInDateRange;
  let setTooltipContent = props.setTooltipContent;
  let toggleHighlight = props.toggleHighlight;

  let highlightArray = [...highlight];

  const minYear = yearRange[0]; //set to a random year for testing
  const maxYear = yearRange[1]; //set to a random year for testing
  let xAxisLength = s - m - 45;
  let xintervalLength = xAxisLength / (maxYear - minYear);
  function getXForYear(year) {
    return 45 + xintervalLength * (year - minYear);
  }
  let yAxisLength = s - m + t - (m + t);
  function getYForPercentage(percentage) {
    return s - m - yAxisLength * (percentage / 100);
  }
  let [constLineplotColors, updateLineplotColors] = useState({});

  let highLightedCountryData = highlightArray.map(function (countryCode) {
    let countryData = {};
    let countryName = "Unknown Country";
    dataInDateRange(minYear, maxYear).forEach(function (row) {
      if (
        row["Country Code"] === countryCode &&
        row["Year"] >= minYear &&
        row["Year"] <= maxYear
      ) {
        countryData[parseInt(row["Year"])] = row[col];
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
  
  return Linegraph;

}