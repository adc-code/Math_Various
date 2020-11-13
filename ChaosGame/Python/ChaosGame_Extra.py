import sys
import math
import random

from PIL import Image


#
# note about constraint rules:
#
# Rule 1: standard behaviour
# Rule 2: do not pick the previous corner
# Rule 3: do not pick the opposite from the previous corner;
#         note only works with even numbers of corners
# Rule 4: do not pick the counter clockwise corner from the previous corner
# Rule 5: do not pick the clockwise corner from the previous corner
# Rule 6: do not pick opposite from the second previous corner
#         note only works with even numbers of corners
# Rule 7: do not pick the counter clockwise corner from the second previous corner
# Rule 8: do not pick the clockwise corner from the second previous corner
# 


# key variables for the algorithm
iterations = 10000
multiplier = 0.5
numCorners = 4
ruleNum    = 6

# file to write to...
outputFileName = 'ChaosGame_5.jpg'

# The size of the image...
imgSize = 1000

# used in drawing the points... can rotate the starting location
cornerAngleOffet = -90

typeOfValues = 'Default Values'


if len (sys.argv) == 8:

    typeOfValues = 'Overloaded Values'

    numCorners       = int (sys.argv [1])
    iterations       = int (sys.argv [2])
    multiplier       = float (sys.argv [3])
    ruleNum          = int (sys.argv [4])
    cornerAngleOffet = int (sys.argv [5])
    imgSize          = int (sys.argv [6])
    outputFileName   = str (sys.argv [7])
    

print ('!! Using ', typeOfValues) 
print ('!!')    
print ('!!   numCorners: ', numCorners)
print ('!!   iterations: ', iterations)    
print ('!!   multiplier: ', multiplier)
print ('!!   ruleNum:    ', ruleNum)
print ('!!   cornerAngleOffet', cornerAngleOffet)
print ('!!   imgSize', imgSize)
print ('!!   outputFileName', outputFileName)
print ()    


# for 'opposite' corner rules, check to see if its possible and exit if not
if numCorners % 2 == 1 and (ruleNum == 3 or ruleNum == 6):
    print ('\nERROR: rule not compatible with number of corners\n\n')
    sys.exit (1)

# check that the number of corners is within limits
if numCorners < 3:
    print ('\nERROR: not enough corners\n\n')
    sys.exit (1)


# fixed random seed so we can experiment a bit with small iterations
randomSeed = 1

# size of the object as a percent of the maximum possible image size
objectSize = 0.95

# foregound (object) and background colours... 
bgColour     = (240, 245, 245)     #(0, 0, 0)   
fgColour     = (124, 3, 3)         #(73, 21, 4) #(97, 28, 5) # (255, 51, 51)
colourLevels = round ( 2 * math.log10 (iterations) )

# the radius used to draw the points
boundingRadius = int (objectSize * imgSize / 2);

# finally the center of the image which serves as the origin
centerX = int (imgSize / 2)
centerY = int (imgSize / 2)



#
# ComputeCorners: used to find the compute corner positions
#
def ComputeCorners (iNumCorners, iOffsetAngle, iLength):

    corners = [];

    for i in range (iNumCorners):

        # compute the angles (in radians) of the corner points
        angle = iOffsetAngle + i * (360 / numCorners) 
        angle *= math.pi / 180
   
        xLoc = int (iLength * math.cos (angle))
        yLoc = int (iLength * math.sin (angle)) 
        corners.append ( [ xLoc, yLoc ] )

        # print (xLoc, yLoc)

    return corners


#
# MakeConstraintList: used to find invalid corner combinations
# 
def MakeConstraintList (iRuleNum, iNumCorners):

    constraintCornerList = []

    # opposite corner constraint
    if iRuleNum == 3 or iRuleNum == 6:

        for i in range (int(iNumCorners / 2), iNumCorners):
            constraintCornerList.append (i)

        for i in range (int(iNumCorners / 2)):
            constraintCornerList.append (i)

    # next counter clockwise corner constraint
    if iRuleNum == 4 or iRuleNum == 7:

        for i in range (iNumCorners):
            offset = i - 1
            if offset < 0:
               offset += iNumCorners
            constraintCornerList.append (offset)
        
    # next clockwise corner constraint
    if iRuleNum == 5 or iRuleNum == 8:

        for i in range (iNumCorners):
            offset = i + 1
            if offset == iNumCorners:
               offset = 0
            constraintCornerList.append (offset)
        
    return constraintCornerList


