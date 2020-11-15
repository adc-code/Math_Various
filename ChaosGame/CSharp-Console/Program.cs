using System;
using System.Drawing;
using System.Collections.Generic;


//
// note about constraint rules:
//
// Rule 1: standard behaviour
// Rule 2: do not pick the previous corner
// Rule 3: do not pick the opposite from the previous corner;
//         note only works with even numbers of corners
// Rule 4: do not pick the counter clockwise corner from the previous corner
// Rule 5: do not pick the clockwise corner from the previous corner
// Rule 6: do not pick opposite from the second previous corner
//         note only works with even numbers of corners
// Rule 7: do not pick the counter clockwise corner from the second previous corner
// Rule 8: do not pick the clockwise corner from the second previous corner
// 



namespace ChaosGame_Console
{
    //
    // ChaosGame Class: contains the functionality used to compute the main elements
    //                  such as the corner locations and constraints
    //
    class ChaosGame
    {
        // ComputeCorners: Computes the corners (or fixed locations) that all calculations are
        //                  based upon
        public static List<List<int>> ComputeCorners(int iNumCorners, int iOffsetAngle, int iLength)
        {
            List<List<int>> cornerList = new List<List<int>>();

            for (int i = 0; i < iNumCorners; i++)
            {
                // compute the angles (in radians) of the corner points
                double dAngle = iOffsetAngle + i * (360 / iNumCorners);
                dAngle *= Math.PI / 180;

                int nXLoc = (int)(iLength * Math.Cos(dAngle));
                int nYLoc = (int)(iLength * Math.Sin(dAngle));

                List<int> newPoint = new List<int>();
                newPoint.Add(nXLoc);
                newPoint.Add(nYLoc);

                cornerList.Add(newPoint);
            }

            return cornerList;
        }

        
        // MakeConstraintList: determines the constraints that the rules are checked/compared
        //                     against. 
        public static List<int> MakeConstraintList(int iRuleNum, int iNumCorners)
        {
            List<int> constraintCornerList = new List<int>();

            // Opposite corner constraint
            if (iRuleNum == 3 || iRuleNum == 6)
            {
                for (int i = (int)(iNumCorners / 2); i < iNumCorners; i++)
                    constraintCornerList.Add(i);

                for (int i = 0; i < (int)(iNumCorners / 2); i++)
                    constraintCornerList.Add(i);
            }

            // next counter clockwise corner constraint
            if (iRuleNum == 4 || iRuleNum == 7)
            {
                for (int i = 0; i < iNumCorners; i++)
                {
                    int offset = i - 1;
                    if (offset < 0)
                        offset += iNumCorners;

                    constraintCornerList.Add(offset);
                }
            }

            // next clockwise corner constraint
            if (iRuleNum == 5 || iRuleNum == 8)
            {
                for (int i = 0; i < iNumCorners; i++)
                {
                    int offset = i + 1;
                    if (offset == iNumCorners)
                        offset = 0;

                    constraintCornerList.Add(offset);
                }
            }

            return constraintCornerList;
        }


        // CheckConstraint: actual comparison to verify that the corner selected is ok or 
        //                  needs to be selected again.
        public static bool CheckConstraint (int iRuleNum, 
                                            List<int> iConstraintCornerList, 
                                            int iCurrCornerNum, 
                                            List<int> iPrevCornerList)
        {
            // The return value (or retValue) is true for the selected point is valid according to
            // the selected constraint; or false for the selected point is not valid since it
            // violates some type of constraint
            bool bRetValue = true;

            // Rule 2: do not pick the previous corner
            if (iRuleNum == 2 && iCurrCornerNum == iPrevCornerList[0])
                bRetValue = false;

            // Rule 3: do not pick the opposite from the previous corner 
            else if (iRuleNum == 3 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[0]])
                bRetValue = false;

            // Rule 4: do not pick the counter clockwise corner from the previous corner
            else if (iRuleNum == 4 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[0]])
                bRetValue = false;

