#
# PolynomialReg_TF2.py
#
# Use Tensorflow 2 to determine optimal values for the polynomial of best fit
#
# Usage: > python LinearRegression_TF2.py <InputFile> <MaxDegree>
#


import sys
import tensorflow as tf 
import numpy as np 

#print (tf.__version__)

 
# learning_rate
alpha = 0.0001

MAX_EPOCHS = 100000
MIN_DELTA  = 1e-11


if len (sys.argv) != 3:

    print ('Error: incorrect number of parameters!')
    print ()
    print ('Usage: python', sys.argv[0], '  <DataFile>  <MaxDegree>')
    sys.exit ()


#
# Read the data...
#
f = open (sys.argv[1], 'r')

xValues = []
yValues = []

for line in f:
    tokens = line.split ()

    xValues.append (float (tokens[0]))
    yValues.append (float (tokens[1]))

f.close ()

xValues = np.array (xValues)
yValues = np.array (yValues)


# setup coefficents and variables...
numCoeffs = int (sys.argv [2]) + 1
coefs = tf.Variable ([0.] * numCoeffs, name='coefficients')



#
# PolyFunc: the polynomial function
#
def PolyFunc (x):
   # computes the following:
   # coefs[0] * x^0  +  coefs[1] * x^1  +  coefs[2] * x^2  +  ...  

   yValue = 0
   for i in range (numCoeffs): 
      yValue += coefs[i] * x ** i 

   return yValue


#
# cost (or loss) function
#
def CostFunc (yActual, yPred):
    return tf.reduce_mean (tf.square (yActual - yPred))


# 
# Determine the coefficients... or train the model
#
prevCost = 9e9
for epoch in range (MAX_EPOCHS+1):

   with tf.GradientTape () as tape:
      yPredicted = PolyFunc (xValues)
      cost = CostFunc (yPredicted, yValues)

   # get gradients 
   gradients = tape.gradient (cost, coefs)

   # adjust the coefficients
   coefs.assign_sub (alpha * gradients)

   if epoch % 20 == 0:
       print (f'Epoch: {epoch}  Cost: {cost}  Coefs: {coefs.numpy()}')

   deltaCost = abs (cost - prevCost)
   if deltaCost < MIN_DELTA:
       break

   prevCost = cost


#
# Print out results...
#
finalCoefs = coefs.numpy().tolist()
for i in range(len(finalCoefs)):
    print (f'x^{i} --> {finalCoefs[i]}')



