#
# QuadraticReg.py
# 
# Used to compute quadratic regression for a set of points
# note... https://www.varsitytutors.com/hotmath/hotmath_help/topics/quadratic-regression
#


import numpy as np
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

    points = []

    lines = file.readlines()
    for line in lines:
        point = line.split ()
        points.append ( [ float(point[0]), float(point[1]) ] )

    file.close ()

    # uncomment for testing
    # print (points)


    sum_x4 = 0
    sum_x3 = 0
    sum_x2 = 0
    sum_x  = 0

    sum_x2y = 0
    sum_xy  = 0
    sum_y   = 0

    for point in points:
        sum_x4 += point[0] ** 4
        sum_x3 += point[0] ** 3
        sum_x2 += point[0] ** 2
        sum_x  += point[0] 

        sum_x2y += point[0] ** 2 * point[1]
        sum_xy  += point[0] * point[1]
        sum_y   += point[1]

    A = np.matrix ( [ [ sum_x4, sum_x3, sum_x2 ], \
                      [ sum_x3, sum_x2, sum_x  ], \
                      [ sum_x2, sum_x,  len(points) ] ] )

    B = np.matrix ( [ sum_x2y, sum_xy, sum_y ] )

    # uncomment for testing
    # print (A)
    # print (np.linalg.inv (A))

    Ainv = np.linalg.inv (A)

    coefs = B * Ainv 

    print ('x^2 -> ', coefs.item(0))
    print ('x^1 -> ', coefs.item(1))
    print ('x^0 -> ', coefs.item(2))



    SSE = 0
    meanY = 0
    for point in points:
        yValue = coefs.item(0)*point[0]**2 + coefs.item(1)*point[0] + coefs.item(2)
        SSE   += (point[1] - yValue) ** 2
        meanY += yValue

    meanY /= len(points)

    SST = 0
    for point in points:
        SST += (point[1] - meanY) ** 2

    Rsqr = 1 - SSE / SST

    print ('R Squared -> ', Rsqr)