#
# CheckConstraint: Used to check constraints to see if a corner is acceptable
#
def CheckConstraint (iRuleNum, iConstraintCornerList, iCurrCornerNum, iPrevCornerList):

    # The return value (or retValue) is true for the selected point is valid according to
    # the selected constraint; or false for the selected point is not valid since it
    # violates some type of constraint
    retValue = True

    # Rule 2: do not pick the previous corner
    if iRuleNum == 2 and iCurrCornerNum == iPrevCornerList[0]:
        retValue = False

    # Rule 3: do not pick the opposite from the previous corner 
    elif iRuleNum == 3 and iCurrCornerNum == iConstraintCornerList[iPrevCornerList[0]]:
        retValue = False
        
    # Rule 4: do not pick the counter clockwise corner from the previous corner
    elif iRuleNum == 4 and iCurrCornerNum == iConstraintCornerList[iPrevCornerList[0]]:
        retValue = False

    # Rule 5: do not pick the clockwise corner from the previous corner
    elif iRuleNum == 5 and iCurrCornerNum == iConstraintCornerList[iPrevCornerList[0]]:
        retValue = False

    # Rule 6: do not pick opposite from the second previous corner
    elif iRuleNum == 6 and iCurrCornerNum == iConstraintCornerList[iPrevCornerList[1]]:
        retValue = False

    # Rule 7: do not pick the counter clockwise corner from the second previous corner
    elif iRuleNum == 7 and iCurrCornerNum == iConstraintCornerList[iPrevCornerList[1]]:
        retValue = False

    # Rule 8: do not pick the clockwise corner from the second previous corner
    elif iRuleNum == 8 and iCurrCornerNum == iConstraintCornerList[iPrevCornerList[1]]:
        retValue = False

    return retValue


#
# UpdatePixel: Used to update a pixel so there will be some primitive type of shading
#
def UpdatePixel (iImage, iPixelX, iPixelY):

    currColour = list ( iImage.getpixel ( (iPixelX, iPixelY) ))

    for i in range (3):
        currColour[i] += int ( (fgColour[i] - bgColour[i]) / colourLevels )
        if currColour[i] > fgColour[i]:
            currColour[i] = fgColour[i]

    # write out the new point
    iImage.putpixel ( (iPixelX, iPixelY), tuple(currColour) )


# 
# DisplayProgress
#
def DisplayProgress (iCurrentIteration, iStep):

    requiredIteration = int (iterations / iStep)
    if iCurrentIteration % requiredIteration == 0:
        print ('  Completed (%): ', int ( iCurrentIteration / iterations * 100 ) )



# Compute the corners and constraints...
corners = ComputeCorners (numCorners, cornerAngleOffet, boundingRadius)
constraintCornerList = MakeConstraintList (ruleNum, numCorners)


# create the image
img = Image.new ('RGB', (imgSize, imgSize), bgColour)


#
# perform the main calculations
#

random.seed (randomSeed)
newPointX = 0
newPointY = 0
prevCornerList = [ 0, 0 ];

for i in range (iterations+1):

    DisplayProgress (i, 10)

    # Keep picking a corner at random until it meets the constraints
    while (1):
        cornerNum = random.randint ( 0, numCorners-1 )
        if CheckConstraint (ruleNum, constraintCornerList, cornerNum, prevCornerList):
            break;

    # compute the new point (using linear interpolation)
    newPointX = int ( multiplier * (corners[cornerNum][0] - newPointX) + newPointX )
    newPointY = int ( multiplier * (corners[cornerNum][1] - newPointY) + newPointY )

    # update the pixel value
    UpdatePixel (img, newPointX + centerX, newPointY + centerY)

    prevCornerList = [ cornerNum ] + prevCornerList
    prevCornerList.pop ()


# output the image
img.save (outputFileName, 'JPEG')



