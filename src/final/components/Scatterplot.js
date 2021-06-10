import React from "react";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { extent, mean } from "d3-array";
import ReactTooltip from "react-tooltip";

const Scatterplot = ({
  s,
  m,
  col,
  col2,
  yearRange,
  dataRangedEnds,
  highlight,
  toggleHighlight,
}) => {
  const data = dataRangedEnds(yearRange);
  const yr = yearRange[0] == yearRange[1];
  const scatterYScale = scaleLinear()
    .domain(
      extent(
        data.map((d) => {
          return yr ? +d[0][col2] : +d[1][col2] - +d[0][col2];
        })
      )
    )
    .range([s - m * 3, m]);

  const scatterXScale = scaleLinear()
    .domain(
      extent(
        data.map((d) => {
          return yr ? +d[0][col] : +d[1][col] - +d[0][col];
        })
      )
    )
    .range([m * 3, s - m]);

  const radScale = scaleSqrt()
    .domain(
      extent(
        data.map((d) => {
          return yr
            ? +d[0]["Labor force, total"]
            : +d[0]["Labor force, total"] + +d[1]["Labor force, total"] / 2;
        })
      )
    )
    .range([2, 40]);
  return (
    <React.Fragment>
      <svg width={s} height={s}>
        {data.map((c, i) => {
          const h = highlight.has(c[0]["Country Code"]) === true;
          if (
            c[0][col] != 0 &&
            c[0][col2] != 0 &&
            (yr || (c[1][col] != 0 && c[1][col2] != 0))
          ) {
            return (
              <circle
                cx={scatterXScale(yr ? c[0][col] : c[1][col] - c[0][col])}
                cy={scatterYScale(yr ? c[0][col2] : c[1][col2] - c[0][col2])}
                r={radScale(c[0]["Labor force, total"])}
                stroke={h ? "#776865" : "steelblue"}
                fill={h ? "#776865" : "steelblue"}
                strokeOpacity={0.4}
                fillOpacity={0.4}
                onClick={() => toggleHighlight(c[0])}
                data-tip={
                  c[0]["Country Name"] +
                  "<br/>x: " +
                  Math.round(100 * (yr ? c[0][col] : c[1][col] - c[0][col])) /
                    100 +
                  "%<br/>y: " +
                  Math.round(
                    100 * (yr ? c[0][col2] : c[1][col2] - c[0][col2])
                  ) /
                    100 +
                  "%"
                }
                data-for={"scatterplot"}
                key={c["Country Code"]}
              />
            );
          }
        })}
        <AxisBottom
          scale={scatterXScale}
          top={s - m * 3}
          left={0}
          stroke={"#333333"}
          tickTextFill={"#333333"}
          numTicks={5}
          label={
            col +
            (yr
              ? " in " + data[0][0].Year
              : ", net change from " +
                data[0][0].Year +
                " to " +
                data[0][1].Year)
          }
        />
        <AxisLeft
          scale={scatterYScale}
          top={0}
          left={m * 3}
          stroke={"#333333"}
          tickTextFill={"#333333"}
          numTicks={5}
          label={
            col2 +
            (yr
              ? " in " + data[0][0].Year
              : ", net change from " +
                data[0][0].Year +
                " to " +
                data[0][1].Year)
          }
        />
      </svg>
      <ReactTooltip id={"scatterplot"} multiline={true}></ReactTooltip>
    </React.Fragment>
  );
};

export default Scatterplot;
