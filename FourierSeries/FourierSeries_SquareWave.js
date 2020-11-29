//
// OriginalFunction: returns values that define the original function
//
function OriginalFunction ()
{
    //    0  1  2  3  4
    //    +--+  +--+      1
    //    |  |  |  |
    //  --+--+--+--+--+-- 0
    //       |  |  |  |
    //       +--+  +--+  -1

    var Coords = [ { x: 0, y: 0 }];

    Coords.push ( { x:  0, y:  1 } );
    Coords.push ( { x:  1, y:  1 } );
    Coords.push ( { x:  1, y:  0 } );
    Coords.push ( { x:  1, y: -1 } );
    Coords.push ( { x:  2, y: -1 } );
    Coords.push ( { x:  2, y:  0 } );
    Coords.push ( { x:  2, y:  1 } );
    Coords.push ( { x:  3, y:  1 } );
    Coords.push ( { x:  3, y:  0 } );
    Coords.push ( { x:  3, y: -1 } );
    Coords.push ( { x:  4, y: -1 } );
    Coords.push ( { x:  4, y:  0 } );

    return Coords;
}


//
// ComputeApprox: Computes the Fourier series based on a list of the number of terms
// 
function ComputeApprox (iTermList)
{
    var X1 = 0;
    var X2 = 4;
    var XNumSteps = 300;
    var XStepSize = (X2 - X1) / XNumSteps;

    var Results = [];

    // 2i - 1: 1, 3, 5
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
                yValue += 4 / Math.PI * 1 / (2*n - 1) * Math.sin ( (2*n - 1) * Math.PI * x );
            }
        }

        Results.push ( { x: x, y: yValue } );
    }

    return Results;
}


//
// GetYRange: Gets the Y range used in drawing the graph
//
function GetYRange()
{
    return [ -1.4, 1.4 ];
}


//
// GetXRange: Gets the X range used in drawing the graph
//
function GetXRange()
{
    return [ 0, 4.1 ];
}


//
// GetOriginalCurveType: Gets how D3 should draw the original graph
//
function GetOriginalCurveType ()
{
    return d3.curveLinear;
}



