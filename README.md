<<<<<<< HEAD
# Animated page transitions in a Single Page App

##  Introduction
In a Single Page App, we can take control of the routing process and update the content of the page in response to URL changes without having to perform a full page refresh. 
A nice thing that this permits us to do is have animated transitions between the old and new content. This, however, can be somewhat tricky to implement. We want to avoid the common pitfall of improving the user experience in one aspect whilst degrading it in another.  This article describes an attempt at such an implementation using React and React Router.

In order to simulate page navigation, it's important to first understand how navigation takes place in a conventional website. 
Page navigation occurs in the following cases:
* When the user clicks on a link
* When the user types an address into the address bar and presses *return*
* When the user clicks the *back* or *forwards* history buttons
* When the user refreshes the page

In all these cases, the existing page is destroyed and replaced with a new one. All resources have to be reloaded and Javascript is reparsed and re-executed.

Another subtle effect, is that when a page is revisited either by clicking one of the History buttons, or by reloading the page, the scroll position that existed when the page was last loaded is restored.

______

Any implementation of routing in a SPA must at least replicate the preceding behaviour.
=======
# Animated Transitions with Scroll Restore in a React SPA
Single Page Apps often take control of routing, where the URL in the address bar is changed, and the page appears to be updated but no new HTTP request for a page actually takes place.
This is of course accomplished using the History API, and frameworks for building SPAs often provide libraries to facilitate working with these. In the case of React, which we will cover in this blog post,  [React-Router]() is one popular library used for this purpose.

Our aim in implementing routing should be to emulate, as closely as possible, the default behaviour of the browser. Ideally, the user should be almost unaware that they are using an SPA at all. In particular, the use should be able to use the history back and forward buttons and be able to use revisit pages of the app via Bookmarks.

This is somewhat challenging as it turns out that there are aspects of conventional routing that programmers may not be aware of but which users are likely to notice if absent.

For example, if the user clicks on the *Back* button to go to a previous page, the scroll position of the page when they left it is restored. This also occurs with the *Forward* button and when the page is refreshed.

As well as this, we might also want to enhance the user conventional navigation experience with the addition of animated transitions. In this post, I am going to talk about my experience in implementing this.

## Set up and libraries used
I start with a basic React application created using [Create React App](). In addition, I used React Router for routing, CSS [Transition Group]() for animated effects, and the [RxJS library]() for Observables. I also used Lodash for utility methods (the very useful `get()` function).

Setting up routing using React Router is pretty easy and I'm not going to go into this. For this project I've kept it pretty simple with just two routes. For one of the routes I will be simulating a network request for asynchronous content.
>>>>>>> bc529e91951002cba8c6b080abc6f119eac7d71a

Transition Groups provide some components for creating animations in React. I used the CSSTransition component for this. There is a tutorial in their documentation for using this with React Router and I largely followed this. Again, nothing here is out of the ordinary.

The difficulties start when you want to simulate restoring the page scroll when we navigate to a new page. The animation effect that I wanted to achieve was for the old page to slide out to the left and for the new page to slide in at the same time also from the right. When navigating to a new page, that page will be scrolled to the top. If they navigate to a previously visited page which they had scrolled, the scroll value should be restored.
As it happens, browsers do actually try and carry out this scroll restoration for apps with simulated routing, but it usually ceases to work properly when you start to do anything more complicated. e.g. with animations. In fact, there is a property of the history object `scrollRestoration` which you can set to `manual` in order to disable this browser behaviour.

So how do we go about restoring the scroll position of a page? First we must find a way of storing the scroll value of the page when we leave it. Now, you may be aware that the history list contains a list of all the different URLs visited and that each item in this list contains a state propety in which you can store arbitary information. This property can be set by passing an argument to the `push()` or the `replace()` methods. It seems as if this would be a good place to store our scroll value. The problem is that we need to record this data at the moment the user leaves the page. If they do this by clicking on a link, then we intercept this event, and update the state object then. But if they leave the page by clicking on either the *Back* or *Forward* buttons, then we find that we cannot. It might seem that we could hook into the `pop` event, but unfortunately, the item at the top of the history stack will represent the new page, not the old one, and you can't query the history stack for items either!

