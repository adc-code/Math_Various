#
# PolynomialReg_GradDes.py
#
# Gradient descent implementation to determine optimal values for the coefficients of the 
# polynomial of best fit
#
# Usage: > python PolynomialReg_GradDes.py  <DataFile>  <MaxDegree>
#


import sys
import numpy as np


# learning rate
alpha = 0.0001 

# convergence criteria
epsilon = 1e-8

# number of epochs
numEpochs = 1000000


#
# Load the data...
#
def loadData (fileName):

    xValues = []
    yValues = []

    f = open (fileName, 'r')
    for line in f:
        tokens = line.split ()

        xValues.append (float (tokens[0]))
        yValues.append (float (tokens[1]))

    f.close ()

    return (xValues, yValues)


#
# PolyFunction: evaluate a polynomial
#
def PolyFunction (xValues, coefs):

    if isinstance (xValues, list):

        # list of values... 

        yValues = []
        for x in xValues:
            yValue = 0
            for i in range (len(coefs)):
                yValue += coefs[i] * xValues[i] ** i
            yValues.append (yValue)

        return yValues

    elif isinstance (xValues, float):

        # single value
        yValue = 0
        for i in range (len(coefs)):
            yValue += coefs[i] * xValues ** i

        return yValue


#
# MeanSquareError: computes the mean square error
#
def MeanSquareError (yValuesGiven, yValuesPred):

    N = len (yValuesGiven)
    sum = 0
    for i in range (N):
        sum += (yValuesGiven[i] - yValuesPred[i]) ** 2

    MSE = sum / N

    return MSE


#
# GradientDescent
#
def GradientDescent (xValues, yValues, numDegrees, alpha, epochs, epsilon):

    coefs = np.random.uniform (-10, 10, numDegrees+1)
    N         = len (yValues)
    prevLoss  = 9e9

    for e in range (epochs): 

        for i in range (N):

            xi = xValues[i]
            yi = yValues[i]
 
            residual = PolyFunction (xi, coefs) - yi

            for j in range (len(coefs)):
                coefs[j] -= alpha * (2/N) * residual * xi ** j

        loss = MeanSquareError (yValues, PolyFunction (xValues, coefs))

        if e % 5000 == 0:
            print ('Loss: ', loss, ' Coefs: ', coefs)

        if abs (prevLoss - loss) < epsilon:
            break

        prevLoss = loss
        
    return coefs



if __name__ == '__main__':

    if len (sys.argv) != 3:
        print ('Error: incorrect number of parameters!')
        print ()
        print ('Usage:', sys.argv[0], '  <DataFile>  <MaxNumDegrees>')
        sys.exit ()


    # load the data, perform gradient descent to find the coefs and then print them out
    xValues, yValues = loadData (sys.argv[1])
    maxDegree = int (sys.argv[2])

    coefs = GradientDescent (xValues, yValues, maxDegree, alpha, numEpochs, epsilon)

    print ('\nResults\n') 
    for i in range(len(coefs)):
        print (f'x^{i}  -->  {coefs[i]}')



