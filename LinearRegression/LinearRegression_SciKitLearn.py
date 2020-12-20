#
# LinearRegression_SciKitLearn.py
#
# Calculates simple linear regression; slope and intercept of line of best with along with R^2
#
# Usage: > python LinearRegression_SciKitLearn.py <InputFile>
#


from sklearn import linear_model
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import sys


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

    xValues = np.array (xValues).reshape(-1, 1) 
    yValues = np.array (yValues).reshape(-1, 1) 

    # Create linear regression object
    linReg = linear_model.LinearRegression ()

    # 'Train' the model using the training sets
    linReg.fit (xValues, yValues)

    # Predicted y-values
    yPred = linReg.predict (xValues)

    # The coefficients
    print ('Slope: ', linReg.coef_, ' Intercept: ', linReg.intercept_, 'RSquared: ', linReg.score (xValues, yValues))

    # The mean squared error
    print('Mean squared error: ', mean_squared_error(yValues, yPred))

    # The coefficient of determination
    print('Coefficient of determination: ', r2_score(yValues, yPred))



