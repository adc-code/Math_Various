import numpy as np

from PIL import Image


height = 1000
width  = 2000

muMin  = 0
muMax  = 4

muIter = width
muStep = (muMax - muMin) / width

maxIter = 700
minIter = 200


img = Image.new ('L', (width, height))

for mu in np.arange (muMin, muMax, muStep):
    
    x = 0.5

    for n in range (maxIter):
        
        x = mu * x * (1 - x)

        if n > minIter:

            xLoc = int ( (mu - muMin) / (muMax - muMin) * (width - 1) )
            yLoc = int ( (1 - x) * (height - 1) )

            img.putpixel ( (xLoc, yLoc), 255)

img.save ('BifuricationResults.jpg', 'JPEG')


