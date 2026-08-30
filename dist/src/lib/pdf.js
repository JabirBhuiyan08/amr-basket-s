import { Buffer } from "buffer";
function escapeText(text) {
    return String(text ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/\r\n/g, "\n")
        .replace(/\n/g, "\\n");
}
function pad10(num) {
    const s = String(num);
    return "0".repeat(Math.max(0, 10 - s.length)) + s;
}
export function generateInvoicePdf(data) {
    const pageW = 595; // A4 portrait width
    const pageH = 842; // A4 portrait height
    const margin = 50;
    const lineHeight = 20;
    let y = pageH - margin;
    const contentParts = [];
    function textLine(text, size = 11, left = margin) {
        contentParts.push("BT");
        contentParts.push(`/F1 ${size} Tf`);
        contentParts.push(`${left} ${y.toFixed(2)} Td`);
        contentParts.push(`(${escapeText(text)}) Tj`);
        contentParts.push("ET");
        y -= lineHeight;
        if (y < margin) {
            y = pageH - margin;
        }
    }
    textLine("INVOICE", 18);
    textLine(`Invoice #: ${data.invoiceNumber ?? "N/A"}`, 11);
    textLine(`Order #: ${data.orderNumber ?? "N/A"}`, 11);
    textLine(`Date: ${data.orderDate ?? new Date().toLocaleDateString()}`, 11);
    textLine(`Status: ${data.status ?? "PENDING"}`, 11);
    textLine("");
    textLine("Bill To:", 12);
    textLine(data.customerName ?? "Unknown", 11);
    if (data.customerAddress) {
        textLine(data.customerAddress, 11);
    }
    if (data.customerPhone) {
        textLine(`Phone: ${data.customerPhone}`, 11);
    }
    textLine("");
    textLine("Items:", 12);
    for (const item of data.items) {
        const line = `${item.productName}  x${item.quantity}  @${item.price}  = ${item.total}`;
        textLine(line, 10);
    }
    textLine("");
    textLine(`Subtotal: ${data.subtotal ?? "0.00"}`, 11);
    textLine(`Shipping: ${data.shippingCost ?? "0.00"}`, 11);
    textLine(`TOTAL: ${data.total ?? data.subtotal ?? "0.00"}`, 13);
    const contentStr = contentParts.join("\n");
    // Object layout:
    // 1 -> catalog
    // 2 -> pages
    // 3 -> page
    // 4 -> font (Helvetica)
    // 5 -> content stream
    const objects = [];
    const body = (num, content) => `${num} 0 obj\n${content}\nendobj\n`;
    objects.push(body(1, `<< /Type /Catalog /Pages 2 0 R >>`));
    objects.push(body(2, `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`));
    objects.push(body(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents 5 0 R /Resources << /Font << /F1 4 0 R >> >> >>`));
    objects.push(body(4, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`));
    objects.push(body(5, `<< /Length ${Buffer.byteLength(contentStr, "latin1")} >>\nstream\n${contentStr}\nendstream`));
    const header = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
    // Compute byte offsets for each object.
    const offsets = [];
    let size = Buffer.byteLength(header, "latin1");
    for (const obj of objects) {
        offsets.push(size);
        size += Buffer.byteLength(obj, "latin1");
    }
    const xrefOffset = size;
    let xref = `xref\n0 ${objects.length + 1}\n`;
    xref += "0000000000 65535 f\r\n";
    for (let i = 0; i < objects.length; i++) {
        const offset = offsets[i];
        xref += pad10(typeof offset === "number" ? offset : 0) + " 00000 n\r\n";
    }
    const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    const full = header +
        objects.join("") +
        xref +
        trailer;
    return Buffer.from(full, "latin1");
}
//# sourceMappingURL=pdf.js.map