Single Page Apps often take control of routing, where the URL in the address bar is changed, and the page appears to be updated but no new HTTP request for a page actually takes place.
This is of course accomplished using the History API, and frameworks for building SPAs often provide libraries to facilitate working with these. In the case of React, which we will cover in this blog post,  [React-Router]() is one popular library used for this purpose.

Our aim in implementing routing should be to emulate, as closely as possible, the default behaviour of the browser. Ideally, the user should be almost unaware that they are using an SPA at all. In particular, the use should be able to use the history back and forward buttons and be able to use revisit pages of the app via Bookmarks.

This is somewhat challenging as it turns out that there are aspects of conventional routing that programmers may not be aware of but which users are likely to notice if absent.

For example, if the user clicks on the *Back* button to go to a previous page, the scroll position of the page when they left it is restored. This also occurs with the *Forward* button and when the page is refreshed.

As well as this, we might also want to enhance the user conventional navigation experience with the addition of animated transitions. In this post, I am going to talk about my experience in implementing this.

# Set up and libraries used
I start with a basic React application created using [Create React App](). In addition, I used React Router for routing, CSS [Transition Group]() for animated effects, and the [RxJS library]() for Observables. I also used Lodash for utility methods (the very useful `get()` function).

Setting up routing using React Router is pretty easy and I'm not going to go into this. For this project I've kept it pretty simple with just two routes. For one of the routes I will be simulating a network request for asynchronous content.

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


