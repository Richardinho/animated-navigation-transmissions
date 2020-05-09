import React, {useRef } from 'react';
import 'reset-css';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import { Page } from './page';
import { FooPage } from './foo.page';
import { BarPage } from './bar.page';
import { HomePage } from'./home.page';
import { PageContainer } from './page-container';

window.history.scrollRestoration = 'manual';

function App() {
  const canReplaceHistory = useRef(true);

  function enableScrollHandler() {
    canReplaceHistory.current = true;
  }

  function disableScrollHandler() {
    canReplaceHistory.current = false;
  }

  return (
    <Router>
      
      <div className="App">
        <div className="container">
          <PageContainer canReplaceHistory={canReplaceHistory}>
            <Page
              enableScrollHandler={enableScrollHandler}
              disableScrollHandler={disableScrollHandler}
              exact
              path="/">
              {(loadedEvent$) => (
                <HomePage loadedEvent={loadedEvent$}/>
              )}
            </Page>

            <Page
              enableScrollHandler={enableScrollHandler}
              disableScrollHandler={disableScrollHandler}
              path="/bar">
              {(loadedEvent$) => (
                <BarPage loadedEvent={loadedEvent$}/>
              )}
            </Page>

            <Page
              enableScrollHandler={enableScrollHandler}
              disableScrollHandler={disableScrollHandler}
              path="/foo">
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
