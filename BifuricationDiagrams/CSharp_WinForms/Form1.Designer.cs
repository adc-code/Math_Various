namespace BifuricationDiagram_WinForms
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.panelControls = new System.Windows.Forms.Panel();
            this.textboxFgColour = new System.Windows.Forms.TextBox();
            this.textboxBgColour = new System.Windows.Forms.TextBox();
            this.btnFgColour = new System.Windows.Forms.Button();
            this.btnBgColour = new System.Windows.Forms.Button();
            this.label4 = new System.Windows.Forms.Label();
            this.progressBarCompute = new System.Windows.Forms.ProgressBar();
            this.numUpDnMuMax = new System.Windows.Forms.NumericUpDown();
            this.numUpDnMuMin = new System.Windows.Forms.NumericUpDown();
            this.label5 = new System.Windows.Forms.Label();
            this.comboMaxIter = new System.Windows.Forms.ComboBox();
            this.label3 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.btnCompute = new System.Windows.Forms.Button();
            this.panelCanvas = new System.Windows.Forms.Panel();
            this.colorDialog = new System.Windows.Forms.ColorDialog();
            this.panelControls.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.numUpDnMuMax)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.numUpDnMuMin)).BeginInit();
            this.SuspendLayout();
            // 
            // panelControls
            // 
            this.panelControls.BackColor = System.Drawing.Color.WhiteSmoke;
            this.panelControls.Controls.Add(this.textboxFgColour);
            this.panelControls.Controls.Add(this.textboxBgColour);
            this.panelControls.Controls.Add(this.btnFgColour);
            this.panelControls.Controls.Add(this.btnBgColour);
            this.panelControls.Controls.Add(this.label4);
            this.panelControls.Controls.Add(this.progressBarCompute);
            this.panelControls.Controls.Add(this.numUpDnMuMax);
            this.panelControls.Controls.Add(this.numUpDnMuMin);
            this.panelControls.Controls.Add(this.label5);
            this.panelControls.Controls.Add(this.comboMaxIter);
            this.panelControls.Controls.Add(this.label3);
            this.panelControls.Controls.Add(this.label2);
            this.panelControls.Controls.Add(this.label1);
            this.panelControls.Controls.Add(this.btnCompute);
            this.panelControls.Dock = System.Windows.Forms.DockStyle.Left;
            this.panelControls.Location = new System.Drawing.Point(0, 0);
            this.panelControls.Name = "panelControls";
            this.panelControls.Size = new System.Drawing.Size(199, 401);
            this.panelControls.TabIndex = 0;
            // 
            // textboxFgColour
            // 
            this.textboxFgColour.Location = new System.Drawing.Point(137, 218);
            this.textboxFgColour.Name = "textboxFgColour";
            this.textboxFgColour.ReadOnly = true;
            this.textboxFgColour.Size = new System.Drawing.Size(47, 20);
            this.textboxFgColour.TabIndex = 19;
            // 
            // textboxBgColour
            // 
            this.textboxBgColour.Location = new System.Drawing.Point(137, 188);
            this.textboxBgColour.Name = "textboxBgColour";
            this.textboxBgColour.ReadOnly = true;
            this.textboxBgColour.Size = new System.Drawing.Size(47, 20);
            this.textboxBgColour.TabIndex = 18;
            // 
            // btnFgColour
            // 
            this.btnFgColour.Location = new System.Drawing.Point(12, 216);
            this.btnFgColour.Name = "btnFgColour";
            this.btnFgColour.Size = new System.Drawing.Size(116, 23);
            this.btnFgColour.TabIndex = 17;
            this.btnFgColour.Text = "Foreground Colour";
            this.btnFgColour.UseVisualStyleBackColor = true;
            this.btnFgColour.Click += new System.EventHandler(this.btnFgColour_Click);
            // 
            // btnBgColour
            // 
            this.btnBgColour.Location = new System.Drawing.Point(12, 185);
            this.btnBgColour.Name = "btnBgColour";
            this.btnBgColour.Size = new System.Drawing.Size(114, 23);
            this.btnBgColour.TabIndex = 16;
            this.btnBgColour.Text = "Background Colour";
            this.btnBgColour.UseVisualStyleBackColor = true;
            this.btnBgColour.Click += new System.EventHandler(this.btnBgColour_Click);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(13, 350);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(51, 13);
            this.label4.TabIndex = 15;
            this.label4.Text = "Progress:";
            this.label4.Click += new System.EventHandler(this.label4_Click);
            // 
            // progressBarCompute
            // 
            this.progressBarCompute.Location = new System.Drawing.Point(12, 366);
            this.progressBarCompute.Name = "progressBarCompute";
            this.progressBarCompute.Size = new System.Drawing.Size(173, 23);
            this.progressBarCompute.TabIndex = 14;
            // 
            // numUpDnMuMax
            // 
            this.numUpDnMuMax.DecimalPlaces = 2;
            this.numUpDnMuMax.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.numUpDnMuMax.Location = new System.Drawing.Point(93, 81);
            this.numUpDnMuMax.Maximum = new decimal(new int[] {
            4,
            0,
            0,
            0});
            this.numUpDnMuMax.Name = "numUpDnMuMax";
            this.numUpDnMuMax.Size = new System.Drawing.Size(91, 20);
            this.numUpDnMuMax.TabIndex = 12;
            this.numUpDnMuMax.Value = new decimal(new int[] {
            4,
            0,
            0,
            0});
            this.numUpDnMuMax.ValueChanged += new System.EventHandler(this.numUpDnMuMax_ValueChanged);
            // 
            // numUpDnMuMin
            // 
            this.numUpDnMuMin.DecimalPlaces = 2;
            this.numUpDnMuMin.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.numUpDnMuMin.Location = new System.Drawing.Point(93, 55);
            this.numUpDnMuMin.Maximum = new decimal(new int[] {
            4,
            0,
            0,
            0});
            this.numUpDnMuMin.Name = "numUpDnMuMin";
            this.numUpDnMuMin.Size = new System.Drawing.Size(91, 20);
            this.numUpDnMuMin.TabIndex = 11;
            this.numUpDnMuMin.ValueChanged += new System.EventHandler(this.numUpDnMuMin_ValueChanged);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(13, 162);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(82, 13);
            this.label5.TabIndex = 10;
            this.label5.Text = "Colour Scheme:";
            // 
            // comboMaxIter
            // 
            this.comboMaxIter.FormattingEnabled = true;
            this.comboMaxIter.Items.AddRange(new object[] {
            "1000",
            "2000",
            "5000",
            "10000",
            "15000"});
            this.comboMaxIter.Location = new System.Drawing.Point(93, 112);
            this.comboMaxIter.Name = "comboMaxIter";
            this.comboMaxIter.Size = new System.Drawing.Size(91, 21);
            this.comboMaxIter.TabIndex = 5;
            this.comboMaxIter.SelectedIndexChanged += new System.EventHandler(this.comboMaxIter_SelectedIndexChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(13, 115);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(76, 13);
            this.label3.TabIndex = 3;
            this.label3.Text = "Max Iterations:";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(13, 83);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(42, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "μ Max: ";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(13, 57);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(39, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "μ Min: ";
            // 
            // btnCompute
            // 
            this.btnCompute.Location = new System.Drawing.Point(12, 12);
            this.btnCompute.Name = "btnCompute";
            this.btnCompute.Size = new System.Drawing.Size(173, 23);
            this.btnCompute.TabIndex = 0;
            this.btnCompute.Text = "Compute";
            this.btnCompute.UseVisualStyleBackColor = true;
            this.btnCompute.Click += new System.EventHandler(this.btnCompute_Click);
            // 
            // panelCanvas
            // 
            this.panelCanvas.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.panelCanvas.BackColor = System.Drawing.Color.Lavender;
            this.panelCanvas.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panelCanvas.Location = new System.Drawing.Point(199, 0);
            this.panelCanvas.Margin = new System.Windows.Forms.Padding(0);
            this.panelCanvas.Name = "panelCanvas";
            this.panelCanvas.Size = new System.Drawing.Size(516, 401);
            this.panelCanvas.TabIndex = 1;
            this.panelCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.panelCanvas_Paint);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(715, 401);
            this.Controls.Add(this.panelCanvas);
            this.Controls.Add(this.panelControls);
            this.Name = "Form1";
            this.ShowIcon = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Bifurication Diagram";
            this.panelControls.ResumeLayout(false);
            this.panelControls.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.numUpDnMuMax)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.numUpDnMuMin)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panelControls;
        private System.Windows.Forms.Panel panelCanvas;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button btnCompute;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.ComboBox comboMaxIter;
        private System.Windows.Forms.NumericUpDown numUpDnMuMax;
        private System.Windows.Forms.NumericUpDown numUpDnMuMin;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.ProgressBar progressBarCompute;
        private System.Windows.Forms.Button btnFgColour;
        private System.Windows.Forms.Button btnBgColour;
        private System.Windows.Forms.ColorDialog colorDialog;
        private System.Windows.Forms.TextBox textboxFgColour;
        private System.Windows.Forms.TextBox textboxBgColour;
    }
}

