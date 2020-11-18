function ComputeCorners (iNumCorners, iOffsetAngle, iLength)
{
    var corners = [];

    for (var i = 0; i < iNumCorners; i++)
    {
        // compute the angles (in radians) of the corner points
        var angle = iOffsetAngle + i * (360 / numCorners);
        angle *= Math.PI / 180;
   
        var xLoc = Math.round (iLength * Math.cos (angle));
        var yLoc = Math.round (iLength * Math.sin (angle));

        corners.push ( [ xLoc, yLoc ] );

        //console.log (xLoc, yLoc);
    }

    return corners;
}



// MakeConstraintList: used to find invalid corner combinations
function MakeConstraintList (iRuleNum, iNumCorners)
{
    var constraintCornerList = [];

    // opposite corner constraint
    if (iRuleNum == 3 || iRuleNum == 6)
    {
        for (var i = Math.round (iNumCorners / 2); i < iNumCorners; i++)
            constraintCornerList.push (i);

        for (var i = 0; i < Math.round (iNumCorners / 2); i++)
            constraintCornerList.push (i);
    }

    // next counter clockwise corner constraint
    if (iRuleNum == 4 || iRuleNum == 7)
    {
        for (var i = 0; i < iNumCorners; i++)
        {
            var offset = i - 1;
            if (offset < 0)
                offset += iNumCorners;

            constraintCornerList.push (offset);
        }
    }
        
    // next clockwise corner constraint
    if (iRuleNum == 5 || iRuleNum == 8)
    {
        for (var i = 0; i < iNumCorners; i++)
        {
            var offset = i + 1;
            if (offset == iNumCorners)
                offset = 0;

            constraintCornerList.push (offset);
        }
    }

    return constraintCornerList;
}


// CheckConstraint: Used to check constraints to see if a corner is acceptable
function CheckConstraint (iRuleNum, iConstraintCornerList, iCurrCornerNum, iPrevCornerList)
{
    // The return value (or retValue) is true for the selected point is valid according to
    // the selected constraint; or false for the selected point is not valid since it
    // violates some type of constraint
    var retValue = true;

    // Rule 2: do not pick the previous corner
    if (iRuleNum == 2 && iCurrCornerNum == iPrevCornerList[0])
        retValue = false;

    // Rule 3: do not pick the opposite from the previous corner 
    else if (iRuleNum == 3 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[0]])
        retValue = false;
        
    // Rule 4: do not pick the counter clockwise corner from the previous corner
    else if (iRuleNum == 4 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[0]])
        retValue = false;

    // Rule 5: do not pick the clockwise corner from the previous corner
    else if (iRuleNum == 5 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[0]])
        retValue = false;

    // Rule 6: do not pick opposite from the second previous corner
    else if (iRuleNum == 6 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[1]])
        retValue = false;

    // Rule 7: do not pick the counter clockwise corner from the second previous corner
    else if (iRuleNum == 7 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[1]])
        retValue = false;

    // Rule 8: do not pick the clockwise corner from the second previous corner
    else if (iRuleNum == 8 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[1]])
        retValue = false;

    return retValue;
}



function getRandomInt (max)
{
    return Math.floor (Math.random() * Math.floor(max));
}


