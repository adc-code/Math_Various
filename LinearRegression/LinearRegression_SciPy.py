#
# LinearRegression_SciPy.py
#
# Calculates simple linear regression; slope and intercept of line of best with along with R^2
#
# Usage: > python LinearRegression_SciPy.py <InputFile>
#


from scipy import stats
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


    # Compute the linear regression...
    slope, intercept, r_value, p_value, std_err = stats.linregress (xValues, yValues)

    print ('Slope: ', slope, ' Intercept: ', intercept, ' RSquared: ', r_value**2)



