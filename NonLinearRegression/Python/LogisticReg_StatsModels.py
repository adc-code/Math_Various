#
# LogisticReg_StatsModels.py
#
# Very basic logistic regression using statsmodels
#
# Usage: > python LogisticReg_StatsModels.py  <DataFile>  
#


import sys
import numpy as np
import statsmodels.api as sm


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


if __name__ == '__main__':

    if len (sys.argv) != 2:
        print ('Error: incorrect number of parameters!')
        print ()
        print ('Usage:', sys.argv[0], '  <DataFile>')
        sys.exit ()

    # load the data...
    X, y = loadData (sys.argv[1])

    # uncomment to add a constant to allow for a different x-intercept
    # X = sm.add_constant (X, prepend=True)

    # finally solve and report the results...
    logit = sm.Logit (y, X).fit()

    print (logit.summary())
    print (logit.predict (X))
    print (logit.predict (X) > 0.5)
    print (y)


