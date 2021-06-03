import React from "react";

const ControlGroups = ({ groupings, s, highlight, setHighlight }) => {
  return (
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
                  
            </text>
            <img
                  src={g.icon}
                  ></img>
          </React.Fragment>
        );
      })}
    </svg>
  );
};

export default ControlGroups;
