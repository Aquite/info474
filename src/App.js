import React from "react";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header } from "./Header.js";
import Assignment2 from "./assignment2/Assignment2.js";
import Assignment3 from "./assignment3/Assignment3.js";
import Final from "./final/Final.js";
import Home from "./Home.js";

const App = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/assignment2" component={Assignment2} />
          <Route exact path="/assignment3" component={Assignment3} />
          <Route exact path="/final" component={Final} />
          <Redirect to="/" />
        </Switch>
      </main>
    </div>
  );
};

export default App;
