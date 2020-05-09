import React , { useEffect, useState, useRef} from 'react';
import { Route, useHistory } from 'react-router-dom'
import { map, withLatestFrom } from 'rxjs/operators';
import { CSSTransition } from 'react-transition-group';
import get from 'lodash/get';
import { merge, BehaviorSubject } from 'rxjs';
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

/*
 *  animation events
 *  -----a----b-------c-------d---------->
 *
 *  content loaded events
 *  ---------------1---------------------->
 *
 *  content loaded events with last animation event
 *  ---------------1b--------------------->
 *
 *  animation events with last loaded event
 *  ----a_-----b_------c1----d1------->
 *
 *  merge of previous two Obervables
 *  ----a_----b_----1b---c1----d1---->
 *
 *
 *  There are two kinds of events that we are interested in: Animation events and content loaded events.
 *  When the transition runs, the CSS Transition component fires 4 events: Enter, Entered, Exit, and Exited.
 *  When a component loads content it fires a content loaded event.
 *
 *  The content loaded event can occur at any time. For static content, we need to fire it at the very start of the transition, or just assume that the content loaded state is true.o
 *
 *  To make transition animations work, we need to save the scroll at the right time, then restore it later on. The mechanics of this are quite intricate. In essence, we need to do different things according to the event that is being handled, and subject to which events have already occurred. 
 *
 *
 */

export function Page({ children, enableScrollHandler, disableScrollHandler, ...props}) {
  const ref = useRef(document.createElement('div'));
  const [animationEvents$] = useState(new BehaviorSubject());
  const [loadedEvents$] = useState(new BehaviorSubject());
  const history = useHistory();

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
    let scroll;

    events$.subscribe(({type, loaded, phase}) => {

      if (type === LOADING && loaded) {
        scroll = get(history, 'location.state.scroll', 0);

        switch(phase) {
          case ENTER:

            ref.current.scrollTop = scroll;

            break;
          case ENTERED:

            window.scrollTo(0, scroll);

            enableScrollHandler();

            break;
          default:
            // do nothing
        }
      }

      if (type === ANIMATION) {
        switch(phase) {
          case ENTER:
            disableScrollHandler();

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

              enableScrollHandler();
            }


            break;
          case EXIT:
            disableScrollHandler();

            scroll = window.pageYOffset;

            fixPosition();

            ref.current.scrollTop = scroll;

            break;

          case EXITED:
            break;

          default:
            // do nothing
        }
      }

    });

  }, [loadedEvents$, disableScrollHandler, enableScrollHandler, events$, history]);


  function onEnter() {
    animationEvents$.next(ENTER);
  }

  function onEntered() {
    animationEvents$.next(ENTERED);
  }

  function onExit() {
    animationEvents$.next(EXIT);
  }

  function onExited() {
    animationEvents$.next(EXITED);
    loadedEvents$.next(false);
  }

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
  
  return (
    <Route {...props}>{
      ({match}) => {

        return (
        <CSSTransition
          unmountOnExit
          in={match !== null}
          timeout={400}
          onEnter={onEnter}
          onExit={onExit}
          onEntered={onEntered}
          onExited={onExited}
          classNames="page"
        >
          <div ref={ref} className="page-container">
            {children(loadedEvents$)}
          </div>
        </CSSTransition>
      )
      }
    }</Route>
  );
}
