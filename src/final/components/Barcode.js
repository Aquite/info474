import React from "react";
import { AxisLeft } from "@vx/axis";
import ReactTooltip from "react-tooltip";
const halfCodeWidth = 30;
const women = "Labor force, female (% of total labor force)";

const Barcode = ({
  s,
  m,
  yScale,
  yearRange,
  highlight,
  toggleHighlight,
  dataYearOnly,
  setTooltipContent,
}) => {
  return (
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
            <React.Fragment key={i}>
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
                data-tip={
                  d["Country Name"] +
                  ": " +
                  Math.round(d[women] * 100) / 100 +
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
  );
};

export default Barcode;
