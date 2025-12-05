const PDFDocument = require("pdfkit");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");

/**
 * Creates a PDF document with letterhead template as background
 * @param {Object} options - PDF creation options
 * @param {string} options.title - Document title (not used when using template background)
 * @param {string} options.filename - Output filename
 * @param {Response} options.res - Express response object
 * @param {boolean} options.useTemplateBackground - Whether to use PNG as full background
 * @returns {PDFDocument} - Configured PDF document
 */
const createPDFWithLetterhead = (options) => {
    const { filename, res, useTemplateBackground = false } = options;

    // Create PDF document - use A4 size for better compatibility
    const docOptions = useTemplateBackground 
        ? { 
            margin: 0,
            size: 'A4'  // Standard A4 size for better compatibility
          }
        : { margin: 50 };
    
    const doc = new PDFDocument(docOptions);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe to response
    doc.pipe(res);

    // Add letterhead template if exists and using template background
    if (useTemplateBackground) {
        const letterheadPngPath = path.join(__dirname, '../assets/pdftemp.png');
        
        console.log('Looking for PNG template at:', letterheadPngPath);
        console.log('PNG template exists:', fs.existsSync(letterheadPngPath));
        
        if (fs.existsSync(letterheadPngPath)) {
            console.log('Adding PNG template background...');
            console.log('Page dimensions:', doc.page.width, 'x', doc.page.height);
            
            try {
                // Add PNG template as background
                doc.image(letterheadPngPath, 0, 0, {
                    width: doc.page.width,
                    height: doc.page.height
                });
                console.log('PNG template added successfully as background');
            } catch (error) {
                console.error('Error adding PNG template:', error.message);
                console.log('Continuing without template...');
            }
        } else {
            console.log('WARNING: PNG template file not found. Please convert your PDF template to PNG format.');
            console.log('You can convert pdftemp.pdf to pdftemp.png using online converters or Preview app.');
        }
        
        // Set position for content overlay - closer to header
        doc.x = 50;
        doc.y = 160; // Reduced from 200 to 160 to minimize gap with logo
        console.log('Position set to (50, 160) for content overlay');
    }

    // Add title and timestamp only if not using template background
    if (!useTemplateBackground) {
        doc.fontSize(20).fillColor('#3498db').text(options.title || 'Document', { align: 'center' });
        doc.fontSize(12).fillColor('#555').text(`Generated: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, { align: 'center' });
        doc.moveDown(1);
    }

    return doc;
};

/**
 * Adds a footer to the PDF document
 * @param {PDFDocument} doc - PDF document instance
 * @param {string} footerText - Footer text to display
 */
const addPDFFooter = (doc, footerText = 'This is an official document. Please retain this for your records.') => {
    doc.fontSize(8).fillColor('#888').text(footerText, 50, doc.page.height - 50, {
        align: 'center',
        width: doc.page.width - 100
    });
};

/**
 * Finalizes and closes the PDF document
 * @param {PDFDocument} doc - PDF document instance
 */
const finalizePDF = (doc) => {
    doc.end();
};

module.exports = {
    createPDFWithLetterhead,
    addPDFFooter,
    finalizePDF
};
