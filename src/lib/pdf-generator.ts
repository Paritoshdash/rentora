import jsPDF from 'jspdf'

export function generateReceipt(payment: any) {
  const doc = new jsPDF()

  // Header
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('RENTORA', 20, 22)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Smart Property Management', 20, 30)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('RENT RECEIPT', 150, 22)

  // Receipt number
  doc.setTextColor(100, 116, 139)
  doc.setFontSize(9)
  doc.text(`Receipt #RNT-${payment.id.padStart(4, '0')}`, 150, 30)

  // Reset color
  doc.setTextColor(15, 23, 42)

  // Status badge
  doc.setFillColor(209, 250, 229)
  doc.roundedRect(150, 45, 45, 10, 3, 3, 'F')
  doc.setTextColor(5, 150, 105)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('PAID', 172, 52, { align: 'center' })

  // Tenant Info
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Tenant Details', 20, 65)

  doc.setDrawColor(226, 232, 240)
  doc.line(20, 68, 190, 68)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)

  const tenantDetails = [
    ['Tenant Name', payment.tenant_name],
    ['Property', payment.property_name],
    ['Unit', payment.unit],
    ['Month', payment.month],
  ]

  tenantDetails.forEach(([label, value], i) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.text(label + ':', 20, 78 + i * 10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text(value, 80, 78 + i * 10)
  })

  // Payment Info
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Payment Details', 20, 130)
  doc.line(20, 133, 190, 133)

  const paymentDetails = [
    ['Rent Amount', `Rs. ${payment.amount.toLocaleString('en-IN')}`],
    ['Late Fee', `Rs. ${payment.late_fee || 0}`],
    ['Payment Method', payment.payment_method || 'N/A'],
    ['Payment Date', payment.paid_date || 'N/A'],
    ['Due Date', payment.due_date],
  ]

  paymentDetails.forEach(([label, value], i) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.text(label + ':', 20, 143 + i * 10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text(value, 80, 143 + i * 10)
  })

  // Total Box
  doc.setFillColor(239, 246, 255)
  doc.roundedRect(20, 200, 170, 25, 4, 4, 'F')
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text('Total Amount Paid:', 30, 215)
  doc.setFontSize(16)
  doc.text(`Rs. ${(payment.amount + (payment.late_fee || 0)).toLocaleString('en-IN')}`, 140, 215)

  // Footer
  doc.setFillColor(248, 250, 252)
  doc.rect(0, 265, 210, 32, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('This is a computer-generated receipt and does not require a physical signature.', 105, 275, { align: 'center' })
  doc.text('For queries, contact: support@rentora.in | www.rentora.in', 105, 283, { align: 'center' })
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 105, 291, { align: 'center' })

  doc.save(`Rent_Receipt_${payment.tenant_name.replace(' ', '_')}_${payment.month.replace(' ', '_')}.pdf`)
}

export function generateMonthlyReport(payments: any[], month: string) {
  const doc = new jsPDF()

  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, 210, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('RENTORA', 20, 18)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Monthly Income Report', 20, 27)
  doc.setFontSize(12)
  doc.text(month, 160, 22)

  doc.setTextColor(15, 23, 42)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Summary', 20, 50)

  let y = 60
  payments.forEach((p, i) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(71, 85, 105)
    doc.text(`${i + 1}. ${p.tenant_name}`, 20, y)
    doc.text(p.property_name, 80, y)
    doc.text(`Rs. ${p.amount.toLocaleString('en-IN')}`, 150, y)
    doc.text(p.status.toUpperCase(), 180, y)
    y += 8
  })

  const total = payments.reduce((s, p) => s + (p.status === 'paid' ? p.amount : 0), 0)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(37, 99, 235)
  doc.text(`Total Collected: Rs. ${total.toLocaleString('en-IN')}`, 20, y + 10)

  doc.save(`Monthly_Report_${month.replace(' ', '_')}.pdf`)
}
