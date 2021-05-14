# INFO 474 Assignment 3 Writeup
Team: Pavel Batalov, Michael Doyle, Chandrashree Karnani, Ramiro Steinmann Petrasso, and Nikki Demmel

## Main Questions Investigated
1. What trends are there in the change of female labor force participation over time? 
2. Are there any geographical trends tied to the amount of women in the labor force? 

## Design Rationale
- How did we choose our particular visual encodings and interaction techniques? 

    First, we discussed what kind of data we would need to visualize in order to answer our initial questions. 
    We decided to use a chloropleth map of the world to easily compare and contrast the labor force participation rates between countries and easily discover larger regional/continental trends. This map uses shades of blue to indicate a country's rate of female labor force participation, where a higher percentage of women in the workforce is encoded as a darker shade of blue. We chose to include this color encoding to encourage users to select countries that visually stood out to them to further explore their data in the other two visualizations. To make these comparisons between countries easier, we created a bar code graph that showed the ratio of women to men  in each country's labor force. This visualization lets users see comparisons faster than the chloropleth map. To answer our first question about labor force participation rates over time, we added an interactive timeline that changed the views on the visualizations above it. Users can select beginning and end points on the timeline to see how their selected countries' female labor force participation rates changed over time. When a user has set a range of dates, the barcode graph changes into a line graph to show countries' female labor force participation rates year after year. This lets users more easily visualize the differences and trends in labor force participation rates in each selected country. 

- What alternatives did you consider and how did you arrive at your ultimate choices?

    We initially considered making all of our visualizations on a single chloropleth map with different views the user could choose from to look at different aspects of the data. We realized it would be harder to visually encode changes over time in a map, so we decided to make a line chart to show these changes instead. We also considered making visualizations on other parts of the data that could have partially explained the female labor force participation rates, but we realized that too many factors go into these statistics, many of which are not easily quantifiable such as cultural values and labor laws. We narrowed the scope of our visualizations to highlight differences between countries, because explaining how or why these differences came to be is better suited for another medium, like a book or lecture series. 

## Development Process
- Roughly how much time did you spend developing your application (in people-hours)? 

    We divided the work in a way where everyone paired up to make one visualization and its interactive elements. In total, we spent about 20-25 people-hours working on this application. We were able to meet early on and decide on a direction to take the visualizations in so everyone could spend the rest of the week working on their code. 

- What aspects took the most time?

    Getting the line graph to display countries that were selected by the user on the chloropleth map took the most amount of time. Finding a time to meet outside of class to plan for the assignment took some time as well, due to our conflicting class schedules. 