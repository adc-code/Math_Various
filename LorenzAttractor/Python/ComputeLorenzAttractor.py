#
# ComputeLorenzAttractor.py
#
# Small script used to compute and draw the Lorenz attractor in 3D
#


from mpl_toolkits import mplot3d

import numpy as np
import matplotlib.pyplot as plt

from scipy.integrate import odeint


#
# Lorenz: computes the state of the function at a certain state
#
def Lorenz (currentValues, t):

    x = currentValues[0]
    y = currentValues[1]
    z = currentValues[2]
    
    dxDt = sigma * (y - x)
    dyDt = x * (rho - z) - y
    dzDt = x * y - beta * z
    
    return [dxDt, dyDt, dzDt]


#
# Define some initial and default values
#
sigma = 10
beta  = 8/3
rho   = 28

initialValues = [1, 0, 0]

timeStart = 0
timeEnd   = 25
timeDelta = 0.01

timePoints = np.arange (timeStart, timeEnd, timeDelta)


#
# numerically integrate to compute the Lorenz attractor 
#
results = odeint (Lorenz, initialValues, timePoints)

# extract the individual arrays of x, y, and z values from the array of arrays
x = results [:, 0]
y = results [:, 1]
z = results [:, 2]


#
# Finally draw it to the screen
#

plt.figure(figsize=(12, 9))

ax = plt.axes (projection='3d')
ax.plot3D (x, y, z, 'blue')

plt.show()



