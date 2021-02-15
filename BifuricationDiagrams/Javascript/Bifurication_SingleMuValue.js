function CanvasApp ()
{
    // Function used to compute the results for a specific combination of mu and x_0
    var ComputeResults = function (mu, x_0)
    {
                var Results = [ { x: 0, y: x_0 } ];

                var x = x_0;

                for (var i = 0; i < 80; i++)
                {
                    x = mu * x * (1 - x);
                    Results.push ( { x: i+1, y: x } );
                }

                return Results;
    }
      
 
    // SVG Width, height, and some added spacing
    var margin = { top: 10, right: 30, bottom: 60, left: 60 };
    var width  = 0.75 * window.innerWidth  - margin.left - margin.right;
    var height = 0.75 * window.innerHeight - margin.top  - margin.bottom;

    var dataset, xScale, yScale;

    // Initial values of  
    var mu = 0.01;
    var x_0 = 0.5;            

    var bifuricationResults = ComputeResults (mu, x_0);

    // Set the UI with some default values.
    d3.select('#muValue').node().value = mu;
    d3.select('#xInitial').node().value = x_0;

    // Define the scales to convert our data to screen coordinates
    xScale = d3.scaleLinear ()
               .domain ( [ 0, 80 ] )
               .range ( [ 0, width ] );                

    yScale = d3.scaleLinear ()
               .domain ( [0, 1 ] )
               .range ( [ height, 0 ] );

    // Define X axis
    xAxis = d3.axisBottom ()
              .scale (xScale);

    // Define Y axis
    yAxis = d3.axisLeft ()
              .scale (yScale);

    // Create SVG element
    var svg = d3.select ('#graph')
                .append ('svg')
                .attr ('width', width + margin.left + margin.right)
                .attr ('height', height + margin.top + margin.bottom)
                .append ('g')
                .attr ('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    var xAxis = d3.axisBottom ()
                  .scale (xScale);

    // Define Y axis
    var yAxis = d3.axisLeft ()
                  .scale (yScale);

    var lineResults = d3.line ()
                        .x (function (d)    {  return xScale (d.x);  })    
                        .y (function (d)    {  return yScale (d.y);  })   
                        .curve (d3.curveMonotoneX);

    // Axis labels...
    svg.append ('text')
       .style ('text-anchor', 'middle')
       .attr ('transform', 'rotate(-90)')
       .attr ('x', -height * 0.5)
       .attr ('y', -margin.left * 0.50)
       .text ('Mu value')
       .attr ('class', 'axisLabel');

    svg.append ('text')
       .style ('text-anchor', 'middle')
       .text ('Number of Iterations')
       .attr ('x', xScale (40) + 0.2 * margin.right )
       .attr ('y', height + 0.6 * margin.bottom)
       .attr ('class', 'axisLabel');

    // Create axes
    svg.append ('g')
       .attr ('class', 'x axis')
       .attr ('transform', 'translate(0,' + height + ')')
       .call (xAxis);

    svg.append ('g')
       .attr ('class', 'y axis')
       .attr ('transform', 'translate(' + 0 + ',0)')
       .call (yAxis); 

    // And add the path...
    svg.append ('path')
       .datum (bifuricationResults)         
       .attr ('class', 'lineResults')
       .attr ('d', lineResults);


    //
    // UI Callbacks...
    //
    d3.select ('input#sliderMu').on ('input', function()
    {
        mu = +d3.select(this).node().value;
        d3.select('#muValue').node().value = mu;

        bifuricationResults = ComputeResults (mu, x_0);

        svg.select ('.lineResults').attr ('d', lineResults (bifuricationResults));
    });

 
    d3.select ('input#sliderXinital').on ('input', function()
    {
        x_0 = +d3.select(this).node().value;
        d3.select('#xInitial').node().value = x_0;

        bifuricationResults = ComputeResults (mu, x_0);

        svg.select ('.lineResults').attr ('d', lineResults (bifuricationResults));
    });
 
}


