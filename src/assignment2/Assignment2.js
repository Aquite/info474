import React from "react";
import { useFetch } from "./hooks/useFetch";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { extent, max, bin, rollup, group, mean } from "d3-array";
import { scaleLinear, scaleSqrt } from "d3-scale";

const Assignment2 = () => {
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

  // Visualization Five: Female Labor force
  /*const binFemale = bin().thresholds([0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
  const bucketsFemale = binFemale(
    data2017.map((d) => {
      if (+d[women] != 0) {
        console.log(d["Country Name"], d[women]);
        return +d[women];
      }
    })
  );
  console.log(
    extent(
      data2017.map((d) => {
        if (d[women] != 0) {
          return +d[women];
        }
      })
    )
  );
  console.log(bucketsFemale);
  const femYScale = scaleLinear()
    .domain([
      0,
      max(
        bucketsFemale.map((bin) => {
          return bin.length;
        })
      ),
    ])
    .range([0, s - m * 2]);*/

  // Visualization Six: Unemployment by country in 2015

  return (
    <div>
      <h4>These are my assignment 2 visualizations</h4>
      <p>{loading && "loading data!"}</p>
      <Tabs defaultActiveKey="women" id="assignment-2-tabs">
        <Tab eventKey="women" title="Female Labor Force 2017 (Barcode)">
          <h5>
            Female labor force as a percentage of the total labor force in 2017
          </h5>
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
          <p>
            This chart shows the female to male ratio of the world labor force.
            Each line on the bar graph represents a country. Most countries
            appear to be roughly evenly divided, with just under 50% of the
            workforce being female. However, the data also skews left,
            indicating many countries contain few women in the workforce while
            no countries contain few men.
          </p>
        </Tab>
        <Tab
          eventKey="menawomen"
          title="Female Labor Force in MENA, 2017 (Barcode)"
        >
          <h5>
            Female labor force as a percentage of the total labor force in 2017
            with the MENA region in red
          </h5>
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            {yLabels(s / 2 - halfCodeWidth)}
            {data2017.map((d, i) => {
              if (d[women] != 0) {
                const highlight = MENA.includes(d["Country Code"]) === true;
                return (
                  <line
                    key={i}
                    x1={s / 2 - halfCodeWidth}
                    y1={yScale(d[women])}
                    x2={s / 2 + halfCodeWidth + (highlight ? 10 : 0)}
                    y2={yScale(d[women])}
                    fill="none"
                    stroke={highlight ? "red" : "steelblue"}
                    strokeOpacity={highlight ? 0.5 : 0.33}
                  />
                );
              }
            })}
          </svg>
          <p>
            The MENA region consists of countries from the Middle East and North
            Africa. I've highlighted those countries in red and extended them to
            be visible without requiring color. All of the MENA countries fail
            to pass 25% female workforce, with the solitary of outlier of Israel
            at around 46%. Palestine is not included in the dataset.
          </p>
        </Tab>
        <Tab
          eventKey="averagefemale"
          title="Average Female Labor, 1991-2017 (line)"
        >
          <h5>
            Average female labor force among recorded countries as a percentage
            of total labor force among recorded countries from 1991 to 2017
          </h5>
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            {yLabels(m + 30)}
            {femaleWorldTimeline.map((d, i) => {
              if (i != 0) {
                return (
                  <React.Fragment>
                    <line
                      key={i}
                      x1={timeScale(femaleWorldTimeline[i - 1][0])}
                      y1={yScale(femaleWorldTimeline[i - 1][1])}
                      x2={timeScale(d[0])}
                      y2={yScale(d[1])}
                      fill="none"
                      stroke={"steelblue"}
                    />
                    <line
                      key={"label " + i}
                      x1={timeScale(d[0])}
                      y1={s - m}
                      x2={timeScale(d[0])}
                      y2={m}
                      opacity={0.3}
                      fill="none"
                      stroke={"black"}
                    />
                    {d[0] % 5 == 0 ? (
                      <text
                        key={"year" + i}
                        textAnchor="middle"
                        x={timeScale(d[0])}
                        y={s - m / 2}
                        style={{
                          fontSize: 10,
                          fontFamily: "Gill Sans, sans serif",
                        }}
                      >
                        {d[0]}
                      </text>
                    ) : (
                      <text />
                    )}
                  </React.Fragment>
                );
              } else {
                return (
                  <React.Fragment>
                    <line
                      key={"label " + i}
                      x1={timeScale(d[0])}
                      y1={s - m}
                      x2={timeScale(d[0])}
                      y2={m}
                      opacity={0.3}
                      fill="none"
                      stroke={"black"}
                    />
                  </React.Fragment>
                );
              }
            })}
          </svg>
          <p>
            Although we can see the female labor force roughly increasing, it
            isn't at a significant enough pace to reach 50% anytime soon. This
            indicates that globally, the world is unequal. Note: this is an
            average of all countries, not weighted by population, so it is not
            the percentage of the world labor force that is female.
          </p>
        </Tab>
        <Tab
          eventKey="changes"
          title="Change in Female Labor, 1991-2017 (idk what to call this one)"
        >
          <h5>
            Change in female labor force as a percentage of total labor force
            from 1991 to 2017
          </h5>
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            <line x1={s / 4} y1={m} x2={s / 4} y2={s - m} stroke={"black"} />
            <line
              x1={s - s / 4}
              y1={m}
              x2={s - s / 4}
              y2={s - m}
              stroke={"black"}
            />
            <text
              textAnchor="middle"
              x={s / 4}
              y={s - m / 2}
              style={{
                fontSize: 10,
                fontFamily: "Gill Sans, sans serif",
              }}
            >
              1991
            </text>
            <text
              textAnchor="middle"
              x={s - s / 4}
              y={s - m / 2}
              style={{
                fontSize: 10,
                fontFamily: "Gill Sans, sans serif",
              }}
            >
              2017
            </text>
            {yLabels(s / 4)}
            {dataFemChange.map((d, i) => {
              const highlight = +d[0][women] < +d[1][women];
              return (
                <line
                  key={"change" + i}
                  x1={s / 4}
                  y1={yScale(d[0][women])}
                  x2={s - s / 4}
                  y2={yScale(d[1][women])}
                  fill="none"
                  stroke={highlight ? "steelblue" : "palevioletred"}
                  strokeOpacity={0.33}
                />
              );
            })}
          </svg>
          <p>
            This chart shows the net change in female labor force as a
            percentage of the total labor force by country between 1991 and
            2017. Countries that increased the percentage of women in the
            workforce are depicted in blue while countries that decreased the
            percentage are depicted in red. Despite the previous observation's
            findings that the total percentage barely changed, from this graph
            we can see that individual countries frequently changed
            significantly.
          </p>
        </Tab>
        <Tab
          eventKey="changesMENA"
          title="Change in Female Labor with MENA focus, 1991-2017 (idk what to call this one)"
        >
          <h5>
            Change in female labor force as a percentage of total labor force
            from 1991 to 2017 (MENA)
          </h5>
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            <line x1={s / 4} y1={m} x2={s / 4} y2={s - m} stroke={"black"} />
            <line
              x1={s - s / 4}
              y1={m}
              x2={s - s / 4}
              y2={s - m}
              stroke={"black"}
            />
            <text
              textAnchor="middle"
              x={s / 4}
              y={s - m / 2}
              style={{
                fontSize: 10,
                fontFamily: "Gill Sans, sans serif",
              }}
            >
              1991
            </text>
            <text
              textAnchor="middle"
              x={s - s / 4}
              y={s - m / 2}
              style={{
                fontSize: 10,
                fontFamily: "Gill Sans, sans serif",
              }}
            >
              2017
            </text>
            {yLabels(s / 4)}
            {dataFemChange
              .filter((d) => {
                return MENA.includes(d[0]["Country Code"]) === true;
              })
              .map((d, i) => {
                const highlight = +d[0][women] < +d[1][women];
                return (
                  <line
                    key={"menaChange" + i}
                    x1={s / 4}
                    y1={yScale(d[0][women])}
                    x2={s - s / 4}
                    y2={yScale(d[1][women])}
                    fill="none"
                    stroke={highlight ? "steelblue" : "palevioletred"}
                    strokeOpacity={0.5}
                  />
                );
              })}
          </svg>
          <p>
            This chart is identical to the previous chart, except filtered for
            MENA countries. While MENA countries still remain significantly
            lower than average, most increased the female percentage of their
            workforce. More data is needed as to why, but we can say MENA as a
            whole is slightly improving.
          </p>
        </Tab>
        <Tab
          eventKey="femchangescatter"
          title="Change in Female Labor, 1991-2017 (Scatterplot)"
        >
          <h5>
            Change in female labor force as a percentage of total labor force
            from 1991 to 2017
          </h5>
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            <text
              x={s - m - 12}
              textAnchor="end"
              y={m + t}
              style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
            >
              100%
            </text>
            <text
              x={m + 10 + 2}
              textAnchor="start"
              y={s - m + t}
              style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
            >
              0%
            </text>
            <line x1={s - m - 10} y1={m} x2={s - m} y2={m} stroke={"black"} />
            <line x1={m} y1={s - m} x2={m + 10} y2={s - m} stroke={"black"} />
            <line x1={m} y1={s - m} x2={s - m} y2={m} stroke={"black"} />
            <text
              textAnchor="middle"
              x={m}
              y={s / 2}
              style={{
                fontSize: 15,
                fontFamily: "Gill Sans, sans serif",
              }}
            >
              2017
            </text>
            <text
              textAnchor="middle"
              x={s / 2}
              y={s - m}
              style={{
                fontSize: 15,
                fontFamily: "Gill Sans, sans serif",
              }}
            >
              1991
            </text>
            {dataFemChange.map((d, i) => {
              const highlight = +d[0][women] < +d[1][women];
              if (
                d[0]["Country Code"] == "CHN" ||
                d[0]["Country Code"] == "IND"
              ) {
                console.log(d);
              }

              return (
                <circle
                  key={"changescatter" + i}
                  cx={s - yScale(+d[0][women])}
                  cy={yScale(+d[1][women])}
                  r={radScale(
                    +d[1]["Labor force, total"] * +d[1][women] * 0.01
                  )}
                  fill={highlight ? "steelblue" : "palevioletred"}
                  stroke={highlight ? "steelblue" : "palevioletred"}
                  strokeOpacity={0.4}
                  fillOpacity={0.4}
                />
              );
            })}
          </svg>
          <p>
            This chart shows the net change in female labor force as a
            percentage of the total labor force by country between 1991 and
            2017. Countries that increased the % of women in their labor force
            are higher than they are farther, and are represented in blue above
            the dividing line. Points further from the line have the biggest
            change. I also set the radius of the circles to represent the raw
            number of female workers in 2017.
          </p>
        </Tab>
        {/*<Tab eventKey="safety" title="Social Safety Net (Barcode)">
          <h5>
            Adequacy of social safety net programs (% of total welfare of
            beneficiary households) by country in 2010
          </h5>
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            <text
              x={s / 2 - halfCodeWidth - 12}
              textAnchor="end"
              y={m + t}
              style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
            >
              100
            </text>
            <text
              x={s / 2 - halfCodeWidth - 12}
              textAnchor="end"
              y={s - m + t}
              style={{ fontSize: 15, fontFamily: "Gill Sans, sans serif" }}
            >
              0
            </text>
            <line
              x1={s / 2 - halfCodeWidth - 10}
              y1={m}
              x2={s / 2 - halfCodeWidth}
              y2={m}
              stroke={"black"}
            />
            <line
              x1={s / 2 - halfCodeWidth - 10}
              y1={s - m}
              x2={s / 2 - halfCodeWidth}
              y2={s - m}
              stroke={"black"}
            />
            {data2017.map((d, i) => {
              if (d[safetyNet] != 0) {
                return (
                  <line
                    key={"safety" + i}
                    x1={s / 2 - halfCodeWidth}
                    y1={yScale(d[safetyNet])}
                    x2={s / 2 + halfCodeWidth}
                    y2={yScale(d[safetyNet])}
                    fill="none"
                    stroke={"steelblue"}
                    strokeOpacity={0.5}
                  />
                );
              }
            })}
          </svg>
          <h5>From WorldBank:</h5>
          <p>
            "Adequacy of social safety net programs is measured by the total
            transfer amount received by the population participating in social
            safety net programs as a share of their total welfare. Welfare is
            defined as the total income or total expenditure of beneficiary
            households. Social safety net programs include cash transfers and
            last resort programs, noncontributory social pensions, other cash
            transfers programs (child, family and orphan allowances, birth and
            death grants, disability benefits, and other allowances),
            conditional cash transfers, in-kind food transfers (food stamps and
            vouchers, food rations, supplementary feeding, and emergency food
            distribution), school feeding, other social assistance programs
            (housing allowances, scholarships, fee waivers, health subsidies,
            and other social assistance) and public works programs (cash for
            work and food for work). Estimates include both direct and indirect
            beneficiaries."
          </p>
          <p>
            Thus, we can see that for the majority of countries, saftey net
            programs are often inadequate and fail to meet the expenditures of
            beneficiary households
          </p>
        </Tab>
        <Tab
          eventKey="children"
          title="Male vs Female Child Labor (Scatterplot)"
        ></Tab>
        <Tab eventKey="unemploy" title="Unemployment (Geodata)"></Tab>
        <Tab eventKey="five" title="Five">
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            {bucketsFemale.map((bin, i) => {
              return (
                <rect
                  key={i}
                  y={s - m - femYScale(bin.length)}
                  width="10"
                  height={femYScale(bin.length)}
                  x={20 + i * 11}
                />
              );
            })}
          </svg>
          <svg width={s} height={s} style={{ border: "1px solid black" }}>
            {bucketsFemale.map((bin, i) => {
              const sf = bin.length * 16;
              return (
                <rect y={s - m - sf} width="10" height={sf} x={20 + i * 11} />
              );
            })}
          </svg>
        </Tab>*/}
      </Tabs>
    </div>
  );
};

export default Assignment2;
