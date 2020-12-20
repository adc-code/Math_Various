#
# LinearRegression_SolveFormula.py
#
# Calculates simple linear regression; slope and intercept of line of best with along with R^2
#
# Usage: > python LinearRegression_SolveFormula.py <InputFile>
#


import sys


#
# findSlopeAndIntercept: manually compute the linear regression
#
def findSlopeAndIntercept (xValues, yValues):

    n = len (xValues)

    sum_x  = 0
    sum_y  = 0
    sum_xx = 0
    sum_xy = 0

    for i in range (n):
        sum_xy += xValues[i] * yValues[i]
        sum_x  += xValues[i]
        sum_y  += yValues[i]
        sum_xx += xValues[i] ** 2

        #print (i, sum_xy, sum_x, sum_y, sum_xx)

    slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x ** 2)
    intercept  = sum_y / n - slope * sum_x / n

    return (slope, intercept)


#
# findRSquared
#
def findRSquared (xValues, yValues, slope, intercept):

    MeanY = 0;
    for y in yValues:
        MeanY += y

    MeanY /= len (yValues)

    sum_res = 0;
    sum_tot = 0;
    for i in range (len (yValues)):
        sum_res += (yValues[i] - func (xValues[i], slope, intercept)) ** 2
        sum_tot += (yValues[i] - MeanY) ** 2

    RSquared = 1 - sum_res / sum_tot

    return RSquared


#
# linear function
# 
def func (x, slope, intercept):
    return slope*x + intercept


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


    # Compute slope and intercept
    slope, intercept = findSlopeAndIntercept (xValues, yValues)
    RSquared = findRSquared (xValues, yValues, slope, intercept)

    print ('Slope: ', slope, ' Intercept: ', intercept, ' RSquared: ', RSquared)



