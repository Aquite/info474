import React, { useState } from "react";
import { useFetch } from "./hooks/useFetch";
import { extent, max, bin, rollup, group, mean } from "d3-array";
import { scaleLinear, scaleSqrt } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from "react-simple-maps";
import { html } from "d3-fetch";
import ReactTooltip from "react-tooltip";
import SVGBrush from "react-svg-brush";

const Assignment3 = () => {
  const [data, loading] = useFetch(
    "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/social-protection-and-labor/social-protection-and-labor.csv"
  );

  // Use `if highlight.has(c["Country Code"])` to test wether or not to highlight your country
  // Do not use setHighlight because you won't do it properly. See the below function
  const [highlight, setHighlight] = useState(
    new Set([
      "PSE",
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
    ])
  );

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

  const dataRanged = (r) => {
    return Array.from(
      group(
        dataCountriesOnly.filter((d) => {
          return +d.Year >= r[0] || +d.Year <= r[1];
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
        return d.length == r.length;
      });
  };

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

  // Column names
  const women = "Labor force, female (% of total labor force)";

  // Border designs. 500x500 but working area is 460 x 460
  const s = 500; // viz size
  const m = 20; // margin size
  const t = 4; // text alignment factor

  // Left Side: Female Labor Force
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

  // Bottom: Female Labor Force over time, World

  const timeScale = scaleLinear().domain([20, 980]).range([1991, 2017]);

  // Right Side: Choropleth
  const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
  const colorScale = scaleLinear()
    .domain([0, 70])
    .range(["aliceblue", "steelblue"]);

  const highlightScale = scaleLinear()
    .domain([0, 70])
    .range(["#fff0f0", "#b54646"]);

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
                const h = highlight.has(d["Country Code"]) === true;
                return (
                  <line
                    key={i}
                    x1={s / 2 - halfCodeWidth}
                    y1={yScale(d[women])}
                    x2={s / 2 + halfCodeWidth + (h ? 10 : 0)}
                    y2={yScale(d[women])}
                    fill="none"
                    stroke={h ? "#b54646" : "steelblue"}
                    strokeOpacity={h ? 0.5 : 0.33}
                  />
                );
              }
            })}
          </svg>
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            <ComposableMap
              data-tip=""
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147,
              }}
            >
              <ZoomableGroup>
                <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const data = dataRangedEnds(yearRange);

                      const c = data.filter(
                        (s) => s[0]["Country Code"] === geo.properties.ISO_A3
                      );
                      let d = null;
                      if (c[0] != null) {
                        d = c[0][0];
                      }
                      let h = false;
                      if (d != null) {
                        h = highlight.has(d["Country Code"]) === true;
                      }

                      return (
                        <Geography
                          onClick={() => toggleHighlight(d)}
                          onMouseEnter={() => {
                            if (d != null) {
                              setTooltipContent(
                                d["Country Name"] +
                                  " — " +
                                  Math.round(d[women] * 100) / 100 +
                                  "%"
                              );
                            }
                          }}
                          onMouseLeave={() => {
                            setTooltipContent("");
                          }}
                          key={geo.rsmKey}
                          geography={geo}
                          fill={
                            d
                              ? h
                                ? highlightScale(d[women])
                                : colorScale(d[women])
                              : "#F5F4F6"
                          }
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            <text
              x={s - m}
              textAnchor="end"
              y={s - m}
              style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
            >
              {yearRange[0] == yearRange[1]
                ? yearRange[0]
                : yearRange[0] + " - " + yearRange[1]}
            </text>
          </svg>
          <ReactTooltip>{tooltipContent}</ReactTooltip>
          <br />
          <svg
            width={s * 2}
            height={s / 4}
            style={{ border: "1px solid black" }}
            className="timeline"
          >
            <SVGBrush
              brushType="x"
              getEventMouse={(event) => {
                const { clientX, clientY } = event;
                const { left, top } = document
                  .querySelector(".timeline")
                  .getBoundingClientRect();
                return [clientX - left, clientY - top];
              }}
              extent={[
                [m, m],
                [s * 2 - m, s / 4 - m],
              ]}
              onBrushEnd={({ selection }) => {
                if (selection != null) {
                  if (selection[1][0] > 980) {
                    selection[1][0] = 980;
                  }
                  setYearRange([
                    Math.round(timeScale(selection[0][0])),
                    Math.round(timeScale(selection[1][0])),
                  ]);
                }
              }}
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Assignment3;
