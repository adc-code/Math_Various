import math
import random

from PIL import Image


random.seed (1)


# key variables for the algorithm
iterations = 100000
multiplier = 0.5
numCorners = 3

# The size of the image...
imgSize = 1000

# size of the object as a percent of the maximum possible image size
objectSize = 0.95

# used in drawing the points... can rotate the starting location
cornerAngleOffet = -90

# foregound (object) and background colours... 
BgColour = (0, 0, 0)   
FgColour = (204, 255, 102)

# the radius used to draw the points
boundingRadius = int (objectSize * imgSize / 2);

# finally the center of the image which serves as the origin
centerX = int (imgSize / 2)
centerY = int (imgSize / 2)



#
# compute corner positions
#
corners = [];

for i in range (numCorners):

    # compute the angles (in radians) of the corner points
    angle = cornerAngleOffet + i * (360 / numCorners) 
    angle *= math.pi / 180
   
    xLoc = int (boundingRadius * math.cos (angle)) + centerX
    yLoc = int (boundingRadius * math.sin (angle)) + centerY
    corners.append ( [ xLoc, yLoc ] )

    # print (xLoc, yLoc)



# create the image
img = Image.new ('RGB', (imgSize, imgSize), BgColour)

#
# perform the main calculations
#
newPointX = 0
newPointY = 0

for i in range (iterations):

    # pick a corner
    cornerNum = random.randint ( 0, numCorners-1 )

    # compute the new point (using linear interpolation)
    newPointX = int ( multiplier * (corners[cornerNum][0] - newPointX) + newPointX )
    newPointY = int ( multiplier * (corners[cornerNum][1] - newPointY) + newPointY )

    # write out the new point
    img.putpixel ( (newPointX, newPointY), FgColour )


# output the image
img.save ('ChaosGame_Basic.jpg', 'JPEG')



