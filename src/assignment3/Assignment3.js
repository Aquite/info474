import React from "react";
import { useFetch } from "./hooks/useFetch";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { extent, max, bin, rollup, group, mean } from "d3-array";
import { scaleLinear, scaleSqrt } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";

const Assignment3 = () => {
  const [data, loading] = useFetch(
    "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/social-protection-and-labor/social-protection-and-labor.csv"
  );

  // Wrangling
  // Isolate to countries

  // List of country codes that aren't countries
  // Should not be included in the data set
  const badCodes = [
    "WLD",
    "ARB",
    "CSS",
    "CEB",
    "EAS",
    "EAP",
    "EMU",
    "ECS",
    "TEC",
    "ECA",
    "EUU",
    "FCS",
    "HPC",
    "LCN",
    "LAC",
    "LDC",
    "TMN",
    "MNA",
    "MEA",
    "NAC",
    "OED",
    "OSS",
    "PSS",
    "PST",
    "LTE",
    "EAR",
    "PRE",
    "SST",
    "TSA",
    "SAS",
    "TEA",
    "TLA",
    "TSS",
    "TEC",
    "IDA",
    "IDB",
    "IBD",
    "IBT",
    "IDX",
    "SSA",
    "SSF",
    "HIC",
    "LMY",
    "LIC",
    "LMC",
    "MIC",
    "UMC",
  ];

  // Checks whether a country's code is included in the dataset
  const checkCode = (d) => {
    return !badCodes.includes(d["Country Code"]);
  };

  // The data we want to work with
  const dataCountriesOnly = data.filter(checkCode);

  const data2017 = dataCountriesOnly.filter((d) => {
    return d.Year == 2017;
  });

  // Column names
  const women = "Labor force, female (% of total labor force)";
  const safetyNet =
    "Adequacy of social safety net programs (% of total welfare of beneficiary households)";
  const employChildren =
    "Children in employment, wage workers (% of children in employment, ages 7-14)";

  // Border designs. 500x500 but working area is 460 x 460
  const s = 500; // viz size
  const m = 20; // margin size
  const t = 4; // text alignment factor

  // Visualization one: Female Labor Force
  const halfCodeWidth = 30;

  const yLabels = (x) => (
    <React.Fragment>
      <text
        x={x - 12}
        textAnchor="end"
        y={m + t}
        style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
      >
        100%
      </text>
      <text
        x={x - 12}
        textAnchor="end"
        y={s - m + t}
        style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
      >
        0%
      </text>
      <text
        x={x - 12}
        textAnchor="end"
        y={s / 2 + t}
        style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
      >
        50%
      </text>
      <line x1={x - 10} y1={m} x2={x} y2={m} stroke={"black"} />
      <line x1={x - 10} y1={s - m} x2={x} y2={s - m} stroke={"black"} />
      <line x1={x - 10} y1={s / 2} x2={x} y2={s / 2} stroke={"black"} />
    </React.Fragment>
  );

  const yScale = scaleLinear()
    .domain([0, 100])
    .range([s - m, m]);

  // Visualization two: Female Labor Force, MENA highlight
  const MENA = [
    "DZA",
    "BHR",
    "EGY",
    "IRN",
    "IRQ",
    "ISR",
    "JOR",
    "KWT",
    "LBN",
    "LBY",
    "MAR",
    "OMN",
    "QAT",
    "SAU",
    "SYR",
    "TUN",
    "ARE",
    "YEM",
  ];

  // Visualization three: Female Labor Force over time, World
  const femaleWorldTimeline = Array.from(
    rollup(
      dataCountriesOnly,
      (v) => mean(v, (d) => d[women]),
      (d) => +d.Year
    )
  )
    .filter((d) => {
      return d[1] != 0;
    })
    .sort()
    .slice(1); //not large enough sample size in 1990

  const timeScale = scaleLinear()
    .domain([1991, 2017])
    .range([m * 2, s - m * 2]);

  // Visualization four: Change in female Labor Force as a percentage of total labor force from 1991 to 2017
  const dataFemChange = Array.from(
    group(
      dataCountriesOnly.filter((d) => {
        return d.Year == 2017 || d.Year == 1991;
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
      return d.length == 2;
    });

  // Visualization Six: Scatterplot
  const radScale = scaleSqrt()
    .domain(
      extent(
        dataFemChange.map((d) => {
          return +d[1][women] * 0.01 * +d[1]["Labor force, total"];
        })
      )
    )
    .range([1, 30]);

  // Visualization Seven: Change in Deltas (histogram)
  const binForce = bin().thresholds(20);
  const bucketsForce = binForce(
    dataFemChange.map((d) => {
      return +d[1][women] - d[0][women];
    })
  );
  const forceYScale = scaleLinear()
    .domain([
      0,
      max(
        bucketsForce.map((bin) => {
          return bin.length;
        })
      ),
    ])
    .range([0, s - m * 2]);
  // Visualization Eight: Choropleth
  const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
  const colorScale = scaleLinear()
    .domain([0, 60])
    .range(["aliceblue", "steelblue"]);

  return (
    <div>
      <h2>Assignment 3</h2>
      {loading ? (
        <p>loading data...</p>
      ) : (
        <div>
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            {yLabels(s / 2 - halfCodeWidth)}
            {data2017.map((d, i) => {
              if (d[women] != 0) {
                return (
                  <line
                    key={"barcode" + i}
                    x1={s / 2 - halfCodeWidth}
                    y1={yScale(d[women])}
                    x2={s / 2 + halfCodeWidth}
                    y2={yScale(d[women])}
                    fill="none"
                    stroke={"steelblue"}
                    strokeOpacity={0.33}
                  />
                );
              }
            })}
          </svg>
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            <ComposableMap
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147,
              }}
            >
              <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
              <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const d = data2017.find(
                      (s) => s["Country Code"] === geo.properties.ISO_A3
                    );
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={d ? colorScale(d[women]) : "#F5F4F6"}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </svg>
        </div>
      )}
    </div>
  );
};

export default Assignment3;
