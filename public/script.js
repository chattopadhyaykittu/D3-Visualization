/*The code is taken from https://codepen.io/netkuy/pen/KzPaBe and then modified according to my need. Over there the data is served by using an array but over here the data is fetched from a json file. */

/*60% of the idea is taken from the referenced code*/
const margin = { top: 20, right: 20, bottom: 20, left: 105 }
/*Fixing the width, height, inner height of the bar, bar width and bar gap*/
    const WIDTH = 800 - margin.left - margin.right;
    const HEIGHT = 400 - margin.top - margin.bottom;
    const INNER_HEIGHT = HEIGHT;
    const BAR_WIDTH = 40;
    const BAR_GAP = 15;
    var scale;
    var svg;
    var data;


    /*Determining the scale of the bar charts*/
    function init(data_in) {
      data = data_in;
       /*Using Linear Scale for plotting the data */
      scale = d3.scaleLinear()
        .domain([0, d3.max(data.map((d) => (d.value)))])/*Determining the domain of the scale which is the maximum value stored in the json file from which the data is extracted*/ 
        .range([0, HEIGHT]);/*Setting the height of the bar chart*/
        
     /*Appending the svg to the body and setting its properties*/
      svg = d3.select("body").append("svg")
        .attr("width", WIDTH + margin.left + margin.right)
        .attr("height", HEIGHT + margin.top + margin.bottom)
        .append("g")
        
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    }

     /*Function shuffling the order in which the data is displayed*/

    function preprocess() {
      data = d3.shuffle([...data]);
      return data;
    }

    function y(d) {
      return HEIGHT - scale(d.value);
    }

    function height(d) {
      return scale(d.value);
    }

     /*The update function has been chnaged accroding to my my requirements*/
    function update(data) {
      const t = d3.transition()
        .duration(780);

      const bar = svg.selectAll("g")
        .data(data, d => d.name);/*Selecting the name from the json data instead of id (as in the referred code)*/

      // EXIT section
      bar
        .exit()
        .remove();

      // UPDATE section
      bar
        .transition(t)
        .attr("transform", (d, i) => `translate(${i * (BAR_WIDTH + BAR_GAP)},${y(d)})`);
    
     /*Applying transitions on the individual rectanges used to form the bar*/ 
      bar.select("rect")
        .transition(t)
        .attr("height", height);

       /*Applying transition on the text shown at the top of each bar*/ 
      bar.select("text")
        .transition(t)
        .tween("text", function (d) {
          const v0 = this.textContent || "0";
          const v1 = d.value;
          const i = d3.interpolateRound(v0, v1);
          return t => this.textContent = i(t);
        });

      // ENTER section
      const barEnter = bar
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${i * (BAR_WIDTH + BAR_GAP)},${HEIGHT})`);

      barEnter
        .transition(t)
        .attr("transform", (d, i) => `translate(${i * (BAR_WIDTH + BAR_GAP)},${y(d)})`);

      const rect = barEnter.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", BAR_WIDTH)
        .attr("height", 0)
        .attr("class", "bar");

      rect
        .transition(t)
        .attr("height", height);

     /*Displaying the value part obtained from the json file. in the referenced program, only the value is diplayed but over here, both name and value are diplayed*/
        
     /*Displaying the value part of the json data on the top of the bars*/
      const value_text = barEnter.append("text")
        .text(d => d.value)
        .attr("text-anchor", "middle")
        .style("font", "26px times")
        .style("fill", "white")
        .attr("dx", BAR_WIDTH/2)
        .attr("dy", -2);

      const anme_text = barEnter.append("text")
        .text(d => d.name)
        .attr("text-anchor", "end")
        .style("font", "20px times")
        .style("fill", "white")
        .attr("dx", BAR_WIDTH/6)
        .attr("dy", -2);

    }

     /*Feting the data from the json file and using to initialize the bar chart as well as update the charts*/
    d3.json("./data.json", function(error, data) {
      init(data);
      update(preprocess());
    });
   
    /*This function triggers the update function. On the referred code, the update function is called after an interval of every 2seconds but here this function is called when a button click occurs(myFunction() is attcahed to an onclick event on the button)*/

    function myFunction() {
      update(preprocess());
}
