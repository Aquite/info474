import React, { useState } from "react";
import { useFetch } from "./hooks/useFetch";
import { group } from "d3-array";
import { scaleLinear } from "d3-scale";
import { scaleTime } from "@vx/scale";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { PatternLines } from "@vx/pattern";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  ZoomableGroup,
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import SVGBrush from "react-svg-brush";

const Assignment3 = () => {
  const [data, loading] = useFetch(
    "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/social-protection-and-labor/social-protection-and-labor.csv"
  );

  // Have fun scrolling
  const groupings = [
    { name: "World", codes: new Set([]) },
    {
      name: "North America",
      codes: new Set([
        "ABW",
        "AIA",
        "ATG",
        "BES",
        "BHS",
        "BLM",
        "BLZ",
        "BMU",
        "BRB",
        "CAN",
        "CRI",
        "CUB",
        "CUW",
        "CYM",
        "DMA",
        "DOM",
        "GLP",
        "GRD",
        "GRL",
        "GTM",
        "HND",
        "HTI",
        "JAM",
        "KNA",
        "LCA",
        "MAF",
        "MEX",
        "MSR",
        "MTQ",
        "NIC",
        "PAN",
        "PRI",
        "SLV",
        "SPM",
        "SXM",
        "TCA",
        "TTO",
        "UMI",
        "USA",
        "VCT",
        "VGB",
        "VIR",
      ]),
    },
    {
      name: "South America",
      codes: new Set([
        "ARG",
        "BOL",
        "BRA",
        "CHL",
        "COL",
        "ECU",
        "FLK",
        "GUF",
        "GUY",
        "PER",
        "PRY",
        "SUR",
        "URY",
        "VEN",
      ]),
    },
    {
      name: "Europe",
      codes: new Set([
        "ALA",
        "ALB",
        "AND",
        "ARM",
        "AUT",
        "AZE",
        "BEL",
        "BGR",
        "BIH",
        "BLR",
        "CHE",
        "CYP",
        "CZE",
        "DEU",
        "DNK",
        "ESP",
        "EST",
        "FIN",
        "FRA",
        "FRO",
        "GBR",
        "GEO",
        "GGY",
        "GIB",
        "GRC",
        "HRV",
        "HUN",
        "IMN",
        "IRL",
        "ISL",
        "ITA",
        "JEY",
        "KAZ",
        "LIE",
        "LTU",
        "LUX",
        "LVA",
        "MCO",
        "MDA",
        "MKD",
        "MLT",
        "MNE",
        "NLD",
        "NOR",
        "POL",
        "PRT",
        "ROU",
        "RUS",
        "SJM",
        "SMR",
        "SRB",
        "SVK",
        "SVN",
        "SWE",
        "TUR",
        "UKR",
        "VAT",
        "XKX",
      ]),
    },
    {
      name: "MENA",
      codes: new Set([
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
      ]),
    },
    {
      name: "Asia",
      codes: new Set([
        "AFG",
        "ARE",
        "ARM",
        "AZE",
        "BGD",
        "BHR",
        "BRN",
        "BTN",
        "CCK",
        "CHN",
        "CXR",
        "CYP",
        "EGY",
        "GEO",
        "HKG",
        "IDN",
        "IND",
        "IRN",
        "IRQ",
        "ISR",
        "JOR",
        "JPN",
        "KAZ",
        "KGZ",
        "KHM",
        "KOR",
        "KWT",
        "LAO",
        "LBN",
        "LKA",
        "MAC",
        "MDV",
        "MMR",
        "MNG",
        "MYS",
        "NPL",
        "OMN",
        "PAK",
        "PHL",
        "PRK",
        "PSE",
        "QAT",
        "RUS",
        "SAU",
        "SGP",
        "SYR",
        "THA",
        "TJK",
        "TKM",
        "TLS",
        "TUR",
        "TWN",
        "UZB",
        "VNM",
        "YEM",
      ]),
    },
    {
      name: "Africa",
      codes: new Set([
        "AGO",
        "ATF",
        "BDI",
        "BEN",
        "BFA",
        "BWA",
        "CAF",
        "CIV",
        "CMR",
        "COD",
        "COG",
        "COM",
        "CPV",
        "DJI",
        "DZA",
        "EGY",
        "ERI",
        "ESH",
        "ETH",
        "GAB",
        "GHA",
        "GIN",
        "GMB",
        "GNB",
        "GNQ",
        "IOT",
        "KEN",
        "LBR",
        "LBY",
        "LSO",
        "MAR",
        "MDG",
        "MLI",
        "MOZ",
        "MRT",
        "MUS",
        "MWI",
        "MYT",
        "NAM",
        "NER",
        "NGA",
        "REU",
        "RWA",
        "SDN",
        "SEN",
        "SHN",
        "SLE",
        "SOM",
        "SSD",
        "STP",
        "SWZ",
        "SYC",
        "TCD",
        "TGO",
        "TUN",
        "TZA",
        "UGA",
        "ZAF",
        "ZMB",
        "ZWE",
      ]),
    },
    {
      name: "Oceania",
      codes: new Set([
        "ASM",
        "AUS",
        "COK",
        "FJI",
        "FSM",
        "GUM",
        "KIR",
        "MHL",
        "MNP",
        "NCL",
        "NFK",
        "NIU",
        "NRU",
        "NZL",
        "PCN",
        "PLW",
        "PNG",
        "PYF",
        "SLB",
        "TKL",
        "TON",
        "TUV",
        "UMI",
        "VUT",
        "WLF",
        "WSM",
      ]),
    },
  ];

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

  // Column names. used in d[women] to pull column
  const women = "Labor force, female (% of total labor force)";

  // Border designs. 500x500 but working area is 460 x 460
  const s = 500; // viz size
  const m = 20; // margin size
  const t = 4; // text alignment factor

  // Left Side: Female Labor Force
  const halfCodeWidth = 30;

  const yScale = scaleLinear()
    .domain([0, 100])
    .range([s - m, m]);

  // Bottom Side: Female Labor Force over time, World

  const timeScale = scaleLinear().domain([20, 980]).range([1991, 2018]);
  const timeScaleReverse = scaleTime()
    .domain([new Date(1991, 01, 01), new Date(2018, 01, 01)])
    .range([20, 980]);

  const worldLineScale = scaleLinear()
    .domain([0, 100])
    .range([s / 4 - m * 2, m]);

  const worldLineScaleReversed = scaleLinear()
    .domain([s / 4 - m * 2, m])
    .range([0, 90]);

  // Right Side: Choropleth
  const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
  const colorScale = scaleLinear()
    .domain([0, 70])
    .range(["aliceblue", "steelblue"]);

  const highlightScale = scaleLinear()
    .domain([0, 70])
    .range(["#fff0f0", "#b54646"]);

  const worldData = data
    .filter((d) => {
      return d["Country Code"] == "WLD";
    })
    .sort((d, e) => {
      return +d.Year > +e.Year;
    });

  const changeScale = scaleLinear()
    .domain([-15, 0, 15])
    .range(["#b54646", "#f2f2f2", "#46b557"]);

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
              x1={getXForYear(year)}
              y1={getYForPercentage(countryData[year])}
              x2={getXForYear(nextYear)}
              y2={getYForPercentage(countryData[nextYear])}
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
      <h2 id="main-questions-investigated">Main Questions Investigated</h2>
      <ol>
        <li>
          What trends are there in the change of female labor force
          participation over time?{" "}
        </li>
        <li>
          Are there any geographical trends tied to the amount of women in the
          labor force?{" "}
        </li>
      </ol>
      <h2 id="design-rationale">Design Rationale</h2>
      <ul>
        <li>
          <p>
            How did we choose our particular visual encodings and interaction
            techniques?{" "}
          </p>
          <p>
            {" "}
            First, we discussed what kind of data we would need to visualize in
            order to answer our initial questions. We decided to use a
            chloropleth map of the world to easily compare and contrast the
            labor force participation rates between countries and easily
            discover larger regional/continental trends. This map uses shades of
            blue to indicate a country&#39;s rate of female labor force
            participation, where a higher percentage of women in the workforce
            is encoded as a darker shade of blue. We chose to include this color
            encoding to encourage users to select countries that visually stood
            out to them to further explore their data in the other two
            visualizations. To make these comparisons between countries easier,
            we created a bar code graph that showed the ratio of women to men in
            each country&#39;s labor force. This visualization lets users see
            comparisons faster than the chloropleth map. To answer our first
            question about labor force participation rates over time, we added
            an interactive timeline that changed the views on the visualizations
            above it. Users can select beginning and end points on the timeline
            to see how their selected countries&#39; female labor force
            participation rates changed over time. When a user has set a range
            of dates, the barcode graph changes into a line graph to show
            countries&#39; female labor force participation rates year after
            year. This lets users more easily visualize the differences and
            trends in labor force participation rates in each selected country.{" "}
          </p>
        </li>
        <li>
          <p>
            What alternatives did you consider and how did you arrive at your
            ultimate choices?
          </p>
          <p>
            {" "}
            We initially considered making all of our visualizations on a single
            chloropleth map with different views the user could choose from to
            look at different aspects of the data. We realized it would be
            harder to visually encode changes over time in a map, so we decided
            to make a line chart to show these changes instead. We also
            considered making visualizations on other parts of the data that
            could have partially explained the female labor force participation
            rates, but we realized that too many factors go into these
            statistics, many of which are not easily quantifiable such as
            cultural values and labor laws. We narrowed the scope of our
            visualizations to highlight differences between countries, because
            explaining how or why these differences came to be is better suited
            for another medium, like a book or lecture series.{" "}
          </p>
        </li>
      </ul>
      <h2 id="development-process">Development Process</h2>
      <ul>
        <li>
          <p>
            Roughly how much time did you spend developing your application (in
            people-hours)?{" "}
          </p>
          <p>
            {" "}
            We divided the work in a way where everyone paired up to make one
            visualization and its interactive elements. In total, we spent about
            20-25 people-hours working on this application. We were able to meet
            early on and decide on a direction to take the visualizations in so
            everyone could spend the rest of the week working on their code.{" "}
          </p>
        </li>
        <li>
          <p>What aspects took the most time?</p>
          <p>
            {" "}
            Getting the line graph to display countries that were selected by
            the user on the chloropleth map took the most amount of time.
            Finding a time to meet outside of class to plan for the assignment
            took some time as well, due to our conflicting class schedules. The
            most difficult part was optimizing react for tooltips, which we
            ended up not being able to do. We used to have tooltips on the map
            that displayed the country and respective data, but every time it
            entered or left a country the entire map rebuilt, lagging it out.
            Instead, we had to use a non-fancy title element. We also had the
            same issue for live-scrubbing, so we instead chose to update
            scrubbing only at the end.
          </p>
        </li>
      </ul>
      {loading ? (
        <p>loading data...</p>
      ) : (
        <div>
          <svg width={s * 2} height={s / 4}>
            {groupings.map((g, i) => {
              return (
                <React.Fragment key={i + " frag"}>
                  <circle
                    cx={(s / groupings.length) * 2 * i + s / groupings.length}
                    cy={s / 8}
                    r={50}
                    style={{ fill: "steelblue" }}
                    fillOpacity={
                      [...highlight].every((e) => g.codes.has(e)) &&
                      [...g.codes].every((e) => highlight.has(e))
                        ? "0.5"
                        : "0.15"
                    }
                    onClick={() => {
                      setHighlight(new Set(g.codes));
                    }}
                  />
                  <text
                    x={(s / groupings.length) * 2 * i + s / groupings.length}
                    y={s / 8}
                    textAnchor="middle"
                    style={{
                      fontSize: 14,
                      fontFamily: "Gill Sans, sans-serif",
                    }}
                    onClick={() => {
                      setHighlight(new Set(g.codes));
                    }}
                  >
                    {g.name}
                  </text>
                </React.Fragment>
              );
            })}
          </svg>
          <br />
          {yearRange[0] != yearRange[1] ? (
            Linegraph
          ) : (
            <svg width={s} height={s}>
              <AxisLeft
                scale={yScale}
                top={0}
                left={s / 2 - m * 2}
                stroke={"#333333"}
                tickTextFill={"#333333"}
                label={"% of Workforce is Women in " + yearRange[0]}
              />
              {dataYearOnly(yearRange[0]).map((d, i) => {
                if (d[women] != 0) {
                  const h = highlight.has(d["Country Code"]) === true;
                  return (
                    <line
                      key={i + " barcode"}
                      x1={s / 2 - halfCodeWidth - (h ? 10 : 0)}
                      y1={yScale(d[women])}
                      x2={s / 2 + halfCodeWidth + (h ? 10 : 0)}
                      y2={yScale(d[women])}
                      fill="none"
                      stroke={h ? "#776865" : "steelblue"}
                      strokeOpacity={h ? 0.5 : 0.33}
                      onClick={() => toggleHighlight(d)}
                    >
                      <title>{d["Country Name"]}</title>
                    </line>
                  );
                }
              })}
            </svg>
          )}
          <svg width={s} height={s}>
            <ComposableMap
              data-tip=""
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147,
              }}
            >
              <ZoomableGroup>
                <PatternLines
                  id="lines"
                  height={4}
                  width={4}
                  stroke={"#776865"}
                  strokeWidth={0.6}
                  orientation={["diagonal"]}
                />
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
                        <React.Fragment key={geo.rsmKey + "frag"}>
                          <Geography
                            onClick={() => toggleHighlight(d)}
                            key={geo.rsmKey}
                            geography={geo}
                            fill={
                              d
                                ? yearRange[0] != yearRange[1]
                                  ? changeScale(+c[0][1][women] - +d[women])
                                  : colorScale(d[women])
                                : "#F5F4F6"
                            }
                          >
                            <title>
                              {d
                                ? d["Country Name"] +
                                  ": " +
                                  Math.round(
                                    (yearRange[0] == yearRange[1]
                                      ? d[women]
                                      : c[0][1][women] - d[women]) * 100
                                  ) /
                                    100 +
                                  "%"
                                : "No data"}
                            </title>
                          </Geography>
                          {h ? (
                            <Geography
                              onClick={() => toggleHighlight(d)}
                              key={geo.rsmKey + "highlight"}
                              geography={geo}
                              fill={"url('#lines')"}
                            >
                              <title>
                                {d["Country Name"] +
                                  ": " +
                                  Math.round(
                                    (yearRange[0] == yearRange[1]
                                      ? d[women]
                                      : c[0][1][women] - d[women]) * 100
                                  ) /
                                    100 +
                                  "%"}
                              </title>
                            </Geography>
                          ) : (
                            <div />
                          )}
                        </React.Fragment>
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
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
          <svg width={s * 2} height={s / 4} className="timeline">
            {worldData.map((d, i) => {
              if (i > 1) {
                return (
                  <line
                    x1={timeScaleReverse(new Date(d.Year - 1, 01, 01))}
                    y1={worldLineScale(worldData[i - 1][women])}
                    x2={timeScaleReverse(new Date(d.Year, 01, 01))}
                    y2={worldLineScale(d[women])}
                    stroke="steelblue"
                    key={i + " line"}
                  >
                    <title>{"World: " + worldData[i - 1][women]}</title>
                  </line>
                );
              }
            })}
            <AxisLeft
              scale={worldLineScale}
              top={0}
              left={s * 2 - m}
              stroke={"#333333"}
              tickTextFill={"#333333"}
              numTicks={5}
            />
            <AxisBottom
              scale={timeScaleReverse}
              top={s / 4 - m * 2}
              left={3}
              stroke={"#333333"}
              tickTextFill={"#333333"}
              numTicks={26}
              label={"World Average (Click any year or scrub my timeline!)"}
            />
            {[...Array(27).keys()].map((value) => {
              return yearRange[0] == yearRange[1] &&
                yearRange[0] == value + 1991 ? (
                <rect
                  key={value}
                  x={timeScaleReverse(new Date(value + 1991, 01, 01)) - 15}
                  y={s / 4 - m * 2 + 5}
                  height={30}
                  width={30}
                  style={{ fill: "steelblue", fillOpacity: "0.15" }}
                />
              ) : (
                <rect
                  key={value}
                  x={timeScaleReverse(new Date(value + 1991, 01, 01)) - 15}
                  y={s / 4 - m * 2 + 5}
                  height={30}
                  width={30}
                  style={{ fillOpacity: "0" }}
                  onMouseDown={() => setYearRange([1991 + value, 1991 + value])}
                />
              );
            })}
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
                [s * 2 - m - 1, s / 4 - m * 2],
              ]}
              onBrushEnd={({ selection }) => {
                if (selection != null) {
                  if (selection[1][0] > 979) {
                    selection[1][0] = 979;
                  }
                  setYearRange([
                    Math.floor(timeScale(selection[0][0])),
                    Math.floor(timeScale(selection[1][0])),
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

// This goes in countries to make the tooltip work but it lags everything out. Would like to fix with Colin later
/*                            onMouseEnter={() => {
                              if (d != null) {
                                setTooltipContent(
                                  d["Country Name"] +
                                    ": " +
                                    Math.round(
                                      (yearRange[0] == yearRange[1]
                                        ? d[women]
                                        : c[0][1][women] - d[women]) * 100
                                    ) /
                                      100 +
                                    "%"
                                );
                              }
                            }}
                            onMouseLeave={() => {
                              setTooltipContent("");
                            }}
                            */
