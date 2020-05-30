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


How to animate between routes in a SPA

With the History API, simulating routing in a SPA becomes possible. To make the user experience optimal, we should attempt to emulate as closely as possible the behaviour of the browser when actual navigation between pages takes place. This is challenging as their are subtleties in the behaviour of the browser the user is probably aware of, albeit sublimaly, and will notice the shortcomings of your app if you fail to support them.

1. Scroll Restoration

For conventional webpages, when you revisit a page via the history buttons, or when you refresh the page, the browser scrolls the page to the same position as it was before.

2. animations
Animating Forwards and Backwards
It would be nice to have different animation effects for different kind of navigation.
For example, the page slides in from the left when the user navigates by clicking on a link or when clicking the forward button, and the back slides in from the right when clicking the back button,(denoting the fact that you're revisiting an old page).

The problem with this is that whilst we can detect the difference between the user clicking on a link and using the history buttons, we can't tell the difference between the user having clicked forwards and having clicked back. For this reason, it's better for all animations just to be the same. 

This is a pity since the value of such animations is to give emphasis to the meaning of an action.
3. 
