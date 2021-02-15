function D3CanvasApp ()
{
    //
    // PerformChaosGame: Used to perform the main calculations
    //
    function PerformChaosGame ()
    {
        var newPointX = cornerList[0][0];
        var newPointY = cornerList[0][1];

        var prevCornerList = [];
        prevCornerList.push (0);
        prevCornerList.push (0);

        for (var i = 0; i < iterations; i++)
        {
            // Keep picking a corner at random until it meets the constraints
            var cornerNum = 0;
            while (1)
            {
                cornerNum = getRandomInt (numCorners);
                if (CheckConstraint (ruleNum, constraintCornerList, cornerNum, prevCornerList))
                    break;
            }

            // compute the new point (using linear interpolation)
            newPointX = Math.round ( multiplier * (cornerList[cornerNum][0] - newPointX) + newPointX );
            newPointY = Math.round ( multiplier * (cornerList[cornerNum][1] - newPointY) + newPointY );

            xLoc = newPointX + centerX;
            yLoc = newPointY + centerY;

            dataset[yLoc][xLoc] = 1;

            prevCornerList.unshift (cornerNum);
            prevCornerList.pop ();
        }
    }


    //
    // Utility function used to convert colour formats: hexToRgb
    // code taken from stackoverflow...
    //
    function hexToRgb (hex) 
    {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt (result[1], 16),
            g: parseInt (result[2], 16),
            b: parseInt (result[3], 16)
        } : null;
    }


    //
    // UpdateCanvas: used to update the drawing/canvas area
    //
    function UpdateCanvas ()
    {
        var bgColourRGB = hexToRgb (bgColour);
        var fgColourRGB = hexToRgb (objColour);

        var imageData = ctx.getImageData (0, 0, canvasWidth, canvasHeight);

        var buffer  = new ArrayBuffer (imageData.data.length);
        var buf8 = new Uint8ClampedArray (buffer);
        var data = new Uint32Array (buffer);

        for (var y = 0; y < canvasHeight; y++)
        {
            for (var x = 0; x < canvasWidth; x++)
            {
                var value = dataset[y][x];

                RValue = fgColourRGB.r;
                GValue = fgColourRGB.g;
                BValue = fgColourRGB.b;

                if (value == 0)
                {
                    RValue = bgColourRGB.r;
                    GValue = bgColourRGB.g;
                    BValue = bgColourRGB.b;
                }
         
                data[y * canvasWidth + x] =
                    (255    << 24) |    // alpha
                    (BValue << 16) |    // blue
                    (GValue <<  8) |    // green
                    RValue;            // red 
            }
        }  

        imageData.data.set (buf8);
        ctx.putImageData (imageData, 0, 0);
    }

           
    //
    // ResetDataSet: set the dataset to zero
    //
    function ResetDataSet ()
    {
        dataset = d3.range (canvasHeight).map ( function(d, i)  // rows... y
        {
            return d3.range (canvasWidth).map ( function(d, i)  // columns... x
                {
                    return 0;
                });
        });
    }


    // Used for the width and height
    var imgSize = 500;

    var canvas = d3.select ('body')
                   .append ('canvas')
                   .style ('position', 'absolute')
                   .style ('width', imgSize + 'px')
                   .style ('height', imgSize + 'px')
                   .style ('border', 'solid')
                   .style ('border-width', 'thin')
                   .attr ('width', imgSize)
                   .attr ('height', imgSize)
                   .node ();

    var ctx = canvas.getContext ('2d');

    var canvasWidth  = canvas.width;
    var canvasHeight = canvas.height;

    var centerX = Math.round (canvasWidth / 2);
    var centerY = Math.round (canvasHeight / 2);

    // Pre-allocate space for all the pixels...
    var dataset = d3.range (canvasHeight).map ( function(d, i)  // rows... y 
    { 
        return d3.range (canvasWidth).map ( function(d, i)  // columns... x 
            {
                return 0; 
            });
    });


    var iterationsNonIteractive = 10000;
    var iterationsIteractive    =  1000;
    var iterations = iterationsNonIteractive;

    var multiplier = 0.5;
    var numCorners = 3;
    var ruleNum    = 1;

    // used in drawing the points... can rotate the starting location
    var cornerAngleOffet = 0;

    var objectSize = 0.75; 

    // the radius used to draw the points
    var boundingRadius = Math.round (objectSize * imgSize / 2);

    var objColour = "#7c0303"; 
    var bgColour  = "#f0f5f5";


    // Compute the corners and constraint list
    var cornerList = ComputeCorners (numCorners, cornerAngleOffet, boundingRadius);
    var constraintCornerList = MakeConstraintList (ruleNum, numCorners);

    // Compute the results and update the drawing area
    PerformChaosGame ();
    UpdateCanvas ();


    //
    // Various callback functions
    //
    d3.select ('#numCornerList').on ('change', function ()
    {
        //console.log ('On numCornerList CB');

        numCorners = +d3.select(this).property('value');

        // recompute corners and constraints
        cornerList = ComputeCorners (numCorners, cornerAngleOffet, boundingRadius);
        constraintCornerList = MakeConstraintList (ruleNum, numCorners);

        ResetDataSet ();

        // recompute diagram
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas ();
    } );

            
    d3.select ('#objColour').on ('change', function ()
    {
        //console.log ('On obj colour change CB');
                
        objColour = d3.select(this).property('value');

        ResetDataSet ();

        // recompute diagram
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas ();
    } );


    d3.select ('#bgColour').on ('change', function ()
    {
        // console.log ('On bg colour change CB');
                
        bgColour = d3.select(this).property('value');

        ResetDataSet ();

        // recompute diagram
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas ();
    } );

            
    d3.select ('#sliderAngle').on ('change', function ()
    {
        //console.log ('On angle slider CHANGE CB');

        cornerAngleOffet = +d3.select(this).property('value');

        d3.select('#angleTextBox').property('value', cornerAngleOffet);

        cornerList = ComputeCorners (numCorners, cornerAngleOffet, boundingRadius);
        constraintCornerList = MakeConstraintList (ruleNum, numCorners);

        ResetDataSet ();

        // recompute diagram
        iterations = iterationsNonIteractive;
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas ();
    } );


    d3.select ('#sliderAngle').on ('input', function ()
    {
        //console.log ('On angle slider INPUT CB');
                
        cornerAngleOffet = +d3.select(this).property('value');
        d3.select('#angleTextBox').property('value', cornerAngleOffet);

        cornerList = ComputeCorners (numCorners, cornerAngleOffet, boundingRadius);
        constraintCornerList = MakeConstraintList (ruleNum, numCorners);

        ResetDataSet ();

        // recompute diagram
        iterations = iterationsIteractive;
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas ();
    } );


    d3.select ('#ruleList').on ('change', function ()
    {
        //console.log ('ON RuleList change CB');

        ruleNum = +d3.select(this).property ('value');

        constraintCornerList = MakeConstraintList (ruleNum, numCorners);

        ResetDataSet ();

        // recompute diagram
        iterations = iterationsNonIteractive;
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas ();
    } );


    d3.select ('#sliderMultiplier').on ('change', function ()
    {
        //console.log ('On multiplier slider CHANGE CB');

        multiplier = +d3.select(this).property('value');

        d3.select('#multiplierTextBox').property('value', multiplier);

        ResetDataSet ();

        // recompute diagram
        iterations = iterationsNonIteractive;
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas ();
    } );


    d3.select ('#sliderMultiplier').on ('input', function ()
    {
        //console.log ('On multiplier slider INPUT CB');
                
        multiplier = +d3.select(this).property('value');
        d3.select('#multiplierTextBox').property('value', multiplier);

        ResetDataSet ();

        // recompute diagram
        iterations = iterationsIteractive;
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas ();
    } );


    d3.select ('#maxIterList').on ('change', function ()
    {
        //console.log ('ON maxIterList change CB');

        iterationsNonIteractive = +d3.select(this).property ('value');
        iterationsIteractive = iterationsNonIteractive * (+d3.select('#intIterList').property ('value'));

        ResetDataSet ();

        // recompute diagram
        iterations = iterationsNonIteractive;
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas (); 
    } );
               

    d3.select ('#intIterList').on ('change', function ()
    {
        //console.log ('ON intIterList change CB');

        iterationsIteractive = iterationsNonIteractive * (+d3.select(this).property ('value'));
    } );
            
   
    d3.select ('#objSizeSlider').on ('change', function ()
    {
        //console.log ('On objSize slider CHANGE CB');
        var value = +d3.select(this).property('value');

        d3.select('#objSizeTextBox').property('value', value + '%');

        if (value == 100)
            value = 99;

        objectSize = value * 0.01;
        boundingRadius = Math.round (objectSize * imgSize / 2);

        cornerList = ComputeCorners (numCorners, cornerAngleOffet, boundingRadius);

        ResetDataSet ();

        // recompute diagram
        iterations = iterationsNonIteractive;
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas ();
    } );


    d3.select ('#objSizeSlider').on ('input', function ()
    {
        //console.log ('On objSize slider INPUT CB');
        var value = +d3.select(this).property('value');

        d3.select('#objSizeTextBox').property('value', value + '%');

        if (value == 100)
            value = 99;

        objectSize = value * 0.01;
        boundingRadius = Math.round (objectSize * imgSize / 2);

        cornerList = ComputeCorners (numCorners, cornerAngleOffet, boundingRadius);

        ResetDataSet ();

        // recompute diagram
        iterations = iterationsIteractive;
        PerformChaosGame ();

        // redraw diagram                
        UpdateCanvas ();
    } );

}



