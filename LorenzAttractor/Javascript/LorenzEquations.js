//
// LorenzEquations.js
// The code to handle the Lorenz equations functionality (without the UI and different equation stuff)
//


//
// Various resources that could be in a separate resource file
//
  
// Instead of using the entire window, use a fixed size since we have performance issues
// from using an older machine that doesn't have decent 3D capabilities
const  _CanvasSize = 450;

// Colours used in drawing
const  _CurveColour       = '#007399'; 
const  _CriticalPntColour = '#ff0066';
const  _BackGroundColour  = '#e6f2ff';

// Note to display about that particular curve
const  _ParamNotes = [ 'Always converges to zero', 
                       'Quickly converges to a critical point', 
                       'Eventually converges to a critical point',
                       'Lorenz Attractor',
                       '6-period orbit',      
                       '3-period orbit' ];

// Initial positions that give some reasonable results. 
const  _InitalPos = [ [ [ 20, 20, 20 ], [20, -20, 20], [-20, 20, 20], [-20, -20, 20] ],
                      [ [ 1, 0, 0 ], [ -1, 0, 0 ] ],
                      [ [ 10, 10, 10 ], [ -10, -10, 10 ] ],
                      [ [ 1, 0, 0 ] ],
                      [ [ 1, 0, 0 ] ],
                      [ [ 1, 0, 0 ] ] ];

// Default positions used for the camera and the geometry 
const _CamView = [ [ 0, 0, 25 ], [ 0, 0, 30 ], [ 0, 0, 45], [ 0, 0, 60], [ 0, 0, 150], [ 0, 0, 150] ];
const _GeomPos = [ [ 0, -10, 0 ], [ 0, -10, 0], [ 0, -15, 0], [ 0, -15, 0], [ 0, -70, 0], [ 0, -70, 0] ];

// Used when drawing the critical points.  The point sizes are computed based on these values.
const  _MinCritPntSize = 0.65;
const  _MaxCritPntSize = 3.00;


//
// Variables...
//

// Three.js related variables... note... 3D for the core stuff and geom for the geometry
var  _3DRenderer;
var  _3DScene;
var  _3DCamera;
var  _geomSolCurve;
var  _geomAxes;
var  _geomCritPnts;
var  _geomCont;

// Sigma, Beta, and Rho... the parameters to the Lorenz equation
const  _dSigma = 10;
const  _dBeta  = 8/3;
const  _dRho = [ 0.5, 13, 22.3, 28, 99.65, 100.75 ];
var    _nCurrRho = 3;

// Used to keep track of the computation results
var  _dCurrX  = 1;
var  _dCurrY  = 1;
var  _dCurrZ  = 1;
var  _xValues = [ ];
var  _yValues = [ ];
var  _zValues = [ ];

// Used to keep track of the critial points 
var _CriticalPntPositions = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];

// Solution curve length related
const  _nMaxPoints      = 10000;
var    _nMaxCurveLength =  2000;

// Compute rate related... how often the solution curve is updated
var  _nComputeRate = 1;
var  _nCurrStep    = 1;

// Rotation speed related... note the base speed is the amount in radians 
// to update the rotation of the Z axis.  The speed multiplier is set by the
// user via a slider
const  _dBaseRotationSpeed = 0.001;
var    _nRotationSpeedMult = 3;

// The time step used by the Runge Kutta calculations
var  _dTimeStep = 0.01;

// For each rho value, it is possible to have different initial positions.
// Hence, this is used to toggle between the different init. pos.
var  _CurrInitPos = 0;
                  
// Camera and geometry update related... Used when changing different values 
// of rho so that the view smoothly updates to a better viewpoint.             
const  _nUpdateSteps = 100;
var    _nCurrStep = _nUpdateSteps + 1;
var    _CurrCamView;
var    _CurrGeomPos;            
var    _NewCamView;
var    _NewGeomPos;            

        

