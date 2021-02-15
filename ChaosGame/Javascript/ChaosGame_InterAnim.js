function D3CanvasApp ()
{
    // 'Enumerations'
    const PLAY_BUTTON_MODE = { PLAY : 1, STOP : 2 };
    const FIRST_POINT_STATE = { CENTER : 1, FIRST_CORNER : 2, RANDOM : 3 };

            
    //
    // PerformChaosGame: Used to perform the main calculations
    //
    function PerformChaosGame ()
    {
        // Keep picking a corner at random until it meets the constraints
        var cornerNum = 0;
        while (1)
        {
            cornerNum = getRandomInt (numCorners);
            if (CheckConstraint (ruleNum, constraintCornerList, cornerNum, prevCornerList))
                break;
        }

        var prevPointX = newPointX + centerX;
        var prevPointY = newPointY + centerY;

        // compute the new point (using linear interpolation)
        newPointX = Math.round ( multiplier * (cornerList[cornerNum][0] - newPointX) + newPointX );
        newPointY = Math.round ( multiplier * (cornerList[cornerNum][1] - newPointY) + newPointY );

        xLoc = newPointX + centerX;
        yLoc = newPointY + centerY;

        DrawPoint (xLoc, yLoc); 

        prevCornerList.unshift (cornerNum);
        prevCornerList.pop ();

        currIteration++;
        d3.select ('#currIterTextBox').property ('value', currIteration);

        if (currIteration >= maxIterations)
        {
            // stop the timer
            clearInterval (updateTimer);

            // change the UI... 
            d3.select ('#StartBtn').style ('background-color', '#009933'); 
            d3.select ('#StartBtn').text ('Play');
            playBtnMode = PLAY_BUTTON_MODE.PLAY;

            // reset the count
            currIteration = 0;

            ToggleUIControls (false);
        }
    }


    function DrawPoint (pointX, pointY)
    {
        ctx.fillStyle = objColour;

        ctx.beginPath ();
        ctx.arc (pointX, pointY, objectSize, 0, 2 * Math.PI, true);
        ctx.fill ();
        ctx.closePath (); 
    }


    function DrawInitialState ()
    {
        ctx.fillStyle = bgColour;
        ctx.fillRect (0, 0, canvasWidth, canvasHeight);

        for (var i = 0; i < cornerList.length; i++)
        {
            var xLoc = centerX + cornerList[i][0];
            var yLoc = centerY + cornerList[i][1];

            DrawPoint (xLoc, yLoc);
        }

        if (startingState == FIRST_POINT_STATE.CENTER)
        {
            newPointX = 0; 
            newPointY = 0;  
        }
        else if (startingState == FIRST_POINT_STATE.FIRST_CORNER)
        {
            newPointX = cornerList[0][0];
            newPointY = cornerList[0][1];
        }
        else if (startingState == FIRST_POINT_STATE.RANDOM)
        {
            var angle  = getRandomInt (360) * Math.PI / 180;
            var length = getRandomInt (50) * 0.01;

            newPointX = Math.round (length * imgSize * Math.cos (angle));
            newPointY = Math.round (length * imgSize * Math.sin (angle));
        }

        DrawPoint (newPointX + centerX, newPointY + centerY);
    }


    // Used for the width and height
    var imgSize = 500;

    // Default colours
    var bgColour  = "#f0f5f5";
    var objColour = "#3333cc"; 

    // each number of corners has a specific angle offset so that the base of the shape is parallel
    // to the bottom of the canvas... 
    var cornerAngleOffsetList = [ 30, 45, 54, 60, 64, 67, 71 ];

    var playBtnMode   = PLAY_BUTTON_MODE.PLAY;
    var startingState = FIRST_POINT_STATE.CENTER;
    var objectSize    = 5;

    // key algorithm variables.
    var multiplier = 0.5;
    var numCorners = 3;
    var ruleNum    = 1;
    var iterations = 10;

    var newPointX = 0; 
    var newPointY = 0;  

    // the radius used to draw the points
    var boundingRadius = Math.round (0.95 * imgSize / 2);

    // 1, 10, 100, 1000, 10000, 25000, 
    var currIteration = 0;
    var maxIterations = 1000;

    // 5, 50, 100, 250, 1000
    var updateDelay = 100;

    var prevCornerList = [];
    prevCornerList.push (0);
    prevCornerList.push (0);

    // Canvas related...
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

    // Compute the corners and constraint list
    var cornerList = ComputeCorners (numCorners, cornerAngleOffsetList[numCorners-3], boundingRadius);
    var constraintCornerList = MakeConstraintList (ruleNum, numCorners);
            
    // Draw the initial state
    DrawInitialState ();

    // Used to keep the animiation going...
    var updateTimer; 


    //
    // Used to enable/disable the UI.  For now we don't allow the user to change any parameters 
    // when simulating
    // 
    function ToggleUIControls (iState)
    {
        d3.select ('#maxIterList').property ('disabled', iState);
        d3.select ('#speedList').property ('disabled', iState);
        d3.select ('#numCornerList').property ('disabled', iState);
        d3.select ('#multiplierTextBox').property ('disabled', iState);
        d3.select ('#sliderMultiplier').property ('disabled', iState);
        d3.select ('#ruleList').property ('disabled', iState);
        d3.select ('#startPointList').property ('disabled', iState);
        d3.select ('#objSizeTextBox').property ('disabled', iState);
        d3.select ('#objSizeSlider').property ('disabled', iState);
        d3.select ('#objColour').property ('disabled', iState);
        d3.select ('#bgColour').property ('disabled', iState);
    }
            

    //
    // Various callback functions
    //
    d3.select ('#StartBtn').on ('click', function ()
    {
        console.log ('On StartBtn Click CB');

        if (playBtnMode == PLAY_BUTTON_MODE.PLAY)
        {
            updateTimer = setInterval (PerformChaosGame, updateDelay);

            playBtnMode = PLAY_BUTTON_MODE.STOP;
                    
            d3.select (this).style ('background-color', '#e60000'); 
            d3.select (this).text ('Stop');

            ToggleUIControls (true);

            DrawInitialState ();
        }
        else if (playBtnMode == PLAY_BUTTON_MODE.STOP)
        {
            clearInterval (updateTimer);

            playBtnMode = PLAY_BUTTON_MODE.PLAY;

            d3.select (this).style ('background-color', '#009933'); 
            d3.select (this).text ('Play');

            ToggleUIControls (false);

            // reset the count
            currIteration = 0;
        }
    } );


    // 
    // mouseenter and mouseleave callback functions used to change to state of the 
    // start button.  Basically, this is providing slightly more functionality than
    // :hover  
    //
    d3.select ('#StartBtn').on ('mouseenter', function ()
    {
        //console.log ('On StartBtn mouseenter CB');

        if (playBtnMode == PLAY_BUTTON_MODE.PLAY)
            d3.select (this).style ('background-color', '#004d1a');
        else if (playBtnMode == PLAY_BUTTON_MODE.STOP)
            d3.select (this).style ('background-color', '#b30000');
    } );


    d3.select ('#StartBtn').on ('mouseleave', function ()
    {
        //console.log ('On StartBtn mouseleave CB');

        if (playBtnMode == PLAY_BUTTON_MODE.PLAY)
            d3.select (this).style ('background-color', '#009933');
        else if (playBtnMode == PLAY_BUTTON_MODE.PAUSE)
            d3.select (this).style ('background-color', '#e68a00');
    } );


    d3.select ('#speedList').on ('change', function ()
    {
        //console.log ('On speedList CB');
    
        updateDelay = +d3.select(this).property('value');
    } );


    d3.select ('#maxIterList').on ('change', function ()
    {
        //console.log ('ON maxIterList change CB');

        maxIterations = +d3.select(this).property ('value');
    } );
            
   
    d3.select ('#numCornerList').on ('change', function ()
    {
        //console.log ('On numCornerList CB');

        numCorners = +d3.select (this).property ('value');

        // new number of corners... so need to recompute the corners
        cornerList = ComputeCorners (numCorners, cornerAngleOffsetList[numCorners-3], boundingRadius);
        constraintCornerList = MakeConstraintList (ruleNum, numCorners);

        DrawInitialState ();
    } );

            
    d3.select ('#ruleList').on ('change', function ()
    {
        //console.log ('ON RuleList change CB');

        ruleNum = +d3.select (this).property ('value');

        // new rule... need to new constraints
        constraintCornerList = MakeConstraintList (ruleNum, numCorners);
    } );


    d3.select ('#startPointList').on ('change', function ()
    {
        //console.log ('ON startPointList change CB');

        startingState = +d3.select (this).property ('value');

        DrawInitialState ();
    } );


    d3.select ('#objColour').on ('change', function ()
    {
        //console.log ('On obj colour change CB');
                
        objColour = d3.select(this).property('value');

        DrawInitialState ();
    } );


    d3.select ('#bgColour').on ('change', function ()
    {
        // console.log ('On bg colour change CB');
                
        bgColour = d3.select(this).property('value');

        DrawInitialState ();
    } );


    d3.select ('#sliderMultiplier').on ('change', function ()
    {
        //console.log ('On multiplier slider CHANGE CB');

        multiplier = +d3.select(this).property('value');
        d3.select ('#multiplierTextBox').property('value', multiplier);
    } );


    d3.select ('#sliderMultiplier').on ('input', function ()
    {
        //console.log ('On multiplier slider INPUT CB');
                
        multiplier = +d3.select(this).property('value');
        d3.select('#multiplierTextBox').property('value', multiplier);
    } );


    d3.select ('#objSizeSlider').on ('change', function ()
    {
        //console.log ('On objSize slider CHANGE CB');

        objectSize = +d3.select (this).property ('value');
        d3.select ('#objSizeTextBox').property ('value', objectSize); 

        DrawInitialState ();
    } );


    d3.select ('#objSizeSlider').on ('input', function ()
    {
        //console.log ('On objSize slider INPUT CB');

        objectSize = +d3.select (this).property ('value');
        d3.select ('#objSizeTextBox').property ('value', objectSize);

        DrawInitialState ();
    } );  

}


