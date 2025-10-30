import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

/**
 * Generate a certificate PDF
 * @param {object} certificateData - Certificate data
 * @returns {Promise<Blob>} PDF blob
 */
export const generateCertificatePDF = async (certificateData) => {
  try {
    const {
      studentName,
      course,
      institution,
      duration,
      grade,
      credentialType,
      issueDate,
      hash,
      institutionLogo
    } = certificateData;

    // Create PDF document (A4 size, portrait)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const centerX = pageWidth / 2;

    // Draw border
    doc.setDrawColor(25, 118, 210); // #1976d2
    doc.setLineWidth(2);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    let yPos = margin + 20;

    // Add institution logo if available
    if (institutionLogo) {
      try {
        // Load logo as base64 or use URL directly
        // For simplicity, we'll skip the logo for now as it requires CORS handling
        // In production, you'd load and convert the image properly
      } catch (error) {
        console.warn('Could not load institution logo:', error);
      }
    }

    // Institution name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(institution, centerX, yPos, { align: 'center' });
    yPos += 10;

    // Institution website would go here
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(102, 102, 102); // #666666
    // doc.text(institutionWebsite, centerX, yPos, { align: 'center' });
    yPos += 20;

    // Certificate title
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('ACADEMIC CERTIFICATE', centerX, yPos, { align: 'center' });
    yPos += 5;

    // Decorative line
    doc.setDrawColor(25, 118, 210);
    doc.setLineWidth(0.5);
    doc.line(centerX - 40, yPos, centerX + 40, yPos);
    yPos += 25;

    // Certificate body
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', centerX, yPos, { align: 'center' });
    yPos += 12;

    // Student name
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(studentName.toUpperCase(), centerX, yPos, { align: 'center' });
    yPos += 12;

    // Completion text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed', centerX, yPos, { align: 'center' });
    yPos += 12;

    // Course name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(course, centerX, yPos, { align: 'center', maxWidth: pageWidth - 2 * margin - 20 });
    yPos += 15;

    // Duration
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Duration: ${duration}`, centerX, yPos, { align: 'center' });
    yPos += 8;

    // Grade
    doc.text(`Grade: ${grade}`, centerX, yPos, { align: 'center' });
    yPos += 8;

    // Credential type
    doc.text(`Credential Type: ${credentialType}`, centerX, yPos, { align: 'center' });
    yPos += 25;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(hash, {
      width: 240,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Footer section with date and QR code
    const footerY = pageHeight - margin - 40;

    // Issue date (left-aligned)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const formattedDate = new Date(issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    doc.text(`Issued on: ${formattedDate}`, margin + 5, footerY);

    // QR code (right-aligned)
    const qrSize = 30;
    const qrX = pageWidth - margin - qrSize - 5;
    const qrY = footerY - 25;
    doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    // Text below QR code
    doc.setFontSize(10);
    doc.text('Scan to verify', qrX + qrSize / 2, qrY + qrSize + 5, { align: 'center' });

    // Certificate hash at bottom
    doc.setFontSize(8);
    doc.setFont('courier', 'normal');
    doc.setTextColor(102, 102, 102);
    const hashText = `Certificate Hash: ${hash.substring(0, 20)}...${hash.substring(hash.length - 20)}`;
    doc.text(hashText, centerX, pageHeight - margin - 5, { align: 'center' });

    // Convert to blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

/**
 * Download PDF to user's computer
 * @param {Blob} pdfBlob - PDF blob
 * @param {string} filename - Filename for download
 */
export const downloadPDF = (pdfBlob, filename) => {
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate QR code as data URL
 * @param {string} text - Text to encode in QR code
 * @returns {Promise<string>} QR code data URL
 */
export const generateQRCode = async (text) => {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};
