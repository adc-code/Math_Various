#
# LinearRegression_Numpy.py
#
# Calculates simple linear regression; slope and intercept of line of best with along with R^2
#
# Usage: > python LinearRegression_Numpy.py <InputFile>
#


import sys
import numpy as np


if len (sys.argv) == 2:

    # Read in the file...
    fileName = sys.argv [1]

    f = open (fileName, 'r')

    xValues = []
    yValues = []

    for line in f:
        tokens = line.split (',')

        xValues.append (float (tokens[0]))
        yValues.append (float (tokens[1]))

    f.close ()


    # Compute slope and intercept
    coefficients = np.polyfit (xValues, yValues, 1)


    # Compute R squared
    bestFit = np.poly1d (coefficients)

    yFit = bestFit (xValues)
    yMean = np.sum (yValues) / len(yValues)

    ssReg = np.sum ( (yFit - yMean) ** 2 )
    ssTot = np.sum ( (yValues - yMean) ** 2 )

    r2 = ssReg / ssTot

    print ('Slope: ', coefficients[0], ' Intercept: ', coefficients[1], ' R-Squared: ', r2)

    


