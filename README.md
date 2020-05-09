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



