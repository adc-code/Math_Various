#
# LogisticReg_TF2.py
#
# Very basic logistic regression using TensorFlow 2
#
# Usage: > python LogisticReg_TF2.py  <DataFile>  
#


import sys
import tensorflow as tf
import numpy as np

print (f'TensorFlow Version: {tf.__version__}')


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

    return ( np.array (xValues, dtype=np.float32).reshape(-1,1), 
             np.array (yValues, dtype=np.float32).reshape(-1,1) )


if __name__ == '__main__':

    if len (sys.argv) != 2:
        print ('Error: incorrect number of parameters!')
        print ()
        print ('Usage:', sys.argv[0], '  <DataFile>')
        sys.exit ()


    X, y = loadData (sys.argv[1])

    # Key parameters
    ALPHA      = 0.001
    MAX_EPOCHS = 2000

    # Weights
    tf.random.set_seed (2021)
    W = tf.Variable (tf.random.normal ([1], mean=0.0))
    b = tf.Variable (tf.random.normal ([1], mean=0.0))

    #
    # Hypothesis and Prediction Function
    #
    def predict (X):
        z = tf.math.multiply (X, W) + b
        pred = 1 / (1 + tf.exp(-z))
        return pred 


    #
    # Training... that is solve using gradient descent
    #
    for e in range (MAX_EPOCHS+1):

        with tf.GradientTape() as tape:

            hypothesis = predict (X)
            cost = tf.reduce_mean (-tf.reduce_sum (y * tf.math.log (hypothesis) + (1 - y) * tf.math.log (1 - hypothesis)))        
            W_grad, b_grad = tape.gradient (cost, [W, b])
  
            W.assign_sub (ALPHA * W_grad)
            b.assign_sub (ALPHA * b_grad)

        if e % 400 == 0:
            print (f'Epoch: {e:4}  Weights: {W.numpy()}  Bias: {b.numpy()}  Cost: {cost.numpy()}')


    # 
    # report results...
    #
    print ()

    results = predict (X).numpy().tolist()
    for i, value in enumerate (results):
        print (f'Probability: {value[0]:.5f} -->  {(value[0] > 0.5)}   Actual: {y[i] > 0.5}')



