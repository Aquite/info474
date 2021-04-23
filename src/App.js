import React from "react";
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './Header.js';
import Assignment2 from './assignment2/Assignment2.js';
import Home from './Home.js';


const App = () => {

  return (
    <div className="App">
      <Header />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/assignment2" component={Assignment2} />
          <Redirect to="/" />
        </Switch>
      </main>
    </div>
  );
}


export default App;
