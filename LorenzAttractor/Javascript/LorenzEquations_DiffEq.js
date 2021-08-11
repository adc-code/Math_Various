//
// LorenzEquations_DiffEq.js
// Functions related to computing the differential equations
//


//
// SolveSystemEquations: compute the Lorenz equations...
//
function SolveSystemEquations (iStateVec)
{
    // extract variables...
    var X = iStateVec [0];
    var Y = iStateVec [1];
    var Z = iStateVec [2];

    // Compute the Lorenz equations
    var dXdt = _dSigma * (Y - X);
    var dYdt = X * (_dRho[_nCurrRho] - Z) - Y;
    var dZdt = X * Y - _dBeta * Z;

    return [ dXdt, dYdt, dZdt ];               
}


//
// MakeStateVector... utility function used to create the state vector for a particular
//                    step of the runge kutta calculation
//
function MakeStateVector (iStateVec, iKVec, iMultiplier)
{
    var results = [];
    for (var i = 0; i < 3; i++)
        results.push (iStateVec[i] + iMultiplier * iKVec[i] * _dTimeStep);
      
    return results;
}


//
// RK4_step: perform one step of the Runge Kutta solution...
//
function RK4_step (iStateVec)
{
    var k1 = SolveSystemEquations ( iStateVec )
    var k2 = SolveSystemEquations ( MakeStateVector(iStateVec, k1, 0.5) );
    var k3 = SolveSystemEquations ( MakeStateVector(iStateVec, k2, 0.5) );
    var k4 = SolveSystemEquations ( MakeStateVector(iStateVec, k3, 1) );

    var results = [];
    for (var i = 0; i < 3; i++)
        results.push ( _dTimeStep * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]) / 6 );

    return results;
}


//
// UpdateSolution: compute the next step in the Lorenz equation and update the 
//                 history of points.
//
function UpdateSolution ()
{
    //console.log ('UpdateSolution');
    // Solve (or more precisely, numerically integrate) the Lorenz equations...
    var simStepResults = RK4_step ( [ _dCurrX, _dCurrY, _dCurrZ ] );

    // Update the current position
    _dCurrX += simStepResults [0];
    _dCurrY += simStepResults [1];
    _dCurrZ += simStepResults [2];

    // Update the history or list of points
    _xValues.push ( _dCurrX );
    _yValues.push ( _dCurrY );
    _zValues.push ( _dCurrZ );

    // Drop the first elements from the list.  Note that since the max curve length
    // can change, it is done in a list.
    while (_xValues.length > _nMaxCurveLength)
    {
        _xValues.shift ();
        _yValues.shift ();
        _zValues.shift ();
    }
}