//
// MakeGeomAxes: Make the three.js geometry for the axis lines
//
function MakeGeomAxes ()
{
    const grpAxes = new THREE.Group();

    const mat = new THREE.LineBasicMaterial ({ color: 0x000000 });
    for (var i = 0; i < 3; i++)
    {
        var pnts = [];
        if (i == 0)
            pnts = [ new THREE.Vector3 (-55, 0, 0), new THREE.Vector3 ( 55, 0, 0) ];
        else if (i == 1)
            pnts = [ new THREE.Vector3 (0, -55, 0), new THREE.Vector3 ( 0, 55, 0) ];
        else if (i == 2)
            pnts = [ new THREE.Vector3 (0, 0, -5), new THREE.Vector3 (0, 0, 100) ];

        const geoLine  = new THREE.BufferGeometry().setFromPoints (pnts);
        const axisLine = new THREE.Line (geoLine, mat);

        grpAxes.add (axisLine);
    }

    return grpAxes;
}


//
// MakeGeomCritPnts: make the three.js geometry for the critical points
//            
function MakeGeomCritPnts ()
{
    ComputeCriticalPointPositions ();

    /* Either use spheres or points.  
    const grpCritPnts = new THREE.Group ();

    for (var i = 0; i < 3; i++)
    {
        const geometry = new THREE.SphereGeometry (1, 7, 7);
        const material = new THREE.MeshBasicMaterial ({ color: _CriticalPntColour });

        const sphere = new THREE.Mesh (geometry, material);
        sphere.position.set (_CriticalPntPositions[i][0], _CriticalPntPositions[i][1], _CriticalPntPositions[i][2]);

        grpCritPnts.add (sphere);
    }

    return grpCritPnts;*/

    const vertices = [];
    for (var i = 0; i < 9; i++)
        vertices.push ( _CriticalPntPositions[ Math.floor(i/3) ][ i % 3 ] );

    var geometry = new THREE.BufferGeometry ();
    geometry.setAttribute ('position', new THREE.Float32BufferAttribute (vertices, 3) );

    const material = new THREE.PointsMaterial ( { color: _CriticalPntColour, size: 1 } );

    return  new THREE.Points (geometry, material);
}


//
// MakeGeomSolCurve: make the three.js geometry for the solution curve.  Note that its
//                   contents will be updated during the animation.
//
function MakeGeomSolCurve ()
{
    var positions = new Float32Array (3 * _nMaxPoints);

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute ('position', new THREE.BufferAttribute (positions, 3));
    geometry.setDrawRange (0, 0);

    const material = new THREE.LineBasicMaterial( { color: _CurveColour } );

    return new THREE.Line (geometry, material);
}


//
// init: initialize all the 3D elements and have them ready for drawing... this includes
//       the scene, renderer, camera, and any lights.
//
function init ()
{
    _3DScene = new THREE.Scene ();

    // camera
    _3DCamera = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 300);
    _3DCamera.position.set ( _CamView[_nCurrRho][0], _CamView[_nCurrRho][1], _CamView[_nCurrRho][2] );

    // renderer
    _3DRenderer = new THREE.WebGLRenderer ({ antialias: true });
    _3DRenderer.setClearColor (_BackGroundColour);
    _3DRenderer.setPixelRatio (window.devicePixelRatio);
    _3DRenderer.setSize (_CanvasSize, _CanvasSize);

    // append the renderer to the html document
    document.getElementById ('drawingArea').appendChild (_3DRenderer.domElement);

    // Make the geometry elements...

    // First, put all the geometry in a group so its easier to manipulate/rotate
    _geomCont = new THREE.Group ();
    _3DScene.add (_geomCont);

    // add the axes...
    _geomAxes = MakeGeomAxes ();
    _geomCont.add (_geomAxes);

    // add the solution curve...
    _geomSolCurve = MakeGeomSolCurve ();
    _geomCont.add (_geomSolCurve);

    // and the critical points... (and hide them)
    _geomCritPnts = MakeGeomCritPnts ();
    _geomCritPnts.visible = false;
    _geomCont.add (_geomCritPnts);

    // add some lights...
    var light = new THREE.PointLight (0xffffff, 1, 500);
    light.position.set (10, 0, 25);
    _3DScene.add (light);

    // finally adjust the position and rotation of the geometry so its 'nice'
    _geomCont.rotation.set (-Math.PI / 12 * 5, 0, Math.PI / 6);
    _geomCont.position.set ( _GeomPos[_nCurrRho][0], _GeomPos[_nCurrRho][1], _GeomPos[_nCurrRho][2] );
}


