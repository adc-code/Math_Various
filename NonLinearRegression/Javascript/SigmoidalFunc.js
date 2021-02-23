function D3App ()
{  
    // SVG Width, height, and some added spacing
    var margin = { top: 10, right: 30, bottom: 20, left: 40 };
    var width  = 500 - margin.left - margin.right;
    var height = 350 - margin.top  - margin.bottom;

    var _w = 1;
    var _b = 0;

    var _region = 0;
    var _snapToInt = false;
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

    var botLine = d3.line ()
                     .x (function(d) { return d.x;  })
                     .y (function(d) { return d.y;  });

    var topLine = d3.line ()
                     .x (function(d) { return d.x;  })
                     .y (function(d) { return d.y;  });

    var solutionLine = d3.line ()
                         .x (function(d) { return d.x;  })
                         .y (function(d) { return d.y;  })
                         .curve (d3.curveLinear);

    // Add the query lines to the svg
    svg.append ('path')
       .datum ( [ {x: xScale.range()[0], y: yScale(0.5)}, {x: xScale.range()[1], y: yScale(0.5)} ] )
       .attr ('class', 'queryLine') 
       .attr ('id', 'horizLine')
       .attr ('d', horizLine);

    svg.append ('path')
       .datum ( [ {x: xScale(0), y: yScale.range()[0]}, {x: xScale(0), y: yScale.range()[1]} ] )
       .attr ('class', 'queryLine') 
       .attr ('id', 'vertLine')
       .attr ('d', vertLine);

    svg.append ('path')
       .datum ( [ {x: xScale.range()[0], y: yScale(0)}, {x: xScale.range()[1], y: yScale(0)} ] )
       .attr ('class', 'pointLine') 
       .attr ('id', 'botLine')
       .attr ('d', botLine);

    svg.append ('path')
       .datum ( [ {x: xScale.range()[0], y: yScale(1)}, {x: xScale.range()[1], y: yScale(1)} ] )
       .attr ('class', 'pointLine') 
       .attr ('id', 'topLine')
       .attr ('d', topLine);

    // Make an empty rectangle to handle mouse move events...
    svg.append ('rect')
       .attr ('width', width)
       .attr ('height', height)
       .style ('fill', 'none')
       .style ('pointer-events', 'all')
       .on ('mousemove', mouseMove)
       .on ('click', mouseClick);

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
    // drawCircle: used to draw a point on the screen
    //
    function drawCircle (x, y, size)
    {
        svg.append ('circle')
           .attr ('class', 'point')
           .attr ('cx', x)
           .attr ('cy', y)
           .attr ('r', size)
           .transition ()
           .duration (500)
           .ease (d3.easeBounceOut)
           .tween ('moveCirc', circMover);
        
    }

    var circMover = function ()
    {
        var startY = d3.select (this).attr ('cy');

        var endY   = yScale (0);
        if (_region == 1)
            endY = yScale (1);          

        var interpolator = d3.interpolate (startY, endY);
        return function (t)
        {
            d3.select (this).attr ('cy', interpolator(t));
        }
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

        if (yScale.invert (selectedY) < 0.5)
            _region = 0;
        else
            _region = 1;

        if (_snapToInt)
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

        if (_region == 0)
        {
            d3.select ('#botLine').node().classList = ['pointLineSel'];
            d3.select ('#topLine').node().classList = ['pointLine'];
        }
        else
        {
            d3.select ('#botLine').node().classList = ['pointLine'];
            d3.select ('#topLine').node().classList = ['pointLineSel'];
        }
    }


    //
    // mousemove callback function used for the query line
    //
    function mouseClick ()
    {
        var selectedX = d3.mouse(this)[0];
        var selectedY = d3.mouse(this)[1];

        // console.log (selectedX, selectedY);

        if (_snapToInt)
        {
            selectedX = xScale (math.round (xScale.invert (selectedX)) );
            selectedY = yScale (math.round (yScale.invert (selectedY)) );
        }

        drawCircle (selectedX, selectedY, 4);
 
        pointList.push ( [selectedX, selectedY] );
    }  


    // 
    // callback to handle mouseEnter on a button 
    //
    d3.selectAll ('.button').on ('mouseenter', function ()
    {
        //console.log ('On button mouseenter CB');

        // enter... darken the button
        var id = d3.select(this).node().getAttribute ('id');

        if (id == 'RemoveBtn')
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

        if (id == 'SnapToIntBtn' && _snapToInt == true)
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
        _snapToInt = !_snapToInt;

        if (_snapToInt)
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
    d3.select ('#RemoveBtn').on ('click', function ()
    {
        // remove points...
        pointList = [];
        svg.selectAll ('circle').remove()
    } );

}



