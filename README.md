Single Page Apps often take control of routing where the URL in the address bar is changed, and the page appears to be updated without an actual refresh taking place.
This is of course accomplished using the History API and frameworks for building SPAs often provide libraries to facilitate working with these. In the case of React, which we will cover in this blog post,  *React-Router* is a popular library used for this purpose.



If routing is implemented well, a web app appears almost indistinguiable from a normal website and they are able to interact with it in much the same way. For example, being able to navigate through their history via the history buttons, and being able to bookmark pages for future visits.

The key to a successful implemention is therefore for it to behave in exactly the same way as a conventional website. This can be challenging since there are some subtle aspects of how conventional routing works  that programmers might not be aware of, but which users will probably notice if they aren't reimplemented correctly.  


The starting point of any attempt to emulate the normal behaviour of a browser is to first study that behaviour. It is important to do this across browsers as it is often in the subtle details that browsers differ most.


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
