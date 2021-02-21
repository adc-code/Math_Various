function D3App ()
{  
    // SVG Width, height, and some added spacing
    var margin = { top: 10, right: 30, bottom: 20, left: 40 };
    var width  = 500 - margin.left - margin.right;
    var height = 300 - margin.top  - margin.bottom;

    var _w = 1;
    var _b = 0;

    var snapToInt = false;
    var visCurve  = false;
    var pointList = [];

    // Create SVG element
    var svg = d3.select ('#graph')
                .append ('svg')
                .attr ('width', width + margin.left + margin.right)
                .attr ('height', height + margin.top + margin.bottom)
                .append ('g')
                .attr ('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Define the scales to convert our data to screen coordinates
    xScale = d3.scaleLinear ()
               .domain ( [ -15, 15 ] )
               .range ( [ 0, width ] );                

    yScale = d3.scaleLinear ()
               .domain ( [ -0.05, 1.05 ] )
               .range ( [ height, 0 ] );

    // Define the xAxis... note only a line is shown
    var xAxis = d3.axisBottom ()
                  .tickSize ( 0 )
                  .scale (xScale)
                  .tickFormat ('');

    // Define the vertical lines for the grid using very long tick lines
    var xGrid = d3.axisBottom ()
                  .tickSize ( -height )
                  .scale (xScale);

    // Define Y axis
    var yAxis = d3.axisLeft ()
                  .scale (yScale);
                          
    // Define the horizontal lines for the grid again using very long tick lines
    var yGrid = d3.axisLeft ()
                  .tickSize (-width, 0, 0)
                  .scale (yScale)
                  .tickFormat ('');

    svg.append ('clipPath')
       .attr ('id', 'graphArea')
       .append ('rect')
       .attr ('x', -1)
       .attr ('y', -1)
       .attr ('width', width+2)
       .attr ('height', height+2);

    // Create axes
    svg.append ('g')
       .attr ('class', 'x axis')
       .attr ('transform', 'translate(0,' + yScale(-1) + ')')
       .call (xAxis);

    svg.append ('g')
       .attr ('class', 'grid')
       .attr ('transform', 'translate(0,' + height + ')')
       .call (xGrid);

    svg.append ('g')
       .attr ('class', 'y axis')
       .attr ('transform', 'translate(' + 0 + ',0)')
       .call (yAxis); 
 
    svg.append ('g')
       .attr ('class', 'grid')
       .attr ('transform', 'translate(' + 0 + ',0)')
       .call (yGrid); 

    // Define the lines...
    var horizLine = d3.line ()
                      .x (function(d) { return d.x; })
                      .y (function(d) { return d.y; });

    var vertLine = d3.line ()
                     .x (function(d) { return d.x;  })
                     .y (function(d) { return d.y;  });

    var solutionLine = d3.line ()
                         .x (function(d) { return d.x;  })
                         .y (function(d) { return d.y;  })
                         .curve (d3.curveLinear);

    // Add the query lines to the svg
    svg.append ('path')
       .datum ( [ {x: xScale.domain()[0], y: yScale(0)}, {x: xScale.domain()[1], y: yScale(0)} ] )
       .attr ('class', 'queryLine') 
       .attr ('id', 'horizLine')
       .attr ('d', horizLine);

    svg.append ('path')
       .datum ( [ {x: xScale(0), y: yScale.domain()[0]}, {x: xScale(0), y: yScale.domain()[1]} ] )
       .attr ('class', 'queryLine') 
       .attr ('id', 'vertLine')
       .attr ('d', vertLine);

    var sigmoidCurve = computeSigmoidalFunc (_w, _b);

    var solPath = svg.append ('path')
                     .datum (sigmoidCurve)         
                     .attr ('class', 'solutionLine')
                     .attr ('id', 'solutionLine')
                     .attr ('d', solutionLine)
                     .attr ('clip-path', 'url(#graphArea)')
                     .style ('stroke', '#00aabb'); 


    //
    // computeSigmoidalFunc
    //
    function computeSigmoidalFunc (w, b)
    {
        var results = [];

        var steps = 400;
        var dX = (xScale.domain()[1] - xScale.domain()[0]) / steps;

        for (var i = 0; i <= steps; i++)
        {
            var xPoint = xScale.domain()[0] + i*dX;
            var yPoint = yScale (1 / (1 + math.exp (-1 * (w * (xPoint) + b) ) ));

            results.push ( { x: xScale(xPoint), y: yPoint } ); 
        }

        return results;
    }


    //
    // callback for the degrees slider 
    // 
    d3.select ('#sliderWeight').on ('input', function() 
    {
        _w = +d3.select(this).node().value;
        d3.select ('#weightOutput').text ( _w ); 
    
        sigmoidCurve = computeSigmoidalFunc (_w, _b);

        svg.select ('#solutionLine')
           .attr ('d', solutionLine (sigmoidCurve));
    } );


    //
    // callback for the degrees slider 
    // 
    d3.select ('#sliderBias').on ('input', function() 
    {
        _b = +d3.select(this).node().value;
        d3.select ('#biasOutput').text ( _b ); 

        sigmoidCurve = computeSigmoidalFunc (_w, _b);
        
        svg.select ('#solutionLine')
           .attr ('d', solutionLine (sigmoidCurve));
    } );


    //
    // mousemove callback function used for the query line
    //
    function mouseMove ()
    {
        var selectedX = d3.mouse(this)[0];
        var selectedY = d3.mouse(this)[1];

        // console.log (selectedX, selectedY);

        if (snapToInt)
        {
            selectedX = xScale (math.round (xScale.invert (selectedX)) );
            selectedY = yScale (math.round (yScale.invert (selectedY)) );
        }

        var locData = [ { x: xScale.range()[0], y: selectedY }, 
                        { x: xScale.range()[1], y: selectedY } ];
        svg.select ('#horizLine').attr ('d', horizLine (locData));

        locData = [ { x: selectedX, y: yScale.range()[0] }, 
                    { x: selectedX, y: yScale.range()[1] } ];
        svg.select ('#vertLine').attr ('d', vertLine (locData));
    }

}



