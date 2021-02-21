function D3App ()
{
    // SVG Width, height, and some added spacing
    var margin = { top: 10, right: 0, bottom: 10, left: 30 };
    var width  = 700 - margin.left - margin.right;
    var height = 360 - margin.top  - margin.bottom;

    // Create SVG element
    var svg = d3.select ('#graph')
                .append ('svg')
                .attr ('width', width + margin.left + margin.right)
                .attr ('height', height + margin.top + margin.bottom)
                .append ('g')
                .attr ('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Define the scales to convert our data to screen coordinates
    xScale = d3.scaleLinear ()
               .domain ( GetXRange() )
               .range ( [ 0, width ] );                

    yScale = d3.scaleLinear ()
               .domain ( GetYRange() )
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
                          
    // Create axes
    svg.append ('g')
       .attr ('class', 'x axis')
       .attr ('transform', 'translate(0,' + yScale(0) + ')')
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

    var ColourList = [ [ '#330033' ],
                       [ '#e600e6', '#ec00ac', '#f20073', '#f80039', '#ff0000' ],
                       [ '#00e6e6', '#18bfdd', '#3099d5', '#4873cc', '#604cc4', '#7826bb', '#9100b3' ] ];

    var ColourHoverList = [ [ '#590059' ],
                            [ '#c000c0', '#c60090', '#cc0061', '#d20030', '#d90000' ],
                            [ '#00c0c0', '#149eb7', '#277daf', '#3b5da6', '#4d3d9e', '#5f1e95', '#72008d' ] ];


    var SelectedList = [ [ true ],                                                // orginal
                         [ false, false, false, false, false ],                   // terms
                         [ false, false, false, false, false, false, false ] ];   // sums


    // Init UI
    d3.select ('#OrgFuncBtn').style ('background-color', ColourList[0][0]);
    d3.select ('#OrgFuncBtn').style ('color', '#fff');

    var orgFunc = OriginalFunction ();

    var lineOrg = d3.line ()
                    .x (function (d)    {  return xScale (d.x);  })    
                    .y (function (d)    {  return yScale (d.y);  })   
                    .curve ( GetOriginalCurveType() );

    svg.append ('path')
       .datum (orgFunc)         
       .attr ('class', 'lineOriginal')
       .attr ('id', 'lineOrg')
       .attr ('d', lineOrg)
       .style ('stroke', ColourList[0][0]);


    var lineApprox = [];

    for (var i = 0; i < 5; i++)
    {
        var terms = [];
        terms.push (i);

        var approxFunc = ComputeApprox (terms);

        lineApprox[i] = d3.line()
                          .x (function(d)  { return xScale (d.x); })
                          .y (function(d)  { return yScale (d.y); })
                          .curve (d3.curveMonotoneX);

        // compute and append
        svg.append ('path')
           .datum (approxFunc)         
           .attr ('class', 'lineApprox')
           .attr ('id', 'lineTerm_' + i)
           .attr ('d', lineApprox[i])
           .attr ('opacity', 0) 
           .style ('stroke', ColourList[1][i]);
    }
            
  
    var updateDuration = 250;

    var sumTerms = [ [ 0, 1 ],
                     [ 0, 1, 2 ],
                     [ 0, 1, 2, 3 ],
                     [ 0, 1, 2, 3, 4 ],
                     [ 0, 1, 2, 3, 4, 5 ],
                     [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
                     [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ] ];

    var lineSumFunc = [];

    for (var i = 0; i < sumTerms.length; i++)
    {
        var approxSumFunc = ComputeApprox (sumTerms[i]);

        lineSumFunc[i] = d3.line ()
                           .x (function(d) { return xScale (d.x); })
                           .y (function(d) { return yScale (d.y); })
                           .curve (d3.curveMonotoneX);

        svg.append ('path')
           .datum (approxSumFunc)         
           .attr ('class', 'lineApprox')
           .attr ('id', 'lineSum_' + i)
           .attr ('d', lineSumFunc[i])
           .attr ('opacity', 0)
           .style ('stroke', ColourList[2][i]);

    }

    d3.selectAll ('.button').on ('click', function ()
    {
        //console.log ('On button CB');

        var selectedType     = +d3.select(this).node().getAttribute ('type');
        var selectedCurveNum = +d3.select(this).node().getAttribute ('curveNum');

        // toggle UI and hide/show line
        if (SelectedList[selectedType][selectedCurveNum])
        {
            // going from SHOW to HIDE

            d3.select (this).node().style.backgroundColor = "#cccccc"; 
            d3.select (this).node().style.color           = "#000000"; 

            SelectedList [selectedType][selectedCurveNum] = false;

            if (selectedType == 0)
                d3.select ('#lineOrg').transition ().duration (updateDuration).style ('opacity', 0); 
            else if (selectedType == 1)
                d3.select ('#lineTerm_' + selectedCurveNum).transition ().duration (updateDuration).style ('opacity', 0);
            else if (selectedType == 2)
                d3.select ('#lineSum_' + selectedCurveNum).transition ().duration (updateDuration).style ('opacity', 0);
        }
        else
        {
            // going to HIDE to SHOW

            d3.select(this).node().style.backgroundColor = ColourList [selectedType][selectedCurveNum];
            d3.select(this).node().style.color           = "#ffffff"; 

            SelectedList [selectedType][selectedCurveNum] = true;

            if (selectedType == 0)
                d3.select ('#lineOrg').transition ().duration (updateDuration).style ('opacity', 1);            
            else if (selectedType == 1)
                d3.select ('#lineTerm_' + selectedCurveNum).transition ().duration (updateDuration).style ('opacity', 1);
            else if (selectedType == 2)
                d3.select ('#lineSum_' + selectedCurveNum).transition ().duration (updateDuration).style ('opacity', 1);
        }
    } );


    d3.selectAll ('.button').on ('mouseenter', function ()
    {
        // enter... darken the button

        //console.log ('On button mouseenter CB');

        var selectedType     = +d3.select(this).node().getAttribute ('type');
        var selectedCurveNum = +d3.select(this).node().getAttribute ('curveNum');

        if (SelectedList [selectedType][selectedCurveNum])
        {
            d3.select(this).node().style.backgroundColor = ColourHoverList [selectedType][selectedCurveNum];
        }
        else
        {
            d3.select (this).node().style.backgroundColor = '#a6a6a6';
            d3.select (this).node().style.color           = "#000000";
        }

    } ); 


    d3.selectAll ('.button').on ('mouseleave', function ()
    {
        // leave... put button to previous state

        //console.log ('On button mouseleave CB');

        var selectedType     = +d3.select(this).node().getAttribute ('type');
        var selectedCurveNum = +d3.select(this).node().getAttribute ('curveNum');

        if (SelectedList [selectedType][selectedCurveNum])
        {
            d3.select(this).node().style.backgroundColor = ColourList [selectedType][selectedCurveNum];
        }
        else
        {
            d3.select(this).node().style.backgroundColor = '#cccccc';
            d3.select(this).node().style.color           = "#000000";
        }

    } );

}



