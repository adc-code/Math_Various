//
// BifuricationDiagram_Console
//
// Silly little program used to draw bifuration diagrams.  
//


using System;
using System.Drawing;
using System.Collections.Generic;


namespace BifuricationDiagram_Console
{
    class Program
    {
        static void Main(string[] args)
        {
            // Size of our output image 
            int nHeight = 1000;
            int nWidth  = 2000;

            // Values of mu that we are computing the diagram over
            double dMuMin = 2.9;
            double dMuMax = 4.0;
            double dMuStep = (dMuMax - dMuMin) / nWidth; 

            // Additional padding around diagram to give the image a 'border'
            int nPadding = 20;

            // Draw a box around the diagram...
            bool bDrawBox = true;

            // Draw vertical lines on the diagram...
            bool bDrawVertLines = true;
            List<double> listVertLines = new List<double>();
            listVertLines.Add(3);
            listVertLines.Add(3.2);
            listVertLines.Add(3.4);
            listVertLines.Add(3.6);
            listVertLines.Add(3.8);

            // Colours to be used... 
            int[] nLineColour = { 255, 51,    0 };
            int[] nBgColour   = { 225, 225, 208 };
            int[] nFgColour   = {   0,  51,   0 };
            int   nColourGrad = 100;
            
            // Finally the number of iterations to be used
            int nMinIter =   200;
            int nMaxIter = 10000;

            // Create the image and set the background colour
            var newImg = new Bitmap(nWidth, nHeight);
            using (Graphics graph = Graphics.FromImage(newImg))
            {
                Color customColor = Color.FromArgb(255, nBgColour[0], nBgColour[1], nBgColour[2]);
                SolidBrush bgColour = new SolidBrush(customColor);

                Rectangle ImageSize = new Rectangle(0, 0, nWidth, nHeight);
                graph.FillRectangle(bgColour, ImageSize);
            }

            // Draw any annotation first so it will be on the bottom of the image
            if (bDrawBox)
            {
                // Draw a box around the diagram.  First draw some horizontal lines
                for (int i = 0; i < nWidth - (2*nPadding); i++)
                {
                    newImg.SetPixel(i + nPadding, nPadding,
                                     Color.FromArgb(nLineColour[0], nLineColour[1], nLineColour[2]));
                    newImg.SetPixel(i + nPadding, nHeight - nPadding,
                                     Color.FromArgb(nLineColour[0], nLineColour[1], nLineColour[2]));
                }

                // ...and some vertical lines
                for (int i = 0; i < nHeight - (2 * nPadding); i++)
                {
                    newImg.SetPixel(nPadding, i + nPadding,
                                     Color.FromArgb(nLineColour[0], nLineColour[1], nLineColour[2]));
                    newImg.SetPixel(nWidth - nPadding, i + nPadding,
                                     Color.FromArgb(nLineColour[0], nLineColour[1], nLineColour[2]));
                } 
            }

            // Also draw the vertical lines
            if (bDrawVertLines)
            {
                foreach (double nVertLineLoc in listVertLines)
                {
                    int xloc = (int)((nVertLineLoc - dMuMin) / (dMuMax - dMuMin) * nWidth) + nPadding;
                    for (int i = 0; i < nHeight - (2 * nPadding); i++)
                    {
                        newImg.SetPixel(xloc, i + nPadding,
                                         Color.FromArgb(nLineColour[0], nLineColour[1], nLineColour[2]));
                    }
                }
            }

            // Finally... compute the diagram!
            int nMuPrevPercentage = 0;
            for (double mu = dMuMin; mu <= dMuMax; mu += dMuStep)
            {
                int nMuPercentage = (int) ( 100 * (mu - dMuMin) / (dMuMax - dMuMin) );
                if (nMuPercentage % 20 == 0 && nMuPercentage != nMuPrevPercentage)
                {
                    Console.Write("  Completed:  " + nMuPercentage.ToString() + "%\n");
                    nMuPrevPercentage = nMuPercentage;
                }

                // start x at the maximum value
                double x = 0.5;

                for (int i = 0; i < nMaxIter; i++)
                {
                    x = mu * x * (1 - x);

                    if (i > nMinIter)
                    {
                        // Compute the positions and...
                        int xLoc = (int)((mu - dMuMin) / (dMuMax - dMuMin) * (nWidth - 2*nPadding - 1)) + nPadding;
                        int yLoc = (int)((1 - x) * (nHeight - 2 * nPadding - 1)) + nPadding;

                        // ...update the colours
                        Color pixelColour = newImg.GetPixel(xLoc, yLoc);
                        var pixelR = pixelColour.R - (int)( (nBgColour[0] - nFgColour[0]) / nColourGrad );
                        if (pixelR < nFgColour[0])
                            pixelR = nFgColour[0];

                        var pixelG = pixelColour.G - (int)( (nBgColour[1] - nFgColour[1]) / nColourGrad );
                        if (pixelG < nFgColour[1])
                            pixelG = nFgColour[1];

                        var pixelB = pixelColour.B - (int)( (nBgColour[2] - nFgColour[2]) / nColourGrad );
                        if (pixelB < nFgColour[2])
                            pixelB = nFgColour[2];

                        newImg.SetPixel(xLoc, yLoc, Color.FromArgb(pixelR, pixelG, pixelB));
                    }
                }
            }

            // Finally, write the image to the file...
            newImg.Save ("BifuricationDiagram.jpg");

            Console.Write("  Completed: 100%\n");
        }
    }
}