So are we stuck? Not quite. What we can do is attach a scroll handler which waits until the user stop scrolling and then queries the page current scroll value and then store this in the state using the `replace()` method. Because we use `replace()` rather than `push()` the user is unaware that the url is technically changing everytime they scroll!
Here is the code for this: 
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
On every scroll event, we set schedule a timeout function. Every event cancels the previous timeout. Only when the user stops scrolling will the timeout actually complete and our handler will be called.
Now when the pop event fires, we have access to the last recorded scroll of the new page within the History item.

Animating a transition involves having both pages displayed at the same time as one enters and the other leaves. So that one page doesn't push the other one down, you have to absolutely position both of them so they can appear on top of each other along the z axis. This becomes tricky if the pages have been scrolled because in order to avoid a jump, we need to manually scroll the page after it has been absolutely positioned so it appears to be in the same position before and after. Of course we then have to reset this after the transition has taken place. This becomes even more complicated when we realise that for the page that is entering, the content for this can suddenly appear at any time from our network request!

The best way to make sense of this behaviour is to model it as a series of events.
When a transition takes place we find these events occur for the incoming page:
1. The transition begins. 
2. The transition ends.
3. Content is loaded from the network

For the outgoing page we have these events:
1. The transition beings
2. The transition ends

For the incoming page, events 1 and 2 always occur in that order. Event 3, however, can occur at any point, even at the start.
In response to each event, we need to write code which applies styles, sets the scroll and various other things. What code runs is dependent on the sequence of these events. For example, when the transition begins, we only need to rescroll the page if content has been loaded. Thus we see that we need to persist the state of what events have already taken place.

If this behaviour suggests Observables to you, then you're thinking along the same lines as me. For this project I used RxJS, which is perhaps more commonly associated with Angular but works well with React also, I have found.

Designing Observables can be difficult and it was so here. Marble Diagrams often come in useful here. Here is the one I created for this: 

I started with the two basic Observables. One for animation events (enter, entering, exit, and exiting), and another for the content loaded events. In each navigation there will be only one of those, although in my implementation the Observable lives beyond individual transitions.
```
   animation events
   -----d----e-------f-------->
 
   content loaded events
   ---3-----------4----------->
 ```
 Since when we handle content loaded events, we need to know about the latest animation event so we combine them using `withLatestForm` operator.

 ```
   content loaded events with last animation event
   ----3c-----------4e--------------------->
 ```
 We also do the same for the animation events Observable.
 ```
   ----d3-----e3------f4------->
 ```
 Finally we merge these two Observables together
 ```
   ----3c-----d3----e3----4e---f4--->
```
This gives us an observable where each event is either an animation or a content loaded event and contains the value of event of the other kind along with it.

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
We subscribe to the resultant Observable and can run some fairly straightforwardd imperative code that does the job of doing the work to make the animations and scroll management work.

## Things that don't work
Scroll restoration doesn't take place when you refresh the app. When this occurs, the history object is completely reset so you lose all data that was stored there. Implementing this would require storing the data some place else.

## Future works and reflections
This application is purely for demonstration purposes and I haven't implemented this in any production app so I can't say for sure how robust it is. 

One thing I didn't take into consideration was the effect of the user resizing the viewport. Probably I would need to implement a handler that runs when the viewport is resized which probably would just reset the scroll to zero.

In general, I am a little bit sceptical about the use of Routing in SPAs. I feel that trying to reimplement what the Browser already does perfectly well seems a bit pointless. Do Web apps really need routing? I'm not so sure. Whilst transitions look nice and are fun, they are far from being a necessity. It would be nice if one day browsers can provide this functionality natively.

