import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './app.css';

import { Foo} from './foo';
import { Bar } from './bar';
import { Home } from './home';

window.addEventListener('scroll', () => {
  console.log('scrolling');
});
window.history.scrollRestoration = 'manual';

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/foo">Foo</Link>
            </li>
            <li>
              <Link to="/bar">Bar</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/foo">
            <Foo />
          </Route>
          <Route path="/bar">
            <Bar />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