//
// updatePositions: update the solution curve with the current state of the calculations
//
function updatePositions()
{
    var positions = _geomSolCurve.geometry.attributes.position.array;

    for (var i = 0; i < _xValues.length; i++)
    {
        positions [3*i  ] = _xValues [i];
        positions [3*i+1] = _yValues [i];
        positions [3*i+2] = _zValues [i];
    }

    _geomSolCurve.geometry.setDrawRange (0, _xValues.length);
    _geomSolCurve.geometry.attributes.position.needsUpdate = true;
}


//
// render: Force an update of the scene
//
function render ()
{
    _3DRenderer.render (_3DScene, _3DCamera);
}


//
// animate: used to handle each update... basically, recompute the solution,
//          update the solution curve geometry, and adjust the viewpoint
//  
function animate ()
{
    // From mozilla.org... the window.requestAnimationFrame() method tells the 
    // browser that you wish to perform an animation and requests that the browser 
    // calls a specified function to update an animation before the next repaint.  
    // The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame (animate);

    // For each animation frame, compute the solution for the Lorenz equations based
    // on the computation rate... either do it once per frame, multiple times per frame, 
    // or once per multiple frames.  Its purely a speed thing...
    if (_nComputeRate > 0)
    {
        for (var i = 0; i < _nComputeRate; i++)
            UpdateSolution ();
    }
    else
    {
        if (_nCurrStep % (-1 * _nComputeRate) == 0)
        {
            UpdateSolution ();
            _nCurrStep = 1;
        }
        else
            _nCurrStep++;
    }

    if (CheckIfConverged ())
    {
        // console.log ('@@@ Restarting @@@');
        ResetSolution ();
    }   

    // update the geometry... that is copy the newly computed points to the geometry of the
    // solution curve
    updatePositions ();

    // When going between different values of rho, adjust the viewpoint and geometry position
    if (_nCurrStep <= _nUpdateSteps)
    {
        // note that simple linear interpolations is used... maybe next time we will 'slerp' it
        var iterFraction = _nCurrStep / _nUpdateSteps;
             
        _3DCamera.position.set ( (_NewCamView[0] - _CurrCamView.x) * iterFraction + _CurrCamView.x,
                                             (_NewCamView[1] - _CurrCamView.y) * iterFraction + _CurrCamView.y,
                                             (_NewCamView[2] - _CurrCamView.z) * iterFraction + _CurrCamView.z );
           
        _geomCont.position.set ( (_NewGeomPos[0] - _CurrGeomPos.x) * iterFraction + _CurrGeomPos.x,
                                             (_NewGeomPos[1] - _CurrGeomPos.y) * iterFraction + _CurrGeomPos.y, 
                                             (_NewGeomPos[2] - _CurrGeomPos.z) * iterFraction + _CurrGeomPos.z );
                    
        _nCurrStep++;
    }

    // always keep the graph rotating...
    _geomCont.rotation.z += (_dBaseRotationSpeed * _nRotationSpeedMult);

    // force redraw...
    render ();
} 


/* currently keep the size of the scene/canvas a fixed size
window.addEventListener ('resize', () => {
    _3DCamera.aspect = window.innerWidth / window.innerHeight;
    _3DCamera.updateProjectionMatrix();

    var elem = document.getElementById('drawingArea');

    var width  = window.innerWidth - document.getElementById ('controls').clientWidth - 10;
    var height = window.innerHeight;
    //_3DRenderer.setSize (window.innerWidth, window.innerHeight);
    //_3DRenderer.setSize (elem.clientWidth, elem.clientHeight);
    _3DRenderer.setSize (width, height);
} ) */


