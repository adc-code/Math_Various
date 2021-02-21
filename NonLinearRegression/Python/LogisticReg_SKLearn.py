#
# LogisticReg_SKLearn.py
#
# Very basic logistic regression using SciKit Learn 
#
# Usage: > python LogisticReg_SKLearn.py  <DataFile>  
#


import sys
import numpy as np
from sklearn.linear_model import LogisticRegression


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

    return ( np.array(xValues).reshape(-1,1), np.array(yValues) )


if __name__ == '__main__':

    if len (sys.argv) != 2:
        print ('Error: incorrect number of parameters!')
        print ()
        print ('Usage:', sys.argv[0], '  <DataFile>')
        sys.exit ()


    X, y = loadData (sys.argv[1])
 
    logReg = LogisticRegression (random_state=0, solver='lbfgs')
    logReg.fit (X, y)

    print (f'Coefs: {logReg.coef_}')
    print (f'Intercept: {logReg.intercept_}')

    print (f'Actual  Results: {y}')
    print (f'Predict Results: {logReg.predict (X)}')

    print (f'Model Score: {logReg.score (X, y)}')


