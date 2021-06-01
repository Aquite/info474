import React from "react";
import { AxisLeft } from "@vx/axis";
import ReactTooltip from "react-tooltip";

const halfCodeWidth = 30;

const Barcode = ({
  s,
  m,
  col,
  yScale,
  yearRange,
  highlight,
  toggleHighlight,
  dataYearOnly,
}) => {
  return (
    <React.Fragment>
      <svg width={s} height={s}>
        <AxisLeft
          scale={yScale}
          top={0}
          left={s / 2 - m * 2}
          stroke={"#333333"}
          tickTextFill={"#333333"}
          label={col + " in " + yearRange[0]}
        />
        {dataYearOnly(yearRange[0]).map((d, i) => {
          if (d[col] != 0) {
            const h = highlight.has(d["Country Code"]) === true;
            return (
              <React.Fragment key={i}>
                <line
                  key={i + " barcode"}
                  x1={s / 2 - halfCodeWidth - (h ? 10 : 0)}
                  y1={yScale(d[col])}
                  x2={s / 2 + halfCodeWidth + (h ? 10 : 0)}
                  y2={yScale(d[col])}
                  fill="none"
                  stroke={h ? "#776865" : "steelblue"}
                  strokeOpacity={h ? 0.5 : 0.33}
                  onClick={() => toggleHighlight(d)}
                  data-tip={
                    d["Country Name"] +
                    ": " +
                    Math.round(d[col] * 100) / 100 +
                    "%"
                  }
                  data-for={"line"}
                >
                  <title>{d["Country Name"]}</title>
                </line>
              </React.Fragment>
            );
          }
        })}
      </svg>
      <ReactTooltip id={"line"}></ReactTooltip>
    </React.Fragment>
  );
};

export default Barcode;
