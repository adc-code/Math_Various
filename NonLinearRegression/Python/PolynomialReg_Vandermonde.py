#
# PolynomialReg_Vandermonde.py
# 
# Used to compute the polynomial of best fit for a given set of points
# using the Vandermonde matrix.
#
# reference... 
# https://en.wikipedia.org/wiki/Vandermonde_matrix
#
# > python PolynomialReg_Vandermonde.py  <DataFile>  <MaxDegree>
#


import numpy as np
import sys


if __name__ == "__main__":

    if len (sys.argv) != 3:
        print ('Error: not enough arguments!')
        print ()
        print ('Usage: ' + sys.argv[0] + ' <DataFile>  <Degree>')

        sys.exit ()


    #
    # Read the datafile
    #
    file = open (sys.argv[1], 'r')

    points = []

    lines = file.readlines()
    for line in lines:
        point = line.split ()
        points.append ( [ float(point[0]), float(point[1]) ] )

    file.close ()

    # uncomment for testing
    # print (points)

    maxDegree = int (sys.argv[2])


    # construct the VM matrix
    X = []
    Y = []

    for point in points:
        row = []
        for m in range(0, maxDegree+1):
            if m == 0:
                row.append (1)
            else:
                row.append (point[0] ** m)

        X.append (row)
        Y.append (point[1])

    xMat = np.matrix ( X )
    yMat = np.matrix ( Y )

    # solve the matrix
    xMatTrans = xMat.transpose()
    tmpMat = np.matmul (xMatTrans, xMat)
    tmpMat = np.linalg.inv (tmpMat) 
    solMat = np.matmul (tmpMat, xMatTrans)

    # determine the coefficients
    coefs = np.matmul (solMat, Y)
    for i in range(0, maxDegree+1):
        print (f'x^{i}  -->  {coefs.item(i)}')


    # compute R-squared
    SSE = 0
    meanY = 0
    for point in points:
        yValue = 0
        for j in range(0, maxDegree+1):
            yValue += coefs.item(j) * point[0]**j
        SSE   += (point[1] - yValue) ** 2
        meanY += yValue

    meanY /= len(points)

    SST = 0
    for point in points:
        SST += (point[1] - meanY) ** 2

    Rsqr = 1 - SSE / SST

    print ('R Squared -> ', Rsqr)



