import React, { useState } from "react";
import SVGBrush from "react-svg-brush";
import { scaleTime } from "@vx/scale";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { bin, group } from "d3-array";

const women = "Labor force, female (% of total labor force)";

const Timeline = ({
  s,
  m,
  col,
  worldData,
  yearRange,
  setYearRange,
  dataRangedHighlight,
}) => {
  const binData = dataRangedHighlight([1991, 2017]);

  const myMax = max(
    binData.map((d) => {
      return +d[1];
    })
  );

  const timeScale = scaleLinear().domain([20, 980]).range([1991, 2018]);
  const timeScaleReverse = scaleTime()
    .domain([new Date(1991, 01, 01), new Date(2018, 01, 01)])
    .range([20, 980]);

  console.log(binData);
  const worldLineScale = scaleLinear()
    .domain([0, myMax])
    .range([s / 4 - m * 2, m]);

  const worldLineScaleReversed = scaleLinear()
    .domain([s / 4 - m * 2, m])
    .range([0, 90]);

  //this function is meant to expand the behavior of SVGBrush, so that we can
  //clear the selection when a year is clicked.
  //It returns an object and two functions, in that order
  // (the selection prop of an SVGBrush must be set to the
  //obkect for proper use, and the two functions are the additional
  //functionality). When the first function , the lockingFunction,
  //is called, the current selection of the SVG Brush is cleared and
  //the SVGBrush is prevented from allowing new brushing. The second function,
  //the unlockingFunction, restores the most recent selection and allows for new
  //selections (basically, it undoes the effects of the first function). If the
  //unlockingfunction is set to be the SVGBrush's onBrushStart callback,
  //then the brush will always allow new selections.
  //
  function clearableBrush() {
    const [selection, setSelection] = useState(undefined);
    function lockingFunction() {
      setSelection(null);
    }
    function unlockingFunction() {
      setSelection(undefined);
    }
    return [selection, lockingFunction, unlockingFunction];
  }

  const [brush, lockBrush, unlockBrush] = clearableBrush();

  return (
    <svg width={s * 2} height={s / 4} className="timeline">
      {binData.map((y) => {
        return (
          <React.Fragment>
            <rect
              width={30}
              height={worldLineScale(myMax - y[1]) - 20}
              x={timeScaleReverse(new Date(y[0], 01, 01))}
              y={worldLineScale(y[1])}
              fill={"#776865"}
            />
            {/*<line
              x1={timeScaleReverse(new Date(d.Year - 1, 01, 01))}
              y1={worldLineScale(worldData[i - 1][women])}
              x2={timeScaleReverse(new Date(d.Year, 01, 01))}
              y2={worldLineScale(d[women])}
              stroke="steelblue"
              key={i + " line"}
            >
              <title>{"World: " + worldData[i - 1][women]}</title>
            </line>*/}
          </React.Fragment>
        );
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
        label={col + " in selected countries"}
        onM
      />
      {[...Array(27).keys()].map((value) => {
        return yearRange[0] == yearRange[1] && yearRange[0] == value + 1991 ? (
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
            onMouseDown={() => {
              lockBrush();
              setYearRange([1991 + value, 1991 + value]);
            }}
          />
        );
      })}
      <SVGBrush
        brushType="x"
        selection={brush}
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
        onBrushStart={unlockBrush}
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
  );
};

export default Timeline;
