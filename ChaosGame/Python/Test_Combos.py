import os

#
# Used to try out a lot of combinations and to see what values make more 'sense'
#


ProgramName = 'python ChaosGame_Extra.py '

ImageSize  = 1500
BaseName   = 'Output/Test_'
FileSuffix = '.jpg'
Angle      = 90
Iterations = 100000

Corners    = [ 3, 4, 5, 6, 7, 8, 9, 10 ]
Rules      = [ 1, 2, 3, 4, 5, 6, 7, 8 ]
Multiplier = [ 0.30, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.57, 0.60 ]

for c in Corners:
    for r in Rules:
        for m in Multiplier:
            tmp = str(m).split('.')
            tmp = ''.join(tmp)

            FileName = BaseName + str(c) + '_' + str(r) + '_' + tmp + FileSuffix
            Cmd = ProgramName + ' ' + str(c) + ' ' + str(Iterations) + ' ' + str(m) + ' ' \
                       + str(r) + ' ' + str(Angle) + ' ' + str(ImageSize) + ' ' + FileName

            print ('Running... ', Cmd)
            os.system (Cmd)
            print ('\n\n')

            



