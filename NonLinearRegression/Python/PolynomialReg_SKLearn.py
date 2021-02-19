#
# PolynomialReg_SciKitLearn.py
# 
# Used to compute the polynomial of best fit for a given set of points
# using SciKitLearn's PolynomialFeatures + LinearRegression functions/objects
#
# reference... 
# https://scikit-learn.org/stable/auto_examples/linear_model/plot_polynomial_interpolation.html
#
# Usage:
# > python PolynomialReg_SciKitLearn.py  <DataFile>  <MaxDegree>
#


import numpy as np
import sys

from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures



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

    xPoints = np.array (xPoints).reshape (len(xPoints), 1)
    yPoints = np.array (yPoints).reshape (len(yPoints), 1)


    #
    # Create and solve the model...
    #
    polyFeatures = PolynomialFeatures (degree=maxDegree, include_bias=False)
    polyX = polyFeatures.fit_transform (xPoints)
    model = LinearRegression (fit_intercept=True, normalize=False, copy_X=True, n_jobs=1)

    # Training
    model.fit (polyX, yPoints) 


    # Print out the results
    print (f'x^0  -->  {model.intercept_.item(0)}')
    for i in range (len(model.coef_)+1):
        print (f'x^{i+1}  -->  {model.coef_.item(i)}')


    # compute r-squared
    SSE = 0
    meanY = 0
    for i in range (len(xPoints)):
        yValue = model.intercept_.item(0)
        for j in range (len(model.coef_)+1):
            yValue += model.coef_.item(j) * xPoints[i]**(j+1)
        SSE   += (yPoints[i] - yValue) ** 2
        meanY += yValue

    meanY /= len (xPoints)

    SST = 0
    for point in yPoints:
        SST += (point - meanY) ** 2

    Rsqr = 1 - SSE / SST

    print ('R Squared -> ', Rsqr.item(0))



