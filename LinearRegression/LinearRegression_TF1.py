#
# LinearRegression_TF1.py
#
# Uses TensorFlow to determine the line of best fit through the data set.  Not
# exactly linear regression since the result is determined through optimization.
#
# Usage: > python LinearRegression_TF1.py <InputFile>
#


import numpy as np
import sys
import tensorflow as tf


LOSS_THRESHOLD = 0.0000001


if len (sys.argv) == 2:

    fileName = sys.argv [1]

    f = open (fileName, 'r')

    xValues = []
    yValues = []

    for line in f:
        tokens = line.split (',')

        xValues.append (float (tokens[0]))
        yValues.append (float (tokens[1]))

    f.close ()


    #
    # Compute using tensorflow
    #

    # constants
    constX = tf.constant (xValues)
    constY = tf.constant (yValues)

    # variables
    varSlope = tf.Variable (tf.random.normal([]))
    varInter = tf.Variable (tf.random.normal([]))

    # Compute model and loss
    model    = tf.add (tf.multiply (constX, varSlope), varInter)
    lossFunc = tf.reduce_mean (tf.pow (model - constY, 2))

    learn_rate  = 0.001

    # Using the Adam Optimizer
    optimizer = tf.train.AdamOptimizer (learn_rate).minimize (lossFunc)

    # Initialize variables
    init = tf.global_variables_initializer ()

    # Launch session
    with tf.Session () as sess:
        sess.run (init)

        epoch        = 1
        previousLoss = 9e9

        deltaLoss    = -1
        solvedM      = -1
        solvedB      = -1

        while (1):
            _, loss = sess.run ( [optimizer, lossFunc] )

            deltaLoss = abs (previousLoss - loss)
            solvedM   = sess.run (varSlope)
            solvedB   = sess.run (varInter)

            if epoch % 1000 == 0:
                print ('    -> epoch = ', epoch,  ' m = ', solvedM, ' b = ', solvedB, ' loss = ', loss, ' deltaLoss = ', deltaLoss)

            if (deltaLoss < LOSS_THRESHOLD):
                break

            previousLoss = loss
            epoch += 1

        print ('    Total number of epochs: ', epoch,  ' m = ', solvedM, ' b = ', solvedB, ' loss = ', loss, ' deltaLoss = ', deltaLoss)



