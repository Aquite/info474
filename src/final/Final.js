import React, { useState } from "react";
import { useFetch } from "./hooks/useFetch";
import { scaleLinear } from "d3-scale";
import { group, mean } from "d3-array";
import { scaleTime } from "@vx/scale";
import WorldMap from "./components/WorldMap.js";
import ReactTooltip from "react-tooltip";
import { groupings, badCodes } from "./Groupings.js";
import ControlGroups from "./components/ControlGroups.js";
import Barcode from "./components/Barcode.js";
import Timeline from "./components/Timeline.js";
import { cols } from "./ColumnNames.js";
import Form from "react-bootstrap/Form";
import Linegraph from "./components/Linegraph.js";
import Col from "react-bootstrap/esm/Col";
import Scatterplot from "./components/Scatterplot.js";

const Final = () => {
  const [data, loading] = useFetch(
    "https://raw.githubusercontent.com/ZeningQu/World-Bank-Data-by-Indicators/master/social-protection-and-labor/social-protection-and-labor.csv"
  );

  const [col, setCol] = useState(cols.womLab);
  const [col2, setCol2] = useState("N/A");

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
      y[1] = mean(y[1], (c) => +c[col]);
      return y;
    });
  };

  // Alternate Left Side: line plot stuff
  const dataInDateRange = (minYear, maxYear) => {
    return dataCountriesOnly.filter((d) => {
      return d.Year >= minYear && d.Year <= maxYear;
    });
  };

  return (
    <div>
      <h2>Final</h2>

      <p>
        Team: Pavel Batalov, Michael Doyle, Chandrashree Karnani, Ramiro
        Steinmann Petrasso, and Nikki Demmel
      </p>
      <Form>
        <Form.Group controlId="Form.col1">
          <Form.Label>First Variable</Form.Label>
          <Form.Control
            as="select"
            value={col}
            onChange={(e) => {
              setCol(e.target.value);
            }}
          >
            {Object.values(cols).map((c) => {
              return <option>{c}</option>;
            })}
          </Form.Control>
        </Form.Group>
      </Form>
      <Form>
        <Form.Group controlId="Form.col2">
          <Form.Label>Second Variable (Optional)</Form.Label>
          <Form.Control
            as="select"
            value={col2}
            onChange={(e) => {
              setCol2(e.target.value);
            }}
          >
            <option>N/A</option>
            {Object.values(cols).map((c) => {
              return <option>{c}</option>;
            })}
          </Form.Control>
        </Form.Group>
      </Form>
      {loading ? (
        <p>loading data...</p>
      ) : (
        <div>
          <Timeline
            s={s}
            m={m}
            col={col}
            worldData={worldData}
            yearRange={yearRange}
            setYearRange={setYearRange}
            dataRangedHighlight={dataRangedHighlight}
          />
          <br />

          {col2 != "N/A" ? (
            <React.Fragment>
              <Scatterplot
                s={s}
                m={m}
                col={col}
                col2={col2}
                yearRange={yearRange}
                dataRangedEnds={dataRangedEnds}
                highlight={highlight}
                toggleHighlight={toggleHighlight}
              />
            </React.Fragment>
          ) : yearRange[0] != yearRange[1] ? (
            <Linegraph
              s={s}
              m={m}
              t={t}
              col={col}
              yScale={yScale}
              yearRange={yearRange}
              highlight={highlight}
              toggleHighlight={toggleHighlight}
              dataInDateRange={dataInDateRange}
              setTooltipContent={setTooltipContent}
            />
          ) : (
            <React.Fragment>
              <Barcode
                s={s}
                m={m}
                col={col}
                yScale={yScale}
                yearRange={yearRange}
                highlight={highlight}
                toggleHighlight={toggleHighlight}
                dataYearOnly={dataYearOnly}
              />
            </React.Fragment>
          )}
          <svg width={s} height={s} col={col} col2={col2} yearRange={yearRange}>
            <WorldMap
              col={col}
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
