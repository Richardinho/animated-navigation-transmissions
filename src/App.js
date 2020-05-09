import React, {useRef, useState} from 'react';
import 'reset-css';
import './App.css';
import { useHistory, Switch, BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group';
import { Page } from './page';
import { FooPage } from './foo.page';
import { BarPage } from './bar.page';
import { HomePage } from'./home.page';
import { PageContainer } from './page-container';

window.history.scrollRestoration = 'manual';
window.addEventListener('scroll', () => {
  //console.log('scrolled');
});

function App() {
  const canReplaceHistory = useRef(true);

  function setCanReplaceHistory(can) {
    canReplaceHistory.current = can;
  }

  return (
    <Router>
      
      <div className="App">
        <div className="container">
          <PageContainer canReplaceHistory={canReplaceHistory}>
            <Page name="Home" exact path="/">
              {(loadedEvent$) => (
                <HomePage loadedEvent={loadedEvent$}/>
              )}
            </Page>

            <Page setCanReplaceHistory={setCanReplaceHistory} name="Bar" path="/bar">
              {(loadedEvent$) => (
                <BarPage loadedEvent={loadedEvent$}/>
              )}
            </Page>

            <Page setCanReplaceHistory={setCanReplaceHistory} name="Foo" path="/foo">
              {(loadedEvent$) => (
                <FooPage loadedEvent={loadedEvent$}/>
              )}
            </Page>
          </PageContainer>

        </div>
      </div>
    </Router>
  );
}

export default App;
