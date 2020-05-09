import React , {useState, useRef} from 'react';
import { Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group';

export function Page(props) {
  const ref = useRef(null);

  function onEnter(history) {
    ref.current.style.position = 'fixed';
  }

  function onExit(history) {
    ref.current.style.position = 'fixed';
  }

  function onEntered(history) {
   ref.current.style.position = 'static';
  }

  function onExited(history) {
    ref.current.style.position = 'static';
  }

  return (
    <Route {...props}>{
      ({match}) => {

        return (
        <CSSTransition
          unmountOnExit
          in={match !== null}
          timeout={4300}
          onEnter={onEnter}
          onExit={onExit}
          onEntered={onEntered}
          onExited={onExited}
          classNames="page"
        >
          <div ref={ref} className="page-container">
          {props.children}
          </div>
        </CSSTransition>
      )
      }
    }</Route>
  );
}
