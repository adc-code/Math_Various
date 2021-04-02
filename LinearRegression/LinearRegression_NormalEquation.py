#
# LinearRegression_NormalEquation.py
#
# Calculates simple linear regression; slope and intercept of line of best with along with R^2
#
# Usage: > python LinearRegression_NormalEquation.py <InputFile>
#
# The normal equation is...
# theta = (X^T X)^{-1} X^T y


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


    #
    # Compute slope and intercept
    #

    # Make a Matrix of the xValues...
    X = np.c_ [ np.ones ((len(xValues), 1)), xValues]

    thetaBest = np.linalg.inv (X.T.dot (X)).dot (X.T).dot (yValues)

    print ('Slope: ', thetaBest[1], ' Intercept: ', thetaBest[0])

    

