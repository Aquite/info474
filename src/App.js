import React from "react";
import { useFetch } from "./hooks/useFetch";
import { scaleLinear } from "d3-scale";
import { extent, max, min, bin } from "d3-array";

const App = () => {
  /* THIS GOES IN APP.JS */
const [data, loading] = useFetch(
    "https://raw.githubusercontent.com/Aquite/react-parcel-example-1/main/weather.csv"
  );

  const dataSmallSample = data.slice(0, 5000);

  const extentTMAX = extent(dataSmallSample, (d) => {
    return d.TMAX;
  });

  const maxValueOfTMAX = max(
    dataSmallSample.map((measurement) => {
      return +measurement.TMAX;
    })
  );

  const minValueOfTMAX = min(
    dataSmallSample.map((measurement) => {
      return +measurement.TMAX;
    })
  );

  const projection = d3.geoNaturalEarth1();

  const path = d3.geoPath(projection);

  const s = 500;
  const margin = 20;
  const axisTextAlignmentFactor = 3;
  const yScale =
    scaleLinear()
    .domain([minValueOfTMAX, maxValueOfTMAX])
    .range([s, s - 250]);

  const binTMAX = bin().thresholds(30);
  const bucketsTMAX = binTMAX(
    data.map((d) => {
      return +d.TMAX;
    })
  );

  const histogramLeftPadding = 20;

  return (
    <div>
      <h1>Exploratory Data Analysis, Assignment 2, INFO 474 SP 2021</h1>
      <p>{ loading && "loading data!" }</p>

      <h3>Working with geo data</h3>
      <svg width={s} height={s} style={{ border: "1px solid black"}}>

      </svg>

      <h3>Binning</h3>
      <svg width={s} height={s} style={{ border: "1px solid black"}}>
        {bucketsTMAX.map((bin, i) => {
          //const binHeight = bin.length && bin.length * 0.001 < 1 ? 1 : bin.length * 0.001
          return(
            <rect y={s - 50 - bin.length} width="10" height={bin.length} x={histogramLeftPadding + i * 11} />
          );
        })

        }
      </svg>

      <h3>Barcode plot at TMAX - linear scaling</h3>
      <svg width={s} height={s} style={{ border: "1px solid black"}}>

        <text
          x={s / 2 - 10}
          textAnchor="end"
          y={s - margin + axisTextAlignmentFactor}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          0
        </text>
        <text
          x={s / 2 - 10}
          textAnchor="end"
          y={s - margin - 100 + axisTextAlignmentFactor}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          100
        </text>
        <line
          x1={s / 2 - 10}
          y1={s - margin - 100}
          x2={s / 2 - 5}
          y2={s - margin - 100}
          stroke={"black"}
        />
        <line
          x1={s / 2 - 10}
          y1={s - margin}
          x2={s / 2 - 5}
          y2={s - margin}
          stroke={"black"}
        />

      {dataSmallSample.map((measurement, index) => {
          const highlight = measurement.station === "KALISPELL GLACIER AP"
          return (
            <line
              key={index}
              x1={s / 2}
              y1={yScale(measurement.TMAX)}
              x2={s / 2 + 20}
              y2={yScale(measurement.TMAX)}

              r="3"
              fill="none"
              stroke={ highlight ? "red" : "steelblue" }
              strokeOpacity={highlight ? 1 : 0.1}
            />
          );
        })}
      </svg>


      <h3>Scatterplot</h3>
      <svg width={s} height={s} style={{ border: "1px solid black"}}>
        {data.slice(0, 300).map((measurement, index) => {
          const highlight = measurement.station === "KALISPELL GLACIER AP"
          return (
            <circle
              key={index}
              cx={100 - measurement.TMIN}
              cy={s - margin - measurement.TMAX}
              r="3"
              fill="none"
              stroke={ highlight ? "red" : "steelblue" }
              strokeOpacity="0.2"
            />
          );
        })}
      </svg>



      <h3>Barcode plot at TMAX</h3>
      <svg width={s} height={s} style={{ border: "1px solid black"}}>

        <text
          x={s / 2 - 10}
          textAnchor="end"
          y={s - margin + axisTextAlignmentFactor}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          0
        </text>
        <text
          x={s / 2 - 10}
          textAnchor="end"
          y={s - margin - 100 + axisTextAlignmentFactor}
          style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
        >
          100
        </text>
        <line
          x1={s / 2 - 10}
          y1={s - margin - 100}
          x2={s / 2 - 5}
          y2={s - margin - 100}
          stroke={"black"}
        />
        <line
          x1={s / 2 - 10}
          y1={s - margin}
          x2={s / 2 - 5}
          y2={s - margin}
          stroke={"black"}
        />

        {data.slice(0, 1000).map((measurement, index) => {
          const highlight = measurement.station === "KALISPELL GLACIER AP"
          return (
            <line
              key={index}
              x1={s / 2}
              y1={s - margin - measurement.TMAX}
              x2={s / 2 + 20}
              y2={s - margin - measurement.TMAX}

              r="3"
              fill="none"
              stroke={ highlight ? "red" : "steelblue" }
              strokeOpacity={highlight ? 1 : 0.1}
            />
          );
        })}
      </svg>

      <h3>TMAX at KALISPELL GLACIER AP is lower than average</h3>
      <svg width={s} height={s} style={{ border: "1px solid black"}}>
        {data.slice(0, 300).map((measurement, index) => {
          const highlight = measurement.station === "KALISPELL GLACIER AP"
          return (
            <circle
              key={index}
              cx={ highlight ? s / 2 + 20 : s / 2 }
              cy={s - margin - measurement.TMAX}
              r="3"
              fill="none"
              stroke={ highlight ? "red" : "steelblue" }
              strokeOpacity="0.2"
            />
          );
        })}
      </svg>


      <h3>TMAX</h3>
      <svg width={s} height={s} style={{ border: "1px solid black"}}>
        {data.slice(0, 300).map((measurement, index) => {
          const highlight = measurement.station === "KALISPELL GLACIER AP"
          return (
            <circle
              key={index}
              cx={ s / 2 }
              cy={s - margin - measurement.TMAX}
              r="3"
              fill="none"
              stroke="steelblue"
              strokeOpacity="0.2"
            />
          );
        })}
      </svg>
    </div>
  );
}


export default App;
