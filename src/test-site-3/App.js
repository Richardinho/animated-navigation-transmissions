import React, {useRef, useState} from 'react';
import 'reset-css';
import './App.css';
import { useHistory, Switch, BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group';
import { Page } from './page';
import { FooPage } from './foo.page';
import { BarPage } from './bar.page';
import { HomePage } from'./home.page';

window.history.scrollRestoration = 'auto';
window.addEventListener('scroll', () => {
  console.log('scrolling');
});

function App() {

  return (
    <Router>
      
      <div className="App">
        <div className="container">
          <Page exact path="/">
            <HomePage/>
          </Page>

          <Page path="/bar">
            <BarPage/>
          </Page>

          <Page path="/foo">
            <FooPage/>
          </Page>
        </div>
      </div>
    </Router>
  );
}

export default App;
