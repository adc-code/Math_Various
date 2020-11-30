//
// OriginalFunction: The function that is being approximated
//
function OriginalFunction ()
{
    var Coords = [ { x: 0, y: 1 }];

    Coords.push ( { x:  1, y:  -1 } );
    Coords.push ( { x:  2, y:   1 } );
    Coords.push ( { x:  3, y:  -1 } );
    Coords.push ( { x:  4, y:   1 } );

    return Coords;
}


// 
// ComputeApprox: used to compute the approximation with the specific terms
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
                yValue += 0;
            }
            else
            {
                yValue += 8 / (Math.PI * Math.PI) * 1 / ( (2*n-1) * (2*n- 1) ) * Math.cos ((2*n - 1) * Math.PI * x);
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
    return [ -1.3, 1.3 ];
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
    return d3.curveLinear;
}



