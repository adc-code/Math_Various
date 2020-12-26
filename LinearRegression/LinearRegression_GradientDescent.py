#
# LinearRegression_GradientDescent.py
#
# Gradient descent to determine optimal values for the slope and intercept
#
# Usage: > python LinearRegression_GradientDescent.py <InputFile>
#


import sys
import numpy as np
import random


# learning rate
alpha = 0.0001 

# convergence criteria
epsilon = 1e-8

# number of epochs
numEpochs = 100000


#
# Load the data...
#
def loadData ():

    xValues = []
    yValues = []

    f = open (sys.argv[1], 'r')
    for line in f:
        tokens = line.split (',')

        xValues.append (float (tokens[0]))
        yValues.append (float (tokens[1]))

    f.close ()

    return (xValues, yValues)


#
# LineFunction: determines values from the equation of a line 
#
def LineFunction (xValues, slope, intercept):

    if isinstance (xValues, list):

        # list of values... 

        yValues = []
        for x in xValues:
            yValues.append (slope * x + intercept)

        return yValues

    elif isinstance (xValues, float):

        # single value
        return slope * xValues + intercept


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
def GradientDescent (xValues, yValues, alpha, epochs, epsilon):

    slope     = random.uniform (-10, 10)
    intercept = random.uniform (-10, 10)
    N         = len (yValues)
    prevLoss  = 9e9

    for e in range (epochs): 

        for i in range (N):

            xi = xValues[i]
            yi = yValues[i]
 
            residual = yi - LineFunction (xi, slope, intercept)

            slope     -= alpha * (-2/N * xi * residual)
            intercept -= alpha * (-2/N * residual)

        loss = MeanSquareError (yValues, LineFunction (xValues, slope, intercept))

        if e % 5000 == 0:
            print (loss, slope, intercept)

        if abs (prevLoss - loss) < epsilon:
            break

        prevLoss = loss
        
    return (slope, intercept)


if __name__ == '__main__':

    if len (sys.argv) != 2:
        print ('Error: incorrect number of parameters!')
        print ()
        print ('Usage:', sys.argv[0], '  <DataFile>')
        sys.exit ()

    # load the data, perform gradient descent to find the slope and intercept, and then print them out
    xValues, yValues = loadData ()        
    slope, intercept = GradientDescent (xValues, yValues, alpha, numEpochs, epsilon)
    print ('Slope: ', slope, '   Intercept: ', intercept)



