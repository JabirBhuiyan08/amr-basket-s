import { Buffer } from "buffer";
import { readFileSync } from "fs";
import { resolve } from "path";
import { deflateSync, inflateSync } from "zlib";

/**
 * Minimal, dependency-free PDF invoice generator.
 * Produces a valid (PDF 1.4) document containing the invoice/order details.
 */

export interface InvoicePdfItem {
    productName: string;
    quantity: number;
    price: string;
    total: string;
}

export interface InvoicePdfData {
    invoiceNumber: string;
    orderNumber?: string;
    orderDate?: string;
    status?: string;
    customerName?: string;
    customerAddress?: string;
    customerPhone?: string;
    items: InvoicePdfItem[];
    subtotal?: string;
    shippingCost?: string;
    tax?: string;
    total?: string;
}

function escapeText(text: unknown): string {
    return String(text ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/\r\n/g, "\n")
        .replace(/\n/g, "\\n");
}

function pad10(num: number): string {
    const s = String(num);
    return "0".repeat(Math.max(0, 10 - s.length)) + s;
}

function paethPredictor(left: number, above: number, upperLeft: number): number {
    const estimate = left + above - upperLeft;
    const leftDistance = Math.abs(estimate - left);
    const aboveDistance = Math.abs(estimate - above);
    const upperLeftDistance = Math.abs(estimate - upperLeft);

    if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
    return aboveDistance <= upperLeftDistance ? above : upperLeft;
}

function decodeLogoPng(png: Buffer) {
    if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        throw new Error("Invoice logo is not a PNG image");
    }

    let width = 0;
    let height = 0;
    let bitDepth = 0;
    let colorType = 0;
    let interlace = 0;
    const imageData: Buffer[] = [];

    for (let offset = 8; offset < png.length;) {
        const length = png.readUInt32BE(offset);
        const type = png.toString("ascii", offset + 4, offset + 8);
        const chunk = png.subarray(offset + 8, offset + 8 + length);
        if (type === "IHDR") {
            width = chunk.readUInt32BE(0);
            height = chunk.readUInt32BE(4);
            bitDepth = chunk[8];
            colorType = chunk[9];
            interlace = chunk[12];
        } else if (type === "IDAT") {
            imageData.push(chunk);
        } else if (type === "IEND") {
            break;
        }
        offset += length + 12;
    }

    if (!width || !height || bitDepth !== 8 || colorType !== 6 || interlace !== 0) {
        throw new Error("Invoice logo must be a non-interlaced 8-bit RGBA PNG");
    }

    const rowLength = width * 4;
    const filtered = inflateSync(Buffer.concat(imageData));
    const pixels = Buffer.alloc(rowLength * height);
    for (let row = 0; row < height; row += 1) {
        const sourceOffset = row * (rowLength + 1);
        const targetOffset = row * rowLength;
        const filter = filtered[sourceOffset];

        for (let column = 0; column < rowLength; column += 1) {
            const left = column >= 4 ? pixels[targetOffset + column - 4] : 0;
            const above = row > 0 ? pixels[targetOffset - rowLength + column] : 0;
            const upperLeft = row > 0 && column >= 4 ? pixels[targetOffset - rowLength + column - 4] : 0;
            let predictor = 0;

            if (filter === 1) predictor = left;
            else if (filter === 2) predictor = above;
            else if (filter === 3) predictor = Math.floor((left + above) / 2);
            else if (filter === 4) predictor = paethPredictor(left, above, upperLeft);
            else if (filter !== 0) throw new Error("Invoice logo contains an unsupported PNG filter");

            pixels[targetOffset + column] = (filtered[sourceOffset + column + 1] + predictor) & 0xff;
        }
    }

    let left = width;
    let top = height;
    let right = -1;
    let bottom = -1;
    for (let row = 0; row < height; row += 1) {
        for (let column = 0; column < width; column += 1) {
            if (pixels[(row * width + column) * 4 + 3] > 8) {
                left = Math.min(left, column);
                top = Math.min(top, row);
                right = Math.max(right, column);
                bottom = Math.max(bottom, row);
            }
        }
    }
    if (right < left || bottom < top) throw new Error("Invoice logo is empty");

    const croppedWidth = right - left + 1;
    const croppedHeight = bottom - top + 1;
    const rgb = Buffer.alloc(croppedWidth * croppedHeight * 3);
    const alpha = Buffer.alloc(croppedWidth * croppedHeight);
    for (let row = 0; row < croppedHeight; row += 1) {
        for (let column = 0; column < croppedWidth; column += 1) {
            const source = ((top + row) * width + left + column) * 4;
            const target = row * croppedWidth + column;
            pixels.copy(rgb, target * 3, source, source + 3);
            alpha[target] = pixels[source + 3];
        }
    }

    return {
        width: croppedWidth,
        height: croppedHeight,
        rgb: deflateSync(rgb),
        alpha: deflateSync(alpha),
    };
}

