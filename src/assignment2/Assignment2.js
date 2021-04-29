import React from "react";
import { useFetch } from "./hooks/useFetch";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { extent, max, bin, rollup, group, mean } from "d3-array";
import { scaleLinear, scaleSqrt } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";

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

  // Visualization Seven: Change in Deltas (histogram)
  const binForce = bin().thresholds(20);
  const bucketsForce = binForce(
    dataFemChange.map((d) => {
      return +d[1][women] - d[0][women];
    })
  );
  const forceYScale = scaleLinear()
    .domain([
      0,
      max(
        bucketsForce.map((bin) => {
          return bin.length;
        })
      ),
    ])
    .range([0, s - m * 2]);
  // Visualization Eight: Choropleth
  const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
  const colorScale = scaleLinear()
    .domain([0, 60])
    .range(["aliceblue", "steelblue"]);

  return (
    <div>
      <h2>Assignment 2</h2>
      <h4>Data Choice</h4>
      <p>
        For my exploratory data analysis, I took World Bank data on Social
        Protection and Labor, specifically focusing on the metric of the number
        of women in the workforce as a percentage of the total workforce.
      </p>
      <h4>Questions</h4>
      <p>
        I had many questions about the dataset, specifically focusing on issues
        regarding inequality in the workforce:
      </p>
      <ul>
        <li>
          What is the percentage of women in the workforce of the total
          workforce globally?
        </li>
        <li>How does this percentage vary by country?</li>
        <li>How has this percentage varied over time</li>
        <li>
          Do specific geopolitical regions have lower percentages of women
          versus men in their workforce?
        </li>
        <li>Does the size of the workforce alter the female percentage?</li>
        <li>What can we do to reach 50% globally?</li>
      </ul>
      <h4>Analysis Process</h4>
      <p>
        This dataset was somewhat difficult to work with. It was formatted to
        work in Tableau, which unfortunately resulted in all "null" values being
        inputed as "0". Logically, I can assume that none of the fields I worked
        with would actually be zero, but it is still awkward to filter out data
        points at "0" instead of null. The other difficult part about working
        with this data is that it included entries for entities that were not
        countries. Including this data, with the European Union for example,
        would double-count some countries. I couldn't find a comprehensive list
        of codes this applies to on the World Bank website so I had to manually
        find and remove them.
      </p>
      <p>
        To prepare this data set for analysis, after filtering out the 0 values
        and entries with bad codes, I performed different functions for some of
        my visualizations. For most of the visualizations, I filtered the data
        to only include entries from 2017. For one visualization, I used a
        rollup function to take the mean of all countries for each year. For
        ones comparing data from 1991 and 2017, I filtered the data for both
        years and organized it into a two-dimensional array. I used a bin
        function after eliminating two outliers to create my histogram.
      </p>
      <h4>Lessons Learned</h4>
      <p>
        I learned that in most countries, just under 50% of the workforce is
        female. The size of the workforce does not appear to affect this
        percentage, however the geographical location is correlated, with MENA
        countries having significantly smaller percentage of the workforce being
        female. The percentage has increased slightly over time, but individual
        countries may vary wildly. Future analysis could focus on countries that
        saw a decrease in this percentage, and countries at the lower end of the
        scale. It would be interesting to see whether countries with robust FMLA
        leave and support for working parents see an increase in this
        percentage.
      </p>
      {loading ? (
        <p>loading data...</p>
      ) : (
        <Tabs defaultActiveKey="women" id="assignment-2-tabs">
          <Tab eventKey="women" title="Female Labor Force 2017 (Barcode)">
            <h5>
              Female labor force as a percentage of the total labor force in
              2017
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
              This chart shows the female to male ratio of the world labor
              force. Each line on the bar graph represents a country. Most
              countries appear to be roughly evenly divided, with just under 50%
              of the workforce being female. However, the data also skews left,
              indicating many countries contain few women in the workforce while
              no countries contain few men.
            </p>
          </Tab>
          <Tab
            eventKey="menawomen"
            title="Female Labor Force in MENA, 2017 (Barcode)"
          >
            <h5>
              Female labor force as a percentage of the total labor force in
              2017 with the MENA region in red
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
              The MENA region consists of countries from the Middle East and
              North Africa. I've highlighted those countries in red and extended
              them to be visible without requiring color. All of the MENA
              countries fail to pass 25% female workforce, with the solitary of
              outlier of Israel at around 46%. Palestine is not included in the
              dataset.
            </p>
          </Tab>
          <Tab
            eventKey="averagefemale"
            title="Average Female Labor, 1991-2017 (line)"
          >
            <h5>
              Average female labor force among recorded countries as a
              percentage of total labor force among recorded countries from 1991
              to 2017
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
            title="Change in Female Labor, 1991-2017 (line2)"
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
            title="Change in Female Labor with MENA focus, 1991-2017 (line2)"
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
              are higher than they are farther, and are represented in blue
              above the dividing line. Points further from the line have the
              biggest change. I also set the radius of the circles to represent
              the raw number of female workers in 2017.
            </p>
          </Tab>
          <Tab
            eventKey="force"
            title="Change in Female Labor, 1991-2017 (Histogram)"
          >
            <h5>
              Net change in female labor force as a percentage of total labor
              force from 1991 to 2017{" "}
            </h5>
            <svg width={s} height={s} style={{ border: "1px solid black" }}>
              <text
                textAnchor="middle"
                x={m}
                y={s - m / 2}
                style={{
                  fontSize: 10,
                  fontFamily: "Gill Sans, sans serif",
                }}
              >
                -12
              </text>
              <text
                textAnchor="middle"
                x={m + 11 * 12}
                y={s - m / 2 - 3}
                style={{
                  fontSize: 10,
                  fontFamily: "Gill Sans, sans serif",
                }}
              >
                0
              </text>
              <text
                textAnchor="middle"
                x={m + 11 * 26}
                y={s - m / 2}
                style={{
                  fontSize: 10,
                  fontFamily: "Gill Sans, sans serif",
                }}
              >
                +14
              </text>
              <text
                textAnchor="end"
                x={m - 1}
                y={m + 3}
                style={{
                  fontSize: 10,
                  fontFamily: "Gill Sans, sans serif",
                }}
              >
                27
              </text>
              <text
                textAnchor="middle"
                x={m - 8}
                y={s / 2}
                style={{
                  fontSize: 10,
                  fontFamily: "Gill Sans, sans serif",
                  textOrientation: "mixed",
                  writingMode: "vertical-lr",
                }}
              >
                # of Countries
              </text>
              <text
                textAnchor="middle"
                x={m + 11 * 13}
                y={s - m / 2 + 5}
                style={{
                  fontSize: 10,
                  fontFamily: "Gill Sans, sans serif",
                }}
              >
                Change from 1991-2017
              </text>
              {bucketsForce.map((bin, i) => {
                const highlight = i < 12;
                return (
                  <rect
                    key={"force " + i}
                    y={s - m - forceYScale(bin.length)}
                    width="10"
                    height={forceYScale(bin.length)}
                    x={20 + i * 11}
                    fill={highlight ? "palevioletred" : "steelblue"}
                  />
                );
              })}
            </svg>
            <p>
              This chart depicts a histogram of the percentage of the labor
              force that is female in 1997 subtracted from the same number in
              2017. Most countries experienced a slight shift higher. This
              chart, with other data removed, makes it easy to see that most
              countries experienced a positive shift, with positive changes in
              blue and negative changes in red.
            </p>
          </Tab>
          <Tab eventKey="chloro" title="Female Labor Force 2017 (Chloropleth)">
            <h5>
              Female labor force as a percentage of the total labor force in
              2017
            </h5>
            <svg width={s} height={s} style={{ border: "1px solid black" }}>
              <ComposableMap
                projectionConfig={{
                  rotate: [-10, 0, 0],
                  scale: 147,
                }}
              >
                <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
                <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const d = data2017.find(
                        (s) => s["Country Code"] === geo.properties.ISO_A3
                      );
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={d ? colorScale(d[women]) : "#F5F4F6"}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </svg>
            <p>
              This is a choropleth map of female to male ratio of the world
              labor force. The darker the map color the higher ratio of women,
              capping at 60% with the color 'steelblue'. My predictions about
              the MENA region holding the lowest ration turned out to be
              correct, with a visible lighter belt from it's neighbors. No data
              exists for some countries like Greenland, denoted in an off-white
              color. I used react-simple-maps to build my map because I'd rather
              not deal with topojson, thanks, so sue me.
            </p>
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default Assignment2;
