
//
// OriginalFunction: The original function that we are approximating
//
function OriginalFunction ()
{
    //    0  2  4
    //    | /| /|   1
    //    |/ |/ |
    //  --+--+--+-- 0
    //       

    var Coords = [ { x: 0, y: 1 }];

    Coords.push ( { x:  0, y:  0 } );
    Coords.push ( { x:  2, y:  1 } );
    Coords.push ( { x:  2, y:  0 } );
    Coords.push ( { x:  4, y:  1 } );
    Coords.push ( { x:  4, y:  0 } );

    return Coords;
}


//
// ComputeApprox: compute the approximation from the number of terms
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
                yValue += 0.5;
            }
            else
            {
                yValue -= 1 / Math.PI * 1 / n * Math.sin ( n * Math.PI * x );
            }
        }

        Results.push ( { x: x, y: yValue } );
    }

    return Results;
}


//
// GetYRange: Used to tell how big of a graph to make
//
function GetYRange ()
{
    return [ -0.4, 1.2 ];
}


//
// GetXRange: Used to tell the range of X values
//
function GetXRange ()
{
    return [ 0, 4.1 ];
}


//
// GetOriginalCurveType: Used to tell D3 how to interpolate the curve
//
function GetOriginalCurveType ()
{
    return d3.curveLinear;
}



