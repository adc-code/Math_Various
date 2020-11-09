using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;


namespace BifuricationDiagram_WinForms
{
    public partial class Form1 : Form
    {
        double _dMuMin = 0.0;
        double _dMuMax = 4.0;

        int[] _nBgColour = { 225, 225, 208 };
        int[] _nFgColour = { 0, 51, 0 };
        Color _BgColour = new Color();
        Color _FgColour = new Color();
        int   _nColourGrad = 8;

        // Finally the number of iterations to be used
        int _nMinIter =   200;
        int _nMaxIter =  1000;

        Bitmap  _BitmapBuffer;


        public Form1()
        {
            InitializeComponent();

            comboMaxIter.SelectedIndex = 0;

            _BgColour = Color.FromArgb (225, 225, 208);
            _FgColour = Color.FromArgb (0, 51, 0);

            textboxBgColour.BackColor = _BgColour;
            textboxFgColour.BackColor = _FgColour;

            ComputeBifuricationDiagram();
            DrawDiagram();
        }

        private void comboMaxIter_SelectedIndexChanged(object sender, EventArgs e)
        {
            // Combo box for the number of iterations
            _nMaxIter = Int32.Parse(comboMaxIter.SelectedItem.ToString());
            _nColourGrad = (int) (_nMaxIter / 150);
        }

        private void ComputeBifuricationDiagram()
        {
            // Get the size of the panel that we are drawing into
            int nWidth = panelCanvas.Width;
            int nHeight = panelCanvas.Height;

            // get rid of the old bitmap buffer
            if (_BitmapBuffer != null)
                _BitmapBuffer.Dispose();

            // create a new bitmap buffer object and then set it to the background colour
            _BitmapBuffer = new Bitmap (nWidth, nHeight);
            using (Graphics graph = Graphics.FromImage(_BitmapBuffer))
            {
                SolidBrush brush = new SolidBrush(_BgColour);
                Rectangle ImageSize = new Rectangle(0, 0, nWidth, nHeight);
                graph.FillRectangle(brush, ImageSize);
            }

            // Init the progress bar
            progressBarCompute.Value = 0;
            progressBarCompute.Maximum = nWidth;

            for (int i = 0; i < nWidth; i++)
            {
                // compute the value of me from i and the width
                double dMu = i * (_dMuMax - _dMuMin) / (nWidth - 1) + _dMuMin;

                double x = 0.5;

                for (int j = 0; j < _nMaxIter; j++)
                {
                    x = dMu * x * (1 - x);

                    if (j > _nMinIter)
                    {
                        int yLoc = (int)((1 - x) * (nHeight - 1));

                        // ...update the colours
                        Color pixelColour = _BitmapBuffer.GetPixel(i, yLoc);
                        var pixelR = pixelColour.R - (int)((_BgColour.R - _FgColour.R) / _nColourGrad);
                        if (pixelR < _FgColour.R)
                            pixelR = _FgColour.R;
                        else if (pixelR > 255)
                            pixelR = 255;

                        var pixelG = pixelColour.G - (int)((_BgColour.G - _FgColour.G) / _nColourGrad);
                        if (pixelG < _FgColour.G)
                            pixelG = _FgColour.G;
                        else if (pixelG > 255)
                            pixelG = 255;

                        var pixelB = pixelColour.B - (int)((_BgColour.B - _FgColour.B) / _nColourGrad);
                        if (pixelB < _FgColour.B)
                            pixelB = _FgColour.B;
                        else if (pixelB > 255)
                            pixelB = 255;

                        _BitmapBuffer.SetPixel(i, yLoc, Color.FromArgb(pixelR, pixelG, pixelB));
                    }
                }

                progressBarCompute.Increment(1);
            }
        }


        private void DrawDiagram ()
        {
            Graphics gfxObj = panelCanvas.CreateGraphics();
            gfxObj.DrawImage(_BitmapBuffer, new Point(0, 0));
            gfxObj.Dispose();
        }


        private void btnCompute_Click (object sender, EventArgs e)
        {
            // Get all the numerical values 

            // Get the values...
            _dMuMin = (double) (numUpDnMuMin.Value);
            _dMuMax = (double) (numUpDnMuMax.Value);

            ComputeBifuricationDiagram();
            DrawDiagram();

            // Force paint event to fire...
            panelCanvas.Refresh();
        }

        private void panelCanvas_Paint(object sender, PaintEventArgs e)
        {
            DrawDiagram();
        }

        private void numUpDnMuMin_ValueChanged(object sender, EventArgs e)
        {
            var dMuMin = numUpDnMuMin.Value;
            var dMuMax = numUpDnMuMax.Value;

            if (dMuMin >= dMuMax)
            {
                // Error
                numUpDnMuMin.Value = dMuMax - numUpDnMuMin.Increment;
            }
        }

        private void numUpDnMuMax_ValueChanged(object sender, EventArgs e)
        {
            var dMuMin = numUpDnMuMin.Value;
            var dMuMax = numUpDnMuMax.Value;

            if (dMuMax <= dMuMin)
            {
                // Error
                numUpDnMuMax.Value = dMuMin + numUpDnMuMax.Increment;
            }
        }

        private void label4_Click(object sender, EventArgs e)
        {
        }

        private void btnBgColour_Click(object sender, EventArgs e)
        {
            if (colorDialog.ShowDialog() != System.Windows.Forms.DialogResult.Cancel)
            {
                textboxBgColour.BackColor = colorDialog.Color;
                _BgColour = colorDialog.Color;
            }
        }

        private void btnFgColour_Click(object sender, EventArgs e)
        {
            if (colorDialog.ShowDialog() != System.Windows.Forms.DialogResult.Cancel)
            {
                textboxFgColour.BackColor = colorDialog.Color;
                _FgColour = colorDialog.Color;
            }
        }

    }
}
