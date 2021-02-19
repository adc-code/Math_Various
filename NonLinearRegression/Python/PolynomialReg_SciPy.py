#
# PolynomialReg_SciPy.py
# 
# Used to compute the polynomial of best fit for a given set of points
# using SciPy's curvefit function
#
# reference... 
# https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.curve_fit.html
#
# Usage:
# > python PolynomialReg_SciPy.py  <DataFile.txt>
# 


import numpy as np
import scipy.optimize 
import sys


if __name__ == "__main__":

    if len (sys.argv) != 2:
        print ('Error: not enough arguments!')
        print ()
        print ('Usage: ' + sys.argv[0] + ' <DataFile> ')

        sys.exit ()


    #
    # Read the datafile
    #
    file = open (sys.argv[1], 'r')

    xPoints = []
    yPoints = []

    lines = file.readlines()
    for line in lines:
        point = line.split ()
        xPoints.append ( float(point[0]) )
        yPoints.append ( float(point[1]) )

    file.close ()


    #
    # QuadraticFunc: the function we are trying to fit to...
    #
    def QuadraticFunc (x, a, b, c):
        return  a * x**2 +  b * x  +  c


    results = scipy.optimize.curve_fit (QuadraticFunc, xPoints, yPoints)
    coefs = results[0]

    print ('x^0 --> ', coefs[2])
    print ('x^1 --> ', coefs[1])
    print ('x^2 --> ', coefs[0])


    # compute r-squared
    SSE = 0
    meanY = 0
    for i in range (len(xPoints)):
        yValue = QuadraticFunc (xPoints[i], coefs[0], coefs[1], coefs[2])
        SSE   += (yPoints[i] - yValue) ** 2
        meanY += yValue

    meanY /= len (xPoints)

    SST = 0
    for point in yPoints:
        SST += (point - meanY) ** 2

    Rsqr = 1 - SSE / SST

    print ('R Squared -> ', Rsqr)



