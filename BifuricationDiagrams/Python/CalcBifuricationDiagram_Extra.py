import numpy as np

from PIL import Image

#
# Key Variables...
#

# Width and height of the output image
height = 1000 
width  = 2000 

# extra padding around the image of where nothing is drawn
padding    = 20

# draw a box aroudn the diagram and vertical lines at specific positions
drawBox       = True
drawVertLines = False
lineColour    = (209, 224, 224)
vertLines     = [ 1, 2, 3 ]

# Either draw a white diagram on a black background or a black diagram on a white background
invertColour = True
initColour   = (255, 255, 255)

# To make things a little more pleasant to the eye, use shades of grey instead of pure black and white
greyLevels   = 8 
greyStep     = int (256 / greyLevels)

# Values of mu
muMin  = 0
muMax  = 4

# Minimum and maximum number of iterations to consider during the plot
minIter =  400
maxIter = 2000

# Create our image
img = Image.new ('RGB', (width + 2*padding, height + 2*padding), initColour)


# Draw any annotation first so it will be on the bottom of the image
if drawBox:
    for i in range (width):
        img.putpixel ( (i+padding, padding), lineColour )
        img.putpixel ( (i+padding, height+padding), lineColour )

    for i in range (height):
        img.putpixel ( (padding, i+padding), lineColour )
        img.putpixel ( (width+padding, i+padding), lineColour )

    if drawVertLines:
        for l in vertLines:
            xloc = int ( (l - muMin) / (muMax - muMin) * width )
            img.putpixel ( (padding + xloc, i+padding), lineColour )


muPercentPrev = -1

for mu in np.arange (muMin, muMax, (muMax - muMin) / width):
    
    # Used to output progress
    muPercent = int ( (mu - muMin) / (muMax - muMin) * 100 )
    if muPercent % 20 == 0 and muPercent != muPercentPrev:
       print ('  Completed: ', muPercent)
       muPercentPrev = muPercent

    x = 0.5

    for n in range (maxIter):
        
        x = mu * x * (1 - x)

        if n > minIter:

            xLoc = int ( (mu - muMin) / (muMax - muMin) * (width - 1) ) + padding
            yLoc = int ( (1 - x) * (height - 1) ) + padding

            col = list (img.getpixel ( (xLoc, yLoc) ))

            if invertColour:
               col[0] -= greyStep
               col[1] -= greyStep
               col[2] -= greyStep
               if col[0] < 0: 
                  col = (0, 0, 0)
                  
            else:
               col[0] += greyStep
               col[1] += greyStep
               col[2] += greyStep
               if col[0] > 255:
                  col[0] = (255, 255, 255)

            img.putpixel ( (xLoc, yLoc), tuple(col) )

        
img.save ('BifuricationResults.jpg', 'JPEG')



