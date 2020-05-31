# Animated page transitions in a Single Page App

##  Introduction
In a Single Page App, we can take control of the routing process and update the content of the page in response to URL changes without having to perform a full page refresh. 
A nice thing that this permits us to do is have animated transitions between the old and new content. This, however, can be somewhat tricky to implement. We want to avoid the common pitfall of improving the user experience in one aspect whilst degrading it in another.  This article describes an attempt at such an implementation using React and React Router.

## Preparation
In order to simulate page navigation, it's important to first understand how navigation takes place in a conventional website.
This is because any implementation of routing must be at least as good as the native behaviour.

Page navigation occurs in the following cases:
* When the user clicks on a link
* When the user types an address into the address bar and presses *return*
* When the user clicks the *back* or *forwards* history buttons
* When the user refreshes the page

In all these cases, the existing page is destroyed and replaced with a new one. All resources have to be reloaded and Javascript is reparsed and re-executed.

Another subtle effect, is that when a page is revisited either by clicking one of the History buttons, or by reloading the page, the scroll position that existed when the page was last loaded is restored.

The last is the sort of effect which users may not consciously be aware of but which they notice if it happens to be absent.

## The App
What I am building is an application which features 3 pages of content. There are links to these pages interspersed across the application. When the user clicks on a link, the old page is animated out and the new page is animated in. Additionally, when the user navigates back (or forwards) to a previously visited page, the scroll position that existed when they left will be restored.

### Set up and libraries used
My demonstration implementation is built using React and using the libraries React Router for routing, CSS Transition Group for animated effects, and RxJS for Observables. I also use Lodash for some utility methods. 
The application is set up using create react app which provides a nice foundation for React projects.

### Routing
Setting up the routing is the easiest part and so I'm not going to go into it. The React Router has a good tutorial on this subject which describes the process much better than I could.

### Implementation Details
The CSSTransition component is used for the animation here. What this component does is define a transition as a series of temporal phases through which the component passes. During each phase, class names are applied and removed to the animated element. The programmer is able to hook into these class names to apply CSS properties that carry out the animation effect.

Our animation consists of the old page sliding out to the left and the new page sliding in from the right in the same direction. Normally, a page will just be positioned statically within the browser, but during the animation we need to handle the fact that both pages will be visible at the same time. To achieve this, we hook into phases provided by CSSTransition component. When the ENTER phase begins, we fix the position of both incoming and outgoing pages by setting their css property `position: fixed`. Once we reach the ENTERED phase, we set the position of the incoming pages property to `static` (At this point we don't care anymore about the outgoing page). 

This is fairly standard stuff. Things get much more complicated when we come to restoring the scroll position of previously visited pages. The first thing we have to address here is that the browser itself will try and do this for us on a pop event. The problem is that it doesn't do it very well, particularly if any content is loaded asynchronously. Fortunately we have the ability to turn this off, which we do by setting `window.history.scrollRestoration = 'manual'`

In order to manually restore the scroll, we need to know the scroll position of a page when it is navigated away from. In an ideal world, the browser would store this somewhere for us, but it does not. We need therefore to record the scroll value when the user navigates away from a page, and find a place to store it. Finding the time at which to record it is hard because the user can perform this navigation in more than one way. If they click on a link, we could certainly hook into this and record the scroll value. But if they navigate using the *Back* or *Forward* buttons, then we cannot. The Pop event occurs after the navigation occurs, not before. So in fact there is no comprehensive way of detecting when the user is going to navigate away from the page.

However, there is a workaround. Instead of measuring the scroll when the user performs a navigation, we measure it after every time that they scroll. That way when the use does navigate, we will always already have the scroll value stored.

```
    window.addEventListener('scroll', () => {

      /*
       *  We only want this to run after the user has stopped scrolling
       */

      clearTimeout(timeoutId.current);

      const tid = setTimeout(() => {
        if (canReplaceHistory.current) {
          
          const path = history.location.pathname;
          history.replace(path, { scroll: window.pageYOffset});
        }
      }, 500);

      timeoutId.current = tid;
    });

```
You can see in this code that we debounce the scroll handler as we don't want to run it on every scroll event; only after the user has stopped scrolling, which we define as being half a second without a scroll event happening. After measuring the scroll value, we store it in the history state object. This makes it readily available when we need to use it on a future pop event.

We now need to determine the time at which to restore the scroll position of a page.
Given that we are loading our content asynchronously, we need to wait until this content is present before we set the scroll.
But we also take into consideration our previously described animation phases because how we reset the scroll will be different according to whether an animation is still taking place or not. For example, if the animation has completed when the content is loaded in, we can simply set the scroll with window.scrollTo as normal, but if the animation is still going on then we need to take account of the fact that the position of the page is currently fixed.

The best way to make sense of this behaviour is to model it as a series of events.

For the incoming page:
1. The transition begins. 
2. The transition ends.
3. Content is loaded from the network

For the outgoing page:
1. The transition begins
2. The transition ends

For the incoming page, events 1 and 2 always occur in that order. Event 3, however, can occur at any point, even at the start.

So we have a series of events whose order is unpredictable, on which we need to run some code.

If this suggests Observables to you, then you're thinking along the same lines as me. 

Observables are streams of events on which we can register subscribers which will handle each of these events. Libraries such as RxJS, which we use here, allow these streams to be manipulated in many ways: merged with other streams, filtered, mapped to other events etc.

Whilst they are powerful, they can be complex and hard to reason about. Marble diagrams can be helpful to describe these.
A Marble Diagram is a representation of an observable where the flow of time is shown as an arrow going from left to right, and the events are positioned along this arrow. 

Here is an example which shows our two basic observables.

```
   animation events
   -----d----e-------f-------->
 
   content loaded events
   ---3-----------4----------->
   
```
In the first one, `d`, `e`, and `f` are animation events that can occur in any order.
In the second one `3` and `4` are events when content is loaded.

In order to solve the problem where we need to know about the latest animation event when we handle a content loaded event we can create an observable that combines these two observables using the `withLatestForm` operator.

```
   content loaded events with last animation event
   ----3c-----------4e--------------------->
```
Also when we handle an animation event, we need to know the latest content loaded event so we create an observable that combines the content loaded observable with the animation observable in the same way.
 
```
   ----d3-----e3------f4------->
```
Finally we merge these two Observables together because we want one observable.

```
   ----3c-----d3----e3----4e---f4--->
```

This gives us an observable where each event is either an animation or a content loaded event and contains the latest value of the event of the other kind along with it.

Hopefully, this code makes this a bit more clear:

```
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
  
```
We subscribe to the resultant Observable and can run some fairly straightforward imperative code that does the job of doing the work to make the animations and scroll management work.

## Things that don't work
Scroll restoration doesn't take place when you refresh the app. When this occurs, the history object is completely reset so you lose all data that was stored there. Implementing this would require storing the data some place else.

## Future works and reflections
This application is purely for demonstration purposes and I haven't implemented this in any production app so I can't say for sure how robust it is. 

One thing I didn't take into consideration was the effect of the user resizing the viewport. Probably I would need to implement a handler that runs when the viewport is resized which probably would just reset the scroll to zero.



