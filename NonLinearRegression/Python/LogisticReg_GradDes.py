#
# LogisticReg_GradDes.py
#
# Very basic logistic regression using gradient descent
#
# Usage: > python LogisticReg_GradDes.py  <DataFile>  
#


import sys  
import math 
import numpy as np


#
# Read the datafile
#
def loadData (fileName):

    file = open (fileName, 'r')

    xValues = []
    yValues = []

    lines = file.readlines()
    for line in lines:
        point = line.split ()
        xValues.append ( float(point[0]) )
        yValues.append ( float(point[1]) )

    file.close ()

    return ( xValues, yValues )


#
# sigmoid: sigmoidal function 
# 
def sigmoid (z):
    return 1 / (1 + math.exp (-z))


#
# computeGrad : used to compute the gradient for both the weight and bias
#               at each step 
#
def computeGrad (w, b, xValues, yValues):
    delta_w = 0
    delta_b = 0
    M = len (xValues)

    for i in range (M):
        z = b + w * xValues[i]
        pred = sigmoid (z)
        error = pred - yValues[i]
        
        delta_w += error * xValues[i]
        delta_b += error

    delta_w = delta_w / M
    delta_b = delta_b / M

    return (delta_w, delta_b)


#
# gradientDescent: Perform gradient descent
# 
def gradientDescent (xValues, yValues):
    weight = 0
    bias   = 0

    for e in range (MAX_EPOCHS):
        delta_w, delta_b = computeGrad (weight, bias, xValues, yValues)
        weight -= ALPHA * delta_w
        bias   -= ALPHA * delta_b

        if e % 500 == 0:
            print (f'Epoch: {e:5}  w: {weight:.6f}  b: {bias:.6f}')

    return (weight, bias)


# Initialize values

ALPHA      = 0.001
MAX_EPOCHS = 20000


if __name__ == '__main__':

    if len (sys.argv) != 2:
        print ('Error: incorrect number of parameters!')
        print ()
        print ('Usage:', sys.argv[0], '  <DataFile>')
        sys.exit ()


    # load the data...
    xValues, yValues = loadData (sys.argv[1]);

    # solve the system...
    w, b = gradientDescent (xValues, yValues)

    # report the results
    print ()
    print ('Final Results...')
    print (f'Weight: {w:.6f}  Bias: {b:.6f}')

    print ()
    for i in range (len(xValues)):
        z = w * xValues[i] + b
        predProb  = sigmoid (z)
        predClass = float (predProb > 0.5)
             
        print (f'y pred prob: {predProb:.6f}  -->  {predClass}   Actual: {yValues[i]}')



