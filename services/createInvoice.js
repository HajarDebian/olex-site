const fs = require("fs");
const PDFDocument = require("pdfkit");
const path =require("path");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("logo.png",50, 45, { width: 50 })
    .fillColor("orange")
    .fontSize(10)
    .fillColor("black")
    .text("Olex CO.", 472, 50, { align: "left" })
    .text("Easier shopping", 440, 65, { align: "right" })
    .text("Giza,Egypt, 000", 450, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Today's Products", 50, 160);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 200;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Id",
    "Title",
    "Description",
    "Price",
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item._id,
      item.productTitle,
      item.productDesc,
      item.productPrice

    );

    generateHr(doc, position + 20);
  }

//   const subtotalPosition = invoiceTableTop + (i + 1) * 30;
//   generateTableRow(
//     doc,
//     subtotalPosition,
//     "",
//     "",
//     "Subtotal",
//     "",
//     formatCurrency(invoice.subtotal)
//   );

//   const paidToDatePosition = subtotalPosition + 20;
//   generateTableRow(
//     doc,
//     paidToDatePosition,
//     "",
//     "",
//     "Paid To Date",
//     "",
//     formatCurrency(invoice.paid)
//   );

//   const duePosition = paidToDatePosition + 25;
//   doc.font("Helvetica-Bold");
//   generateTableRow(
//     doc,
//     duePosition,
//     "",
//     "",
//     "Balance Due",
//     "",
//     formatCurrency(invoice.subtotal - invoice.paid)
//   );
//   doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};