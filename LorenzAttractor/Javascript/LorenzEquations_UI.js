//
// LorenzEquations_UI.js... 
// mainly contains the user interface related functions...
//
           
 
//
// OnRhoValueListCB: callback to handle the rho value update drop down list
//
function OnRhoValueListCB ()
{
    // lots of stuff to do...
    // console.log ('OnRhoValueListCB');

    // update rho
    _nCurrRho = +document.getElementById ('rhoValueList').value;
    _CurrInitPos = 0;

    //console.log (_nCurrRho);
               
    // reset everything... null out the curves, change the initial positions, 
    // update the text in the window 
    ResetSolution ();

    // recompute critical points
    ComputeCriticalPointPositions (true);
                
    // update view point / zoom
    _nCurrStep = 0;
    _CurrCamView = _3DCamera.position;
    _CurrGeomPos = _geomCont.position;
    _NewCamView = _CamView [ _nCurrRho ];
    _NewGeomPos = _GeomPos [ _nCurrRho ];
}


//
// OnShowCriticalPntsChkBoxCB: used to hide/show the critical points
//
function OnShowCriticalPntsChkBoxCB ()
{
    _geomCritPnts.visible = document.getElementById ('showCriticalPntsChkBox').checked;
}

            
//
// OnCurveLengthListCB: callback to handle the curve length pulldown
// 
function OnCurveLengthListCB ()
{
    _nMaxCurveLength = document.getElementById ('curveLengthList').value;

    // uncomment for debugging
    // console.log (_nMaxCurveLength);
}

            
//
// OnCompRateListCB: callback to handle the computation rate pulldown
//
function OnCompRateListCB ()
{
    _nComputeRate = +document.getElementById ('compRateList').value;
}

            
//
// OnRotSpeedSliderCB: callback to handle the rotation speed slider
//  
function OnRotSpeedSliderCB ()
{
    var value = +document.getElementById ('rotSpeedSlider').value; 
    document.getElementById ('rotSpeedOutput').value = value;

    _nRotationSpeedMult = value;
}


