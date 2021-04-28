import React from "react";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header } from "./Header.js";
import Assignment2 from "./assignment2/Assignment2.js";
import Home from "./Home.js";

const App = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <Switch>
          <Route exact path="/info474" component={Home} />
          <Route exact path="/info474/assignment2" component={Assignment2} />
          <Redirect to="/info474" />
        </Switch>
      </main>
    </div>
  );
};

export default App;