//
// CheckIfConverged: if we have a full curve, check if it has converged by looking if
//                   a few values have the same value.  Note that we only look at a few
//                   positions so that older machines will have a reasonable amount of
//                   performance.  Also the tolerance value, is relatively low so that
//                   things converge a bit faster.
//
function CheckIfConverged ()
{
    if (_xValues.length != _nMaxCurveLength)
                    return false;

    var allSame = true;

    var epsilon = 0.01;
    var stepSize = _nMaxCurveLength / 5;

    for (var i = stepSize; i < _nMaxCurveLength; i+=stepSize)
    {
        // uncomment for debugging
        // console.log (i, Math.abs (_xValues[i] - _xValues[0]));
        // console.log (i, Math.abs (_yValues[i] - _yValues[0]));
        // console.log (i, Math.abs (_zValues[i] - _zValues[0]));

        if ( (Math.abs (_xValues[i] - _xValues[0]) > epsilon) ||
                         (Math.abs (_yValues[i] - _yValues[0]) > epsilon) ||
                         (Math.abs (_zValues[i] - _zValues[0]) > epsilon) )
        { 
            allSame = false;
            break;
        }                   
    }

    return allSame;
}


//
// ResetSolution: Reset the solution... null out any previously saved values,
//                reset the initial position...
//           
function ResetSolution ()
{
    // make the curve zero
    _xValues = [ ];
    _yValues = [ ];
    _zValues = [ ];
 
    // reset the starting position
    _dCurrX = _InitalPos [ _nCurrRho ][ _CurrInitPos ][ 0 ];
    _dCurrY = _InitalPos [ _nCurrRho ][ _CurrInitPos ][ 1 ];
    _dCurrZ = _InitalPos [ _nCurrRho ][ _CurrInitPos ][ 2 ];

    // update the initial position and note text
    document.getElementById ('initPosText').innerText = '(' + _dCurrX + ', ' + _dCurrY + ', ' + _dCurrZ + ')';
    document.getElementById ('noteText').innerText = _ParamNotes [ _nCurrRho ];

    // go to the next initial position if it exists...
    _CurrInitPos++;
    if (_CurrInitPos >= _InitalPos [ _nCurrRho ].length)
        _CurrInitPos = 0;
}


//
// ComputeCriticalPointPositions: recompute the critical point positions
// 
function ComputeCriticalPointPositions (updateGeom=false)
{
    // Note that (0, 0, 0) is always a fixed point so no need to recompute it
 
    // compute this once...
    var val = Math.sqrt ( _dBeta * (_dRho[_nCurrRho] - 1) );

    _CriticalPntPositions [1][0] = val;
    _CriticalPntPositions [1][1] = val;
    _CriticalPntPositions [1][2] = _dRho[_nCurrRho] - 1;

    _CriticalPntPositions [2][0] = -1 * val;
    _CriticalPntPositions [2][1] = -1 * val;
    _CriticalPntPositions [2][2] = _dRho[_nCurrRho] - 1;

    if (updateGeom)
    {
        // in case spheres were used
        //_geomCritPnts.children[1].position.set (val, val, _dRho[_nCurrRho] - 1);
        //_geomCritPnts.children[2].position.set (-1*val, -1*val, _dRho[_nCurrRho] - 1);

        var positions = _geomCritPnts.geometry.attributes.position.array;

        for (var i = 3; i < 9; i++)
            positions [ i ] = _CriticalPntPositions [ Math.floor(i/3) ][ i % 3 ];

        _geomCritPnts.material.size = (_MaxCritPntSize - _MinCritPntSize) / (_dRho[5] - _dRho[0]) 
                                         * (_dRho[_nCurrRho] - _dRho[0]) + _MinCritPntSize;
        _geomCritPnts.geometry.attributes.position.needsUpdate = true;
    }
}



