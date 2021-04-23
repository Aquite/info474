import React from "react";
import { useFetch } from "./hooks/useFetch";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const Assignment2 = () => {

  const [data, loading] = useFetch(
    "https://raw.githubusercontent.com/Aquite/react-parcel-example-1/main/weather.csv"
  );

  return (
    <div>
      <h4>These are my assignment 2 visualizations</h4>
      <p>{ loading && "loading data!" }</p>
      <Tabs defaultActiveKey="birds" id="assignment-2-tabs">
        <Tab eventKey="birds" title="Birds Threatened">
          
        </Tab>
        <Tab eventKey="two" title="Two">
        </Tab>
        <Tab eventKey="three" title="Three">
        </Tab>
        <Tab eventKey="four" title="Four">
        </Tab>
        <Tab eventKey="five" title="Five">
        </Tab>
        <Tab eventKey="six" title="Six">
        </Tab>
        <Tab eventKey="seven" title="Seven">
        </Tab>
        <Tab eventKey="eight" title="Eight">
        </Tab>
      </Tabs>
    </div>
  );
}


export default Assignment2;