            // Rule 5: do not pick the clockwise corner from the previous corner
            else if (iRuleNum == 5 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[0]])
                bRetValue = false;

            // Rule 6: do not pick opposite from the second previous corner
            else if (iRuleNum == 6 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[1]])
                bRetValue = false;

            // Rule 7: do not pick the counter clockwise corner from the second previous corner
            else if (iRuleNum == 7 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[1]])
                bRetValue = false;

            // Rule 8: do not pick the clockwise corner from the second previous corner
            else if (iRuleNum == 8 && iCurrCornerNum == iConstraintCornerList[iPrevCornerList[1]])
                bRetValue = false;

            return bRetValue;
        }
    }


    class Program
    {
        static void Main(string[] args)
        {
            // key variables for the algorithm
            int    _nIterations = 1000000;
            double _dMultiplier = 0.5;
            int    _nNumCorners = 4;
            int    _nRuleNum    = 3;

            // file to write to...
            string _sOutputFileName = "ChaosGame.jpg";

            // The size of the image...
            int _nImgSize = 1000;

            // Used in drawing the points... can rotate the starting location
            int _nCornerAngleOffet = -90;

            // fixed random seed so we can experiment a bit with small iterations
            int _nRandomSeed = 1;

            // size of the object as a percent of the maximum possible image size
            double _dObjectSize = 0.95;

            // foregound (object) and background colours... 
            Color _BgColour = new Color();
            _BgColour = Color.FromArgb(255, 240, 245, 245);

            Color _FgColour = new Color();
            _FgColour = Color.FromArgb(255, 124, 3, 3);

            int _nColourLevels = (int)Math.Round(2 * Math.Log10(_nIterations));

            // the radius is where the points will be drawn
            int _nBoundingRadius = (int) (_dObjectSize * _nImgSize / 2);

            // finally the center of the image which serves as the origin
            int _nCenterX = (int)(_nImgSize / 2);
            int _nCenterY = (int)(_nImgSize / 2);

            // Compute the corners and constraints...
            List<List<int>> cornerList = ChaosGame.ComputeCorners (_nNumCorners, 
                                                                   _nCornerAngleOffet, 
                                                                   _nBoundingRadius);

            List<int> constraintCornerList = ChaosGame.MakeConstraintList (_nRuleNum, _nNumCorners);

            // create the image
            var newImg = new Bitmap (_nImgSize, _nImgSize);
            using (Graphics graph = Graphics.FromImage(newImg))
            {
                SolidBrush brush = new SolidBrush(_BgColour);
                Rectangle backGround = new Rectangle(0, 0, _nImgSize, _nImgSize);
                graph.FillRectangle(brush, backGround);
            }

            //
            // perform the main calculations
            //

            Random randomVals = new Random(_nRandomSeed);
            int newPointX = 0;
            int newPointY = 0;

            List<int> prevCornerList = new List<int>();
            prevCornerList.Add(0);
            prevCornerList.Add(0);

            for (int i = 0; i < _nIterations; i++)
            {
                // Keep picking a corner at random until it meets the constraints
                int cornerNum = 0;
                while (true)
                {
                    cornerNum = randomVals.Next(0, _nNumCorners);
                    if (ChaosGame.CheckConstraint (_nRuleNum, constraintCornerList, cornerNum, prevCornerList))
                        break;
                }

                // compute the new point (using linear interpolation)
                newPointX = (int)(_dMultiplier * (cornerList[cornerNum][0] - newPointX) + newPointX);
                newPointY = (int)(_dMultiplier * (cornerList[cornerNum][1] - newPointY) + newPointY);

                // update the pixel value
                // UpdatePixel(img, newPointX + centerX, newPointY + centerY)
                newImg.SetPixel (newPointX + _nCenterX, newPointY + _nCenterY, _FgColour);

                prevCornerList.Insert(0, cornerNum);
                prevCornerList.RemoveAt(prevCornerList.Count - 1);
            }

            // output the image
            newImg.Save (_sOutputFileName);
        }
    }
}



