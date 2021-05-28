import React, { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { PatternLines } from "@vx/pattern";

// Relevant constants
const women = "Labor force, female (% of total labor force)";
const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
const colorScale = scaleLinear()
  .domain([0, 70])
  .range(["aliceblue", "steelblue"]);

const changeScale = scaleLinear()
  .domain([-15, 0, 15])
  .range(["#b54646", "#f2f2f2", "#46b557"]);

// WorldMap builds the world map
const WorldMap = ({
  dataRangedEnds,
  setTooltipContent,
  yearRange,
  highlight,
  toggleHighlight,
}) => {
  const data = dataRangedEnds(yearRange);
  return (
    <>
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
                      onMouseEnter={() => {
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
                        onMouseEnter={() => {
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
    </>
  );
};

export default memo(WorldMap);
