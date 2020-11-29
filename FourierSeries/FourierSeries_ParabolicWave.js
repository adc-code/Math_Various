//
// OriginalFunction: the original function... in this case its a periodic parabolic function
//
function OriginalFunction ()
{
    var Coords = [ ];

    for (var x = 0; x <= 1; x += 0.01)
        Coords.push ( { x: x, y: x*x } );

    for (var x = 1; x <= 3; x += 0.01) 
        Coords.push ( { x: x, y: (x-2)*(x-2) } );

    for (var x = 3; x <= 4; x += 0.01)
        Coords.push ( { x: x, y: (x-4)*(x-4) } );

    return Coords;
}


//
// ComputeApprox: used to compute the approximation
//
function ComputeApprox (iTermList)
{
    var X1 = 0;
    var X2 = 4;
    var XNumSteps = 300;
    var XStepSize = (X2 - X1) / XNumSteps;

    var Results = [];

    for (var x = X1; x <= X2; x += XStepSize)
    {
        var yValue = 0;
        for (var i = 0; i < iTermList.length; i++)
        {
            var n = iTermList [i];

            if (n == 0)
            {
                yValue += 1 / 3;
            }
            else
            {
                yValue += 4 / (Math.PI * Math.PI) * Math.pow (-1, n) / (n * n) * Math.cos ( n * Math.PI * x);
            }
        }

        Results.push ( { x: x, y: yValue } );
    }

    return Results;
}


//
// GetYRange: used to get the vertical size of the graph
//
function GetYRange ()
{
    return [ -0.4, 1.2 ];
}


//
// GetXRange: used to get the horizontal size of the graph
//
function GetXRange ()
{
    return [ 0, 4.1 ];
}


//
// GetOriginalCurveType: used to tell D3 how to draw the graph
//
function GetOriginalCurveType ()
{
    return d3.curveMonotoneX;
}



