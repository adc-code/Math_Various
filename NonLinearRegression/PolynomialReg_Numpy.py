#
# PolynomialReg_Numpy.py
# 
# Used to compute the polynomial of best fit for a given set of points
# using numpy's polyfit
#
# reference:
# https://numpy.org/doc/stable/reference/generated/numpy.polynomial.polynomial.polyfit.html
#
# Usage:
# > python PolynomialReg_Numpy.py <DataFile.txt> <MaxDegree>
#


import numpy as np
import sys


if __name__ == "__main__":

    if len (sys.argv) != 3:
        print ('Error: not enough arguments!')
        print ()
        print ('Usage: ' + sys.argv[0] + ' <DataFile>  <MaxDegree>')

        sys.exit ()


    #
    # Read the datafile
    #
    file = open (sys.argv[1], 'r')
    maxDegree = int (sys.argv[2])

    xPoints = []
    yPoints = []

    lines = file.readlines()
    for line in lines:
        point = line.split ()
        xPoints.append ( float(point[0]) )
        yPoints.append ( float(point[1]) )

    file.close ()

 
    # Find the curve of best fit...
    coefs = np.polynomial.polynomial.polyfit (np.array(xPoints), np.array(yPoints), maxDegree)

    for i in range(len(coefs)):
        print (f'x^{i}  -->  {coefs[i]}')

    # compute r-squared
    SSE = 0
    meanY = 0
    for i in range (len(xPoints)):
        yValue = 0
        for j in range(0, maxDegree+1):
            yValue += coefs[j] * xPoints[i]**j
        SSE   += (yPoints[i] - yValue) ** 2
        meanY += yValue

    meanY /= len (xPoints)

    SST = 0
    for point in yPoints:
        SST += (point - meanY) ** 2

    Rsqr = 1 - SSE / SST

    print ('R Squared -> ', Rsqr)



