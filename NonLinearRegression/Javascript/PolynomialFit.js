function D3App ()
{  
    // SVG Width, height, and some added spacing
    var margin = { top: 10, right: 30, bottom: 20, left: 40 };
    var width  = 520 - margin.left - margin.right;
    var height = 480 - margin.top  - margin.bottom;

    var snapToInt  = false;
    var visCurve   = false;
    var numDegrees = 3
    var pointList  = [];

    // Create SVG element
    var svg = d3.select ('#graph')
                .append ('svg')
                .attr ('width', width + margin.left + margin.right)
                .attr ('height', height + margin.top + margin.bottom)
                .append ('g')
                .attr ('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Define the scales to convert our data to screen coordinates
    xScale = d3.scaleLinear ()
               .domain ( [ -20, 20 ] )
               .range ( [ 0, width ] );                

    yScale = d3.scaleLinear ()
               .domain ( [ -20, 20 ] )
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
                  .tickSize(-width, 0, 0)
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
       .attr ('transform', 'translate(0,' + yScale(-20) + ')')
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
       .datum ( [ {x: xScale.range()[0], y: yScale(0)}, {x: xScale.range()[1], y: yScale(0)} ] )
       .attr ('class', 'queryLine') 
       .attr ('id', 'horizLine')
       .attr ('d', horizLine);

    svg.append ('path')
       .datum ( [ {x: xScale(0), y: yScale.range()[0]}, {x: xScale(0), y: yScale.range()[1]} ] )
       .attr ('class', 'queryLine') 
       .attr ('id', 'vertLine')
       .attr ('d', vertLine);

    // Make an empty rectangle to handle mouse move events...
    svg.append ('rect')
       .attr ('width', width)
       .attr ('height', height)
       .style ('fill', 'none')
       .style ('pointer-events', 'all')
       .on ('mousemove', mouseMove)
       .on ('click', mouseClick);

    var nullLine = [ { x: xScale.range()[0], y: 0.5 * (yScale.range()[0] + yScale.range()[1]) }, 
                     { x: xScale.range()[1], y: 0.5 * (yScale.range()[0] + yScale.range()[1]) } ];

    var solPath = svg.append ('path')
                     .datum (nullLine)         
                     .attr ('class', 'solutionLine')
                     .attr ('id', 'solutionLine')
                     .attr ('d', solutionLine)
                     .attr ('clip-path', 'url(#graphArea)')
                     .style ('opacity', 0)
                     .style ('stroke', '#6600cc'); 

    /* uncomment to have line 'drawn' on
          
    var totalLength = solPath.node().getTotalLength();

    solPath.attr ('stroke-dasharray', totalLength + ' ' + totalLength)
           .attr ('stroke-dashoffset', totalLength)
           .transition ()
           .duration (500)
           .ease (d3.easeLinear)
           .attr ('stroke-dashoffset', 0);
    */


    // 
    // drawCircle: used to draw a point on the screen
    //
    function drawCircle (x, y, size)
    {
        svg.append ('circle')
           .attr ('class', 'point')
           .attr ('cx', x)
           .attr ('cy', y)
           .attr ('r', size);
    }

       
    //
    // ComputeCurve: compute the parabola of best fit 
    //
    function ComputeCurve ()
    {
        // only if we have at least three points... otherwise the solution is total garbage
        if (pointList.length > numDegrees)
        {
            var X = [];
            var Y = [];

            for (var i = 0; i < pointList.length; i++)
            {
                var row = [];
                for (var m = 0; m <= numDegrees; m++)
                {
                    if (m == 0)
                        row.push (1);
                    else
                        row.push (math.pow (xScale.invert (pointList[i][0]), m));
                }

                X.push (row);
                Y.push (yScale.invert (pointList[i][1]));
            }

            var xMat = math.matrix ( X );
            var yMat = math.matrix ( Y );

            var xMatTrans = math.transpose (xMat);

            var tmpMat = math.multiply (xMatTrans, xMat);
            tmpMat = math.inv (tmpMat); 
            var solMat = math.multiply (tmpMat, xMatTrans);

            var results = math.multiply (solMat, Y);

            var coefs = [];
            for (var i = 0; i < results._data.length; i++) 
                coefs.push (results._data[i]);

            // console.log (coefs);

            // recompute the curve
            var locData = [];
            for (var i = xScale.domain()[0]; i <= xScale.domain()[1]; i+=0.2)
            {
                var yValue = 0;
                for (var j = 0; j < coefs.length; j++)
                {
                    yValue += coefs[j] * math.pow (i, j);
                }

                locData.push ( { x: xScale(i), y: yScale (yValue) } );
            }   

            // console.log (locData);

            // redraw the curve
            svg.select ('#solutionLine')
               .style ('opacity', 1)
               .attr ('d', solutionLine (locData));

            // update the equation 
            var eqnStr = 'Solution: ';
            for (var j = coefs.length-1; j > 0; j--)
            {
                var value = coefs[j].toFixed(4).toString();
                if (math.abs(coefs[j]) < 0.0001)
                   value = coefs[j].toExponential(3).toString();
 
                if (j != 1)
                    eqnStr += '(' + value + ') x<sup>' + j + '</sup> + ';
                else
                    eqnStr += '(' + value + ') x + ';
            }
            eqnStr += '(' + coefs[0].toFixed(4).toString() + ')'; 
 
            d3.select ('#equation')
              .html (eqnStr);

            var SSE = 0;
            var meanY = 0;
            for (var i = 0; i < pointList.length; i++)
            {   
                var yValue = 0; 
                for (var j = 0; j < coefs.length; j++)
                    yValue += coefs[j] * math.pow (xScale.invert(pointList[i][0]), j);
                SSE   += (yScale.invert(pointList[i][1]) - yValue) ** 2;
                meanY += yValue;
            }

            meanY /= pointList.length;

            var SST = 0;
            for (var i = 0; i < pointList.length; i++)
            {   
                SST += (yScale.invert(pointList[i][1]) - meanY) ** 2;
            }

            var Rsqr = 1 - SSE / SST;

            d3.select ('#rsquared')
              .html ('R<sup>2</sup>: ' + Rsqr);
        }
    }


    // 
    // callback to handle mouseEnter on a button 
    //
    d3.selectAll ('.button').on ('mouseenter', function ()
    {
        //console.log ('On button mouseenter CB');

        // enter... darken the button
        var id = d3.select(this).node().getAttribute ('id');

        if (id == 'ResetBtn')
        {
            d3.select(this).node().style.backgroundColor = '#cc0000';
            d3.select(this).node().style.color           = '#ffffff';
        }
        else if (id == 'SnapToIntBtn')
        {
            d3.select(this).node().style.backgroundColor = '#00eaff';
        }

    } ); 


    // 
    // callback to handle mouseLeave on a button 
    //
    d3.selectAll ('.button').on ('mouseleave', function ()
    {
        // console.log ('On button mouseleave CB');

        // leave... put button to previous state
        var id = d3.select(this).node().getAttribute ('id');

        if (id == 'SnapToIntBtn' && snapToInt == true)
        {
            d3.select(this).node().style.backgroundColor = '#00aabb';
            d3.select(this).node().style.color           = '#ffffff';
        }
        else
        {
            d3.select(this).node().style.backgroundColor = '#cccccc';
            d3.select(this).node().style.color           = '#000000';
        }

    } );

         
    // 
    // callback to handle click on the snap to integer button
    //
    d3.select ('#SnapToIntBtn').on ('click', function ()
    {
        snapToInt = !snapToInt;
        console.log (snapToInt);

        if (snapToInt)
        {
            d3.select(this).node().style.backgroundColor = '#00aabb';
            d3.select(this).node().style.color           = '#ffffff';
        }
        else
        {
            d3.select(this).node().style.backgroundColor = '#cccccc';
            d3.select(this).node().style.color           = '#000000';
        }

    } );


    // 
    // callback to handle click on the reseet button
    //
    d3.select ('#ResetBtn').on ('click', function ()
    {
        // remove points...
        pointList = [];
        svg.selectAll ('circle').remove()

        // remove line
        svg.select ('#solutionLine')
           .style ('opacity', 0);

        // remove equation and r-squared
        d3.select ('#equation')
          .html ('Solution: -'); 

        d3.select ('#rsquared')
          .html ('R<sup>2</sup>: -');

    } );


    //
    // callback for the degrees slider 
    // 
    d3.select ('#sliderDegrees').on ('input', function() 
    {
        numDegrees = +d3.select(this).node().value;
        d3.select ('#degreesOutput').text ( numDegrees ); 

        ComputeCurve ();              
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


    //
    // mousemove callback function used for the query line
    //
    function mouseClick ()
    {
        var selectedX = d3.mouse(this)[0];
        var selectedY = d3.mouse(this)[1];

        // console.log (selectedX, selectedY);

        if (snapToInt)
        {
            selectedX = xScale (math.round (xScale.invert (selectedX)) );
            selectedY = yScale (math.round (yScale.invert (selectedY)) );
        }

        drawCircle (selectedX, selectedY, 4);
 
        pointList.push ( [selectedX, selectedY] );

        ComputeCurve ();  
    }    

}



