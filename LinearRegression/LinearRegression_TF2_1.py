#
# LinearRegression_TF2_1.py
#
# Used tensorflow 2 to determine optimal values for the slope and intercept
#
# Usage: > python LinearRegression_TF2_1.py <InputFile>
#


import sys
import time
import numpy as np
import tensorflow as tf

#print (tf.__version__)


learningRate = 0.0002
MIN_DELTA    = 0.0000001
MAX_EPOCHS   = 50000


class LinearModel:
    def __init__ (self):
        self.Slope = tf.Variable (1.0)   # note slope is the weight
        self.Inter = tf.Variable (1.0)   # note inter is the bias

    def __call__ (self, x):
        return self.Slope * x + self.Inter
    

def loadData ():

    xValues = []
    yValues = []

    f = open (sys.argv[1], 'r')
    for line in f:
        tokens = line.split (',')

        xValues.append (float (tokens[0]))
        yValues.append (float (tokens[1]))

    f.close ()

    return (np.array (xValues), np.array (yValues))



def lossFunc (yActual, yPred):
    return tf.reduce_mean (tf.square (yActual - yPred))



def train (linModel, x, y, learnRate=0.000001):

    with tf.GradientTape() as t:
        currLoss = lossFunc (y, linModel(x))

        dSlope, dInter = t.gradient (currLoss, [linModel.Slope, linModel.Inter])

        linModel.Slope.assign_sub (learnRate * dSlope)
        linModel.Inter.assign_sub (learnRate * dInter)

        return currLoss



if len (sys.argv) != 2:
    print ('Error: incorrect number of parameters!')
    print ()
    print ('Usage:', sys.argv[0], '  <DataFile>')
    sys.exit ()

xValues, yValues = loadData ()    


epoch    = 1
prevLoss = 9e9
linModel = LinearModel ()

while (1):

    currLoss = train (linModel, xValues, yValues, learningRate)

    if epoch % 1000 == 0:
        print (f"Epoch: {epoch}  Loss value: {currLoss.numpy()}  Slope: {linModel.Slope.numpy()}  Intercept: {linModel.Inter.numpy()}")

    deltaLoss = abs (currLoss - prevLoss)
    if deltaLoss < MIN_DELTA or epoch > MAX_EPOCHS:
        break

    prevLoss = currLoss
    epoch += 1


print (linModel.Slope.numpy(), linModel.Inter.numpy())

RMSE = lossFunc (yValues, linModel (xValues))
print (RMSE.numpy())



