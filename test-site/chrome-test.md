There are two test static html pages: page-1 and page-2
The pages are filled with placeholder text

Test 1
the size of the viewport is reduced so that that both pages can be scrolled within it
.
If we navigate to page 1 and scroll
Then we navigate to page 2 and scroll

If we use the back and forwards history buttons to navigate between the two pages, we find that each page retains the scroll position it had after scrolling.


Test 2
We set scrollRestoration to 'manual' in page 1
When we do the same test as in test 1, we find that when we return to page 1, the page is always scrolled to the top of the page. Setting the above property disables the scroll restoration.


// note
It seems like once you set scrollRestoration, the browser remembers it, even if you disable the javascript that sets it and refresh the page!
so it seems that Chrome remembers both the scroll position of a page and the scrollRestoration value. I wonder what else it stores, and where it stores it, and if there is some way of accessing this store? 


Test 3
We add a scroll handler the window in page 1. The handler simply logs out a message indicating that a scroll took place.

3.1
Page 1 is scrolled to top.
(window.pageYOffset is 0)
We navigate to page 2
We navigate back to page 1
The message is NOT logged

3.2

Page 1 is scrolled to top.
We scroll the page
(window.pageYOffset is 1)
We navigate to page 2
We navigate back to page 1
The message is logged


conclusion: When we reload a page, the browser scrolls the page back to the remembered position
A scroll event is fired

Test 4
4.1
Scroll the page
refresh the page

result: scroll position restored

4.2
scroll page
copy and paste url into address bar and press return
result: scroll position restored

4.3
scroll page
navigate to another page
copy and paste url into address bar and press return
result: scroll position is not restored

conclusion: When the page is reloaded, if the url has not changed, the scroll position is restored

Test 5
5.1
scroll page
add query string to url
refresh page
result: scroll position is not restored

5.2
scroll page
add hash to url
refresh page
result: scroll position restored

conclusion: scroll position not remembered if query string added. Is remembered if hash is added




