import React , { useEffect, useState, useRef} from 'react';
import { Route, useHistory } from 'react-router-dom'
import { map, withLatestFrom } from 'rxjs/operators';
import { CSSTransition } from 'react-transition-group';
import get from 'lodash/get';
import { merge, combineLatest, BehaviorSubject } from 'rxjs';
const ENTER = 'enter';
const ENTERED = 'entered';
const EXIT = 'exit';
const EXITED = 'exited';

const ANIMATION = 'animation';
const LOADING = 'loading';

/*
 *  detect when content is loaded. at that point - show it
 *  That could be at any point. 
 *
 */

export function Page(props) {
  const ref = useRef(document.createElement('div'));
  const [animationEvents$] = useState(new BehaviorSubject());
  const [loadedEvents$] = useState(new BehaviorSubject());
  const history = useHistory();

  let scroll;

  const [enhancedLoadedEvents$] = useState(loadedEvents$.pipe(
    withLatestFrom(animationEvents$),
    map(([loaded, phase]) => ({
      type: LOADING,
      loaded,
      phase,
    })),
  ));

  const [enhancedAnimationEvents$] = useState(animationEvents$.pipe(
    withLatestFrom(loadedEvents$),
    map(([phase, loaded]) => ({
      type: ANIMATION,
      loaded,
      phase,
    })),
  ));

  const [events$] = useState(merge(enhancedLoadedEvents$, enhancedAnimationEvents$));

  useEffect(() => {

    events$.subscribe(({type, loaded, phase}) => {

      if (type === LOADING && loaded) {
        scroll = get(history, 'location.state.scroll', 0);

        switch(phase) {
          case ENTER:

            ref.current.scrollTop = scroll;

            break;
          case ENTERED:

            window.scrollTo(0, scroll);

            setTimeout(() => {
              props.setCanReplaceHistory(true);
            }, 0);

            break;
          default:
            // do nothing
        }
      }

      if (type === ANIMATION) {
        switch(phase) {
          case ENTER:
            props.setCanReplaceHistory(false);

            fixPosition();

            if (loaded) {
              scroll = get(history, 'location.state.scroll', 0);

              ref.current.scrollTop = scroll;
            }

            break;
          case ENTERED:
            unfixPosition();

            if (loaded) {
              scroll = get(history, 'location.state.scroll', 0);

              window.scrollTo(0, scroll);

              setTimeout(() => {
                props.setCanReplaceHistory(true);
              }, 0);
            }


            break;
          case EXIT:
            props.setCanReplaceHistory(false);

            scroll = window.pageYOffset;

            fixPosition();

            ref.current.scrollTop = scroll;

          case EXITED:

          default:
            // do nothing
        }
      }

    });

  }, []);

  function fixPosition() {
    const page = ref.current;

    Object.assign(page.style, {
      position: 'fixed',
    });
  }

  function unfixPosition() {
    const page = ref.current;

    Object.assign(page.style, {
      position: 'static',
    });
  }

  function onEnter(history) {
    animationEvents$.next(ENTER);
  }

  function onEntered(history) {
    animationEvents$.next(ENTERED);
  }

  function onExit(history) {
    animationEvents$.next(EXIT);
  }

  function onExited(history) {
    animationEvents$.next(EXITED);
    loadedEvents$.next(false);
  }
  
  return (
    <Route {...props}>{
      ({match, history}) => {

        return (
        <CSSTransition
          unmountOnExit
          in={match !== null}
          timeout={400}
          onEnter={onEnter.bind(null, history)}
          onExit={onExit.bind(null, history)}
          onEntered={onEntered.bind(null, history)}
          onExited={onExited.bind(null, history)}
          classNames="page"
        >
          <div ref={ref} className="page-container">
            {props.children(loadedEvents$)}
          </div>
        </CSSTransition>
      )
      }
    }</Route>
  );
}
