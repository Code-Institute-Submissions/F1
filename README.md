# F1
****
##Interactive data visualisation of Formula 1 grand prix results

####Data source
>The data for this project came from the Ergast API. The full database was downloaded as SQL and then using Workbench datasets were chosen that could tell a story through time. 
>Those datasets were exported as csv and MongoDB was used to host them as json formatted files.  

####Framework
>Python Flask is used as the framework for this app. Within the static directory, a sub-directory lib contains both a css and js directory. This contains the 3rd party css and js files.  

####Python
>A python file named F1.py renders with flask an index.html template and builds a web server using pymongo to interact with MongoDB. In this case 3 json mongoDB collections are used. Using the fields defined in the function a for loop iterates over the collections to get the data.  

####HTML
>The 3rd party css/js is linked within index.html in addition to the graph.js file which creates the graphs and a custom css file for dashboard styling. Bootstrap is used for changing the horizontal placing of graphs to vertical on small screen sizes. An appropriate background photo is used and the colour of button and dropdown menus is matched for consistency. HTML5 semantic tags are used to layout the webpage.  
>

####javascript
>To enable data visualisation a number of javascript libraries are used. 
+ D3.js renders charts in svg which are then passed into the html divs
- DC.js is used as a wrapper for D3 charts
* Crossfilter.js is what allows the charts to be modified live by drilling down into the dataset.
* queue.js is an asynchronous helper library to ensure data is availbale from the api before it is processed.
- DC.css styles the charts
+ keen.js is a dashboard template library.
+ Bootstrap.js is used in conjunction with keen.js to layout the dashboard
>The graph.js file was created to take the data from F1.py, filter it with crossfilter, then chart it with a combination of D3 and DS.
The file is stored in a js directory within the static directory separate from 3rd party files. 
At the top of the graph.js file queue is used to ensure the 3 json files are obtained from the api before any functions are run. This is done by calling the 3 functions within another function which is referenced within the queue as await.  

