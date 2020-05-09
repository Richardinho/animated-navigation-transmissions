There is a web app with 3 routes created with React-Router
the page are filled with placeholder text


Test 1

navigate to page 1 and scroll
navigate to page 2 and scroll

go back to page 1

result: scroll position is restored

Test 2

Set scrollRestoration to 'manual' (note this is site wide as we cannot set it for individual 'pages')

navigate to page 1 and scroll
navigate to page 2 and scroll

go back to page 1

result: scroll position is not restored

Conclusion: Chrome remembers the scroll position when navigation occurs via the History API

Test 3
Add scroll handler which just logs out a message to console

3.1
Set scrollRestoration to 'auto'

navigate to page 1 and scroll
navigate to page 2 and scroll

go back to page 1
result: scroll event is fired

3.2
Set scrollRestoration to 'manual'

navigate to page 1 and scroll
navigate to page 2 and scroll

go back to page 1
result: scroll event is NOT fired


note;
If Chrome can restore the scroll position, why do we need to care about it? 
The answer is that we don't, unless there's a case where it doesn't work properly.
The existence of the scrollRestoration property suggests that may be the case in some instances
