function CanvasApp ()
{
    var MIN_ITER = 200;

    
    //
    // ComputeBifuricationDiagram: main function that computes the diagram
    // 
    function ComputeBifuricationDiagram (StorageArray, iArraySize, iMuMin, iMuMax, iMaxIter)
    {
        muStep = (iMuMax - iMuMin) / chartSize;

        dataset = d3.range (dataSize/2).map ( function(d, i)
        { 
            return d3.range (dataSize).map ( function(d, i)
                {
                    return maxColour;
                });
        });

        for (var mu = iMuMin; mu <= iMuMax; mu += muStep)
        {
            // console.log ( mu );
  
            var x = 0.5;
            
            for (var n = 0; n < iMaxIter; n++)
            {
                x = mu * x * (1 - x);

                if (n > MIN_ITER)
                {
                    var xLoc = Math.round ( (mu - iMuMin) / (iMuMax - iMuMin) * (iArraySize - 1) );
                    var yLoc = Math.round ( (1 - x) * (iArraySize/2 - 1) );
                  
                    dataset [yLoc][xLoc] -= colourStep;
                    if (dataset [yLoc][xLoc] < minColour)
                        dataset [yLoc][xLoc] = minColour;
                }
            }
        }
    }


    function DrawToContext (iStorageArray)
    {
        var canvasWidth  = canvas.width;
        var canvasHeight = canvas.height;
        var ctx = canvas.getContext ('2d');
 
        var imageData = ctx.getImageData (0, 0, canvasWidth, canvasHeight);

        var buffer = new ArrayBuffer (imageData.data.length);
        var buf8 = new Uint8ClampedArray (buffer);
        var data = new Uint32Array (buffer);

        for (var y = 0; y < canvasHeight; y++)
        {
            for (var x = 0; x < canvasWidth; x++)
            {
                var value = iStorageArray [y][x];

                if (invertColours)
                    value = maxColour - value;

                var valueR = Math.round (value * ( (colour2 [colourIndex][0] - colour1 [colourIndex][0]) ) 
                                                                            / ( maxColour - minColour + 1) + colour1 [colourIndex][0]);
                var valueG = Math.round (value * ( (colour2 [colourIndex][1] - colour1 [colourIndex][1]) ) 
                                                                            / ( maxColour - minColour + 1) + colour1 [colourIndex][1]);
                var valueB = Math.round (value * ( (colour2 [colourIndex][2] - colour1 [colourIndex][2]) ) 
                                                                            / ( maxColour - minColour + 1) + colour1 [colourIndex][2]);

                //console.log (value + '    ' + valueR + '  ' + valueG + '  ' + valueB);

                data [y * canvasWidth + x] = (255    << 24) |    // alpha
                                             (valueB << 16) |    // blue
                                             (valueG <<  8) |    // green
                                             valueR;            // red 
            }
        }  

        imageData.data.set (buf8);
        ctx.putImageData (imageData, 0, 0);
    }


    // Following this idea: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
    var chartSize = 800;
    var dataSize  = chartSize

    var muMin  = 0;
    var muMax  = 4;
    var muStep = (muMax - muMin) / chartSize;

    var maxIter = 10000;

    var colourIndex = 0;
    var colour1 = [ [   0,   0,   0 ], [   0, 102, 153 ], [   0,  51,   0 ], [ 102,   0, 204 ] ];
    var colour2 = [ [ 255, 255, 255 ], [ 242, 242, 242 ], [ 255, 255, 209 ], [ 230, 230, 255 ] ];

    var minColour  =   1; 
    var maxColour  = 100;
    var colourStep =   1;

    var invertColours = false;

    var greyLevels = 100;
    var greyStep   = Math.round (256 / greyLevels);


    // Pre-allocate space for all the pixels...
    var dataset = d3.range (dataSize/2).map ( function(d, i)
    { 
        return d3.range (dataSize).map ( function(d, i)
            {
                return maxColour; 
            });
    });

            
    var canvas = d3.select ('body')
                   .append ('canvas')
                   .style ('position', 'absolute')
                   .style ('width', chartSize + 'px')
                   .style ('height', chartSize/2 + 'px')
                   .style ('border', 'solid')
                   .style ('border-width', 'thin')
                   .style ('border-radius', '5px')
                   .attr ('width', dataSize)
                   .attr ('height', dataSize/2)
                   .node ();

    ComputeBifuricationDiagram (dataset, dataSize, muMin, muMax, maxIter);
    DrawToContext (dataset);


    //
    // Various UI callbacks...
    //
    d3.select ('#ComputeBtn').on ('click', function ()
    {
        // console.log ('ComputBtn - click');

        // Get all the numerical values 
       
        // Verify values...
        var tmpMuMin = parseFloat (document.getElementById('muMin').value);
        if (Number.isNaN (tmpMuMin))
        {
            alert ('Value is not a number!  Reverting to default');
            document.getElementById('muMin').value = 0;
        }

        var tmpMuMax = parseFloat (document.getElementById('muMax').value);
        if (Number.isNaN (tmpMuMax))
        {
            alert ('Value is not a number!  Reverting to default');
            document.getElementById('muMax').value = 4;
        }

        if (tmpMuMin >= tmpMuMax)
        {
            alert ('mu min needs to be smaller than mu max!  Reverting to default values');
            document.getElementById('muMin').value = 0;
            document.getElementById('muMax').value = 4;
        }
        else
        {
            muMin = tmpMuMin;
            muMax = tmpMuMax;
        }

        // Update the graph...
        ComputeBifuricationDiagram (dataset, dataSize, muMin, muMax, maxIter);
        DrawToContext (dataset);
                    
    } ); 


    d3.select ('#IterList').on ('change', function ()
    {
        // console.log ('IterList - on change callback');
        maxIter = d3.select(this).property('value');

        maxColour = maxIter / 100; 
    } ); 


    d3.select ('#ColList').on ('change', function ()
    {
        // console.log ('ColList - on change callback');
        colourIndex = d3.select(this).property('value');
    } );


    d3.select ('#InvColours').on ('click', function ()
    {
        // console.log ('InvColours - on click callback');
        invertColours = d3.select(this).property('checked');
    } );

}


