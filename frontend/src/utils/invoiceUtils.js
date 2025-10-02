// Download invoice as PDF
export const downloadInvoiceAsPDF = (payment) => {
    // Create a new window with the invoice content
    const printWindow = window.open('', '_blank');
    
    const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice ${payment.invoiceId}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    line-height: 1.6;
                }
                .invoice-header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 20px;
                }
                .company-name {
                    font-size: 28px;
                    font-weight: bold;
                    color: #1976d2;
                    margin: 0;
                }
                .company-subtitle {
                    color: #666;
                    margin: 5px 0;
                }
                .invoice-details {
                    display: flex;
                    justify-content: space-between;
                    margin: 30px 0;
                }
                .customer-info, .invoice-info {
                    width: 45%;
                }
                .section-title {
                    font-weight: bold;
                    color: #1976d2;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                .info-line {
                    margin: 5px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #f5f5f5;
                    font-weight: bold;
                }
                .text-right {
                    text-align: right;
                }
                .total-section {
                    margin-top: 30px;
                    float: right;
                    width: 300px;
                }
                .total-line {
                    display: flex;
                    justify-content: space-between;
                    margin: 8px 0;
                    padding: 8px 0;
                }
                .total-line.final {
                    border-top: 2px solid #333;
                    font-weight: bold;
                    font-size: 18px;
                }
                .footer {
                    text-align: center;
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    color: #666;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <h1 class="company-name">MOTO-CARE</h1>
                <p class="company-subtitle">Vehicle Service Center</p>
                <p class="company-subtitle">Professional Auto Care Services</p>
            </div>

            <div class="invoice-details">
                <div class="invoice-info">
                    <div class="section-title">INVOICE</div>
                    <div class="info-line"><strong>Invoice ID:</strong> ${payment.invoiceId}</div>
                    <div class="info-line"><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleDateString()}</div>
                    <div class="info-line"><strong>Job ID:</strong> ${payment.job?.jobId || 'N/A'}</div>
                    <div class="info-line"><strong>Status:</strong> ${payment.paymentStatus}</div>
                </div>
                <div class="customer-info">
                    <div class="section-title">CUSTOMER INFORMATION</div>
                    <div class="info-line"><strong>Name:</strong> ${payment.customer?.name || 'N/A'}</div>
                    <div class="info-line"><strong>Email:</strong> ${payment.customer?.email || 'N/A'}</div>
                    <div class="info-line"><strong>Phone:</strong> ${payment.customer?.phone || 'N/A'}</div>
                    <br>
                    <div class="section-title">VEHICLE INFORMATION</div>
                    <div class="info-line"><strong>Vehicle No:</strong> ${payment.vehicle?.vehicleNumber || 'N/A'}</div>
                    <div class="info-line"><strong>Make/Model:</strong> ${payment.vehicle?.brand} ${payment.vehicle?.model}</div>
                    <div class="info-line"><strong>Year:</strong> ${payment.vehicle?.year || 'N/A'}</div>
                </div>
            </div>

            <div class="section-title">SERVICE DETAILS</div>
            <table>
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Description</th>
                        <th class="text-right">Amount (LKR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${payment.service?.name || 'Service'}</td>
                        <td>${payment.service?.description || 'Standard service'}</td>
                        <td class="text-right">${payment.serviceAmount?.toLocaleString() || '0'}</td>
                    </tr>
                </tbody>
            </table>

            ${payment.extraItems && payment.extraItems.length > 0 ? `
            <div class="section-title">ADDITIONAL PARTS & ITEMS</div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th class="text-right">Qty</th>
                        <th class="text-right">Unit Price (LKR)</th>
                        <th class="text-right">Total (LKR)</th>
                    </tr>
                </thead>
                <tbody>
                    ${payment.extraItems.map(item => `
                        <tr>
                            <td>${item.itemName}</td>
                            <td class="text-right">${item.quantity}</td>
                            <td class="text-right">${item.unitPrice?.toLocaleString() || '0'}</td>
                            <td class="text-right">${item.totalPrice?.toLocaleString() || '0'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : ''}

            <div class="total-section">
                <div class="total-line">
                    <span>Subtotal:</span>
                    <span>LKR ${payment.subtotal?.toLocaleString() || '0'}</span>
                </div>
                ${payment.discount > 0 ? `
                <div class="total-line">
                    <span>Discount:</span>
                    <span style="color: red;">-LKR ${payment.discount?.toLocaleString() || '0'}</span>
                </div>
                ` : ''}
                <div class="total-line final">
                    <span>Total Amount:</span>
                    <span>LKR ${payment.totalAmount?.toLocaleString() || '0'}</span>
                </div>
                <div class="total-line">
                    <span>Payment Method:</span>
                    <span>${payment.paymentMethod || 'Cash'}</span>
                </div>
            </div>

            <div style="clear: both;"></div>

            <div class="footer">
                <p>Thank you for choosing Moto-Care Service Center</p>
                <p style="font-size: 12px;">Processed by: ${payment.cashier?.name || 'Cashier'} | ${new Date(payment.createdAt).toLocaleString()}</p>
                ${payment.notes ? `<p><strong>Notes:</strong> ${payment.notes}</p>` : ''}
            </div>

            <button class="no-print" onclick="window.print()" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #1976d2;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
            ">Print Invoice</button>
        </body>
        </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Auto-print after a short delay
    setTimeout(() => {
        printWindow.print();
    }, 500);
};

export default downloadInvoiceAsPDF;