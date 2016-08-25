# F1
****
##Interactive data visualisation of Formula 1 grand prix results

####Data source
>The data for this project came from the Ergast API. The full database was downloaded as SQL and then using Workbench datasets were chosen that could tell a story through time. 
>Those datasets were exported as csv and MongoDB was used to host them as json formatted files.  A pymongo package is a driver for Python for MongoDB. 

####Framework
>Python Flask is used as the framework for this app. Within the static directory, a sub-directory lib contains both a css and js directory. This contains the 3rd party css and js files.  

####Python
>A python file named F1.py renders with flask an index.html template and builds a web server using pymongo to interact with MongoDB. In this case 3 json mongoDB collections are used. Using the fields defined in the function a for loop iterates over the collections to get the data.  

####Unit tests
>An example of an unit test is shown in the test_F1.py file. 

####HTML
>The 3rd party css/js is linked within index.html in addition to the graph.js file which creates the graphs and a custom css file for dashboard styling. The links to the static files are written in Jinja as this is a Flask framework. Bootstrap is used for changing the horizontal placing of graphs to vertical on small screen sizes. An appropriate background photo is used and the colour of button and dropdown menus is matched for consistency. HTML5 semantic tags are used to layout the webpage.  
>

####JavaScript
>To enable data visualisation a number of JavaScript libraries are used. 
+ D3.js renders charts in svg which are then passed into the html divs
- DC.js is used as a wrapper for D3 charts
* Crossfilter.js is what allows the charts to be modified live by drilling down into the dataset.
* queue.js is an asynchronous helper library to ensure data is available from the api before it is processed.
- keen.js is a dashboard template library.
+ Bootstrap.js is used in conjunction with keen.js to layout the dashboard

>The graph.js file was created to take the data from F1.py, filter it with crossfilter, then chart it with a combination of D3 and DS.
The file is stored in a js directory within the static directory separate from 3rd party files. 
At the top of the graph.js file queue is used to ensure the 3 json files are obtained from the api before any functions are run. This is done by calling the 3 functions within another function which is referenced within the queue as await.  The queue calls the functions in the F1.py file which gets the json data to pass back to the charting functions in the graph.js file. 
Within the functions it is necessary to clean up the data in the json for charting from the variable. The year is parsed from the date, times are converted to milliseconds and driver names are concatenated from fore/surnames. Crossfilter is used to create dimensions that allow selection of data across charts enabling real time drill down of data. The data is then grouped and DC is used to define the chart type. The charts are tied to the html divs by way of id. Chart properties are defined defore the dc renderAll() function is run. 
A 3rd party intro.js file is used to attach popup boxes to the graphs to provide more detail information on the charts on click of a button in the nav bar. 

####CSS3
>Custom css file is used to style the navbar, button, div layout and the colour palette. A 3rd party introjs.css styles the popup boxes for the charts. DC.css styles the charts and keen-dashboard the dashboard layouts. 

####Hosting
>Heroku is used to host this app. A python package called gunicorn runs the http server for the app on heroku's Ubuntu servers. The requirements.txt contains all the packages required to run the app. Procfiles tell Heroku how to run the app. The app was deployed to Heroku over git. The server used for hosting is mLab MongoDB. The 3 datasets were imported to the MongoDB collection as csv files. 