export function generateInvoicePdf(data: InvoicePdfData): Buffer {
    const pageW = 595;
    const pageH = 842;
    const margin = 48;
    const right = pageW - margin;
    const colors = {
        ink: "0.10 0.13 0.18",
        muted: "0.40 0.44 0.50",
        red: "0.84 0.10 0.13",
        pale: "0.96 0.97 0.98",
        rule: "0.87 0.89 0.91",
        white: "1 1 1",
    };
    const pages: string[][] = [];
    let commands: string[] = [];
    let y = 0;
    const logo = decodeLogoPng(readFileSync(resolve(process.cwd(), "assets", "main-logo.png")));

    const rectangle = (x: number, top: number, width: number, height: number, color: string) => {
        commands.push(`${color} rg ${x} ${pageH - top - height} ${width} ${height} re f`);
    };

    const rule = (x1: number, top: number, x2: number, color = colors.rule) => {
        commands.push(`${color} RG 0.7 w ${x1} ${pageH - top} m ${x2} ${pageH - top} l S`);
    };

    const image = (x: number, top: number, width: number, height: number) => {
        commands.push(`q ${width.toFixed(2)} 0 0 ${height.toFixed(2)} ${x.toFixed(2)} ${(pageH - top - height).toFixed(2)} cm /Im1 Do Q`);
    };

    const text = (
        value: string,
        x: number,
        baseline: number,
        size = 10,
        color = colors.ink,
        bold = false,
        align: "left" | "right" = "left",
    ) => {
        const safeValue = escapeText(value);
        const textX = align === "right" ? x - value.length * size * 0.5 : x;
        commands.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${color} rg 1 0 0 1 ${textX.toFixed(2)} ${(pageH - baseline).toFixed(2)} Tm (${safeValue}) Tj ET`);
    };

    const wrap = (value: string, maxChars: number): string[] => {
        const words = String(value || "").trim().split(/\s+/).filter(Boolean);
        if (!words.length) return [];
        const lines: string[] = [];
        let line = "";
        for (const word of words) {
            const next = line ? `${line} ${word}` : word;
            if (next.length > maxChars && line) {
                lines.push(line);
                line = word;
            } else {
                line = next;
            }
        }
        if (line) lines.push(line);
        return lines;
    };

    const startPage = (continuation = false) => {
        commands = [];
        pages.push(commands);
        rectangle(0, 0, pageW, 7, colors.red);
        const logoScale = Math.min(150 / logo.width, 76 / logo.height);
        image(margin, 8, logo.width * logoScale, logo.height * logoScale);
        text(continuation ? "INVOICE / CONTINUED" : "INVOICE", right, 53, 22, colors.ink, true, "right");
        text(`Invoice ${data.invoiceNumber || "N/A"}`, right, 72, 9, colors.muted, false, "right");
        y = continuation ? 112 : 0;
    };

    const drawTableHeader = () => {
        rectangle(margin, y, right - margin, 30, colors.ink);
        text("PRODUCT", margin + 12, y + 19, 8, colors.white, true);
        text("QTY", 366, y + 19, 8, colors.white, true, "right");
        text("UNIT PRICE", 455, y + 19, 8, colors.white, true, "right");
        text("AMOUNT", right - 12, y + 19, 8, colors.white, true, "right");
        y += 30;
    };

    startPage();
    rectangle(margin, 94, right - margin, 94, colors.pale);
    const metadata: Array<[string, string]> = [
        ["INVOICE NUMBER", data.invoiceNumber || "N/A"],
        ["ORDER NUMBER", data.orderNumber || "N/A"],
        ["DATE ISSUED", data.orderDate || new Date().toLocaleDateString()],
        ["ORDER STATUS", data.status || "PENDING"],
    ];
    metadata.forEach(([label, value], index) => {
        const column = index % 2;
        const row = Math.floor(index / 2);
        const x = margin + 12 + column * 246;
        const labelBaseline = row === 0 ? 112 : 154;
        text(label, x, labelBaseline, 7, colors.muted, true);
        text(value, x, labelBaseline + 16, 8.5, colors.ink, true);
    });

    rectangle(margin, 200, 241, 104, colors.pale);
    rectangle(306, 200, right - 306, 104, colors.pale);
    text("BILL TO", margin + 12, 221, 8, colors.red, true);
    let customerY = 241;
    const customerLines = [
        ...wrap(data.customerName || "Unknown", 39),
        ...wrap(data.customerAddress || "", 39),
        ...(data.customerPhone ? wrap(`Phone: ${data.customerPhone}`, 39) : []),
    ];
    customerLines.slice(0, 4).forEach((line, index) => {
        text(line, margin + 12, customerY + index * 15, 9, index === 0 ? colors.ink : colors.muted, index === 0);
    });
    text("ORDER", 318, 221, 8, colors.red, true);
    text("Payment due", 318, 243, 8, colors.muted);
    text("As agreed at checkout", 318, 259, 9, colors.ink, true);
    text("Status", 318, 280, 8, colors.muted);
    text(data.status || "PENDING", 375, 280, 9, colors.ink, true);

    y = 330;
    drawTableHeader();
    let rowIndex = 0;
    for (const item of data.items || []) {
        const productLines = wrap(item.productName || "Product", 44);
        const rowHeight = Math.max(36, productLines.length * 13 + 15);
        if (y + rowHeight > 710) {
            startPage(true);
            drawTableHeader();
        }
        if (rowIndex % 2 === 0) rectangle(margin, y, right - margin, rowHeight, colors.pale);
        productLines.forEach((line, index) => text(line, margin + 12, y + 18 + index * 13, 9, colors.ink, index === 0));
        const baseline = y + Math.min(rowHeight - 12, 22);
        text(String(item.quantity), 366, baseline, 9, colors.ink, false, "right");
        text(`BDT ${item.price}`, 455, baseline, 9, colors.ink, false, "right");
        text(`BDT ${item.total}`, right - 12, baseline, 9, colors.ink, true, "right");
        y += rowHeight;
        rule(margin, y, right);
        rowIndex += 1;
    }
    if (rowIndex === 0) {
        text("No item details available", margin + 12, y + 20, 9, colors.muted);
        y += 36;
    }

    if (y + 132 > pageH - 76) {
        startPage(true);
    }
    const totalsX = 340;
    const totalsRight = right - 12;
    rule(totalsX, y + 7, right);
    y += 29;
    text("Subtotal", totalsX, y, 9, colors.muted);
    text(`BDT ${data.subtotal ?? "0.00"}`, totalsRight, y, 9, colors.ink, false, "right");
    y += 20;
    text("Shipping", totalsX, y, 9, colors.muted);
    text(`BDT ${data.shippingCost ?? "0.00"}`, totalsRight, y, 9, colors.ink, false, "right");
    if (data.tax !== undefined) {
        y += 20;
        text("Tax", totalsX, y, 9, colors.muted);
        text(`BDT ${data.tax}`, totalsRight, y, 9, colors.ink, false, "right");
    }
    y += 17;
    rectangle(totalsX - 8, y, right - totalsX + 8, 38, colors.red);
    text("TOTAL DUE", totalsX + 4, y + 24, 9, colors.white, true);
    text(`BDT ${data.total ?? data.subtotal ?? "0.00"}`, totalsRight - 4, y + 24, 12, colors.white, true, "right");

    pages.forEach((page, index) => {
        page.push(`${colors.rule} RG 0.7 w ${margin} 54 m ${right} 54 l S`);
        page.push(`BT /F1 8 Tf ${colors.muted} rg 1 0 0 1 ${margin} 35 Tm (Thank you for shopping with AmrBasket.) Tj ET`);
        page.push(`BT /F1 8 Tf ${colors.muted} rg 1 0 0 1 ${right - 65} 35 Tm (Page ${index + 1} of ${pages.length}) Tj ET`);
    });

    const body = (num: number, content: string) => `${num} 0 obj\n${content}\nendobj\n`;
    const objects: string[] = [
        body(1, "<< /Type /Catalog /Pages 2 0 R >>"),
        body(2, `<< /Type /Pages /Kids [${pages.map((_, index) => `${7 + index * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`),
        body(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
        body(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"),
    ];

    const imageObject = (num: number, dictionary: string, stream: Buffer) =>
        `${num} 0 obj\n<< ${dictionary} /Length ${stream.length} >>\nstream\n${stream.toString("latin1")}\nendstream\nendobj\n`;
    objects.push(
        imageObject(5, ` /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode`, logo.alpha),
        imageObject(6, ` /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /SMask 5 0 R`, logo.rgb),
    );

    pages.forEach((page, index) => {
        const pageObject = 7 + index * 2;
        const contentObject = pageObject + 1;
        const content = page.join("\n");
        objects.push(body(pageObject, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents ${contentObject} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << /Im1 6 0 R >> >> >>`));
        objects.push(body(contentObject, `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`));
    });

    const header = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
    const offsets: number[] = [];
    let size = Buffer.byteLength(header, "latin1");
    for (const object of objects) {
        offsets.push(size);
        size += Buffer.byteLength(object, "latin1");
    }

    const xrefOffset = size;
    let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f\r\n`;
    for (const offset of offsets) xref += `${pad10(offset)} 00000 n\r\n`;
    const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    return Buffer.from(header + objects.join("") + xref + trailer, "latin1");
}
