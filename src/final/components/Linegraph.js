import React, { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear } from "d3-scale";
import { group, mean } from "d3-array";
import { scaleTime } from "@vx/scale";
import { AxisBottom, AxisLeft } from "@vx/axis";
import ReactTooltip from "react-tooltip";


export default function Linegraph(props) {

  const ourToolTip = useState("We are in a state");

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
  //let xAxisLength = s - m - 45;

  const timeScaleLineGraph = scaleTime()
    .domain([new Date(minYear, 1, 1), new Date(maxYear - 1, 12, 01)])
    .range([45, s - m]);

  let xintervalLength = timeScaleLineGraph(new Date(minYear, 12, 01)) - timeScaleLineGraph(new Date(minYear - 1, 12, 01));


  function getXForYear(year) {
    //return 45 + xintervalLength * (year - minYear);
    if(year === minYear){
      return timeScaleLineGraph(new Date(year, 01, 01))
    }
    else {
      return timeScaleLineGraph(new Date(year - 1, 12, 01))
    }
  }
  let yAxisLength = s - m + t - (m + t);
  function getYForPercentage(percentage) {
    return s - m - yAxisLength * (percentage / 100);
  }

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
      }
    });
    let countryLines = Object.keys(countryData).map(function (year, index) {
      let nextYear = parseInt(year) + 1;
      if (year < maxYear && countryData[nextYear] !== undefined) {
        if (countryData[year] != 0 && countryData[nextYear] != 0) {
          return (
            <line
              data-for={"scatternot"} data-tip={""}
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
      name: countryName,
      data: countryData,
      lines: countryLines
    };
  });
  let lines = highLightedCountryData.map(function (row) {
    return row.lines;
  });


  const toolTipYear = useState(minYear - 2);

  let arrayOfYears = [];
  for (let i = minYear; i <= maxYear; i++) {
    arrayOfYears.push(i);
  }

  let toolTipRectangles = arrayOfYears.map(function (year) {
    return (
      <rect
        key={"toolTipRegion" + year}
        onMouseEnter={() => {

          let toolTipLabel = " \"" + col + "\" data for " + year + "<br/> " + "<br/> "
          let toolTipData = highLightedCountryData.filter(function(country){
            return (country.data[year]!== undefined) && (country.data[year]!= 0);
          });
          toolTipData.sort(function(countryA, countryB){
            return countryB.data[year] - countryA.data[year]
          })
          toolTipData.forEach(function (country) {
            toolTipLabel = toolTipLabel + "<br/> " + country.name + ": " + country.data[year];
          })
          ourToolTip[1](toolTipLabel);
          toolTipYear[1](year);
        }}
        x={getXForYear(year) - (xintervalLength / 2)}
        y="0"
        width={xintervalLength}
        height={s}
        fillOpacity={"0.0"}
      />
    )
  });

  const Linegraph = (
    <React.Fragment>
      <svg width={s} height={s}>
        {lines}
        <line x1={getXForYear(toolTipYear[0])}
          x2={getXForYear(toolTipYear[0])}
          y1={getYForPercentage(0)}
          y2={getYForPercentage(100)}
          stroke="#776865"
        />
        {highlight.size !== 0 && toolTipRectangles}
        <rect data-tip="test"
          key={" toolTipRegionExample"}
          data-for={"scatternot"}
          data-tip={ourToolTip[0]}
          onMouseLeave={() => {
            toolTipYear[1](minYear - 2) //a year that isnt in the graph, i.e. get rid of the highlight
            ourToolTip[1]("No Year Highlighted");
          }}
          x={getXForYear(toolTipYear[0]) - (xintervalLength / 2)}
          y="0"
          width={xintervalLength}
          height={s}
          fillOpacity={"0.15"}
        />
        {highlight.size == 0 ? (
          <text
            data-tip data-for="scatternot"
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
      <ReactTooltip id={"scatternot"} multiline={true}></ReactTooltip>
    </React.Fragment>
  );

  return Linegraph;

}