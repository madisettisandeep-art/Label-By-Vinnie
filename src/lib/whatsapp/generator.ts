import { SITE_CONFIG } from '@/config/site';
import { Order, CustomStitchingEnquiry, Product } from '@/types';

/**
 * Builds a comprehensive, URL-encoded WhatsApp ordering link targeting +91 81064 57406
 * Preserves all customer selections: colour, size, stitching options, custom measurements, and tailoring notes.
 */
export function generateCartOrderWhatsAppUrl(order: Order): string {
  const itemsText = order.items
    .map((item, index) => {
      let details = `${index + 1}. ${item.name} (SKU: ${item.productId || 'LBV-ATELIER'})`;
      details += `\n   • Size/Fit: ${item.size}`;
      if (item.color) details += `\n   • Colour: ${item.color}`;
      if (item.stitchingOption) {
        details += `\n   • Stitching: ${item.stitchingOption.toUpperCase()}${item.stitchingPrice ? ` (+₹${item.stitchingPrice.toLocaleString('en-IN')})` : ''}`;
      }

      if (item.customMeasurements) {
        const m = item.customMeasurements;
        const measurementParts: string[] = [];
        if (m.bust) measurementParts.push(`Bust: ${m.bust}"`);
        if (m.waist) measurementParts.push(`Waist: ${m.waist}"`);
        if (m.hip) measurementParts.push(`Hip: ${m.hip}"`);
        if (m.shoulder) measurementParts.push(`Shoulder: ${m.shoulder}"`);
        if (m.sleeveLength) measurementParts.push(`Sleeve: ${m.sleeveLength}"`);
        if (m.blouseLength) measurementParts.push(`Blouse Length: ${m.blouseLength}"`);
        if (m.garmentLength) measurementParts.push(`Garment Length: ${m.garmentLength}"`);

        if (measurementParts.length > 0) {
          details += `\n   • Custom Measurements: ${measurementParts.join(', ')}`;
        }
      }

      if (item.fittingNotes) {
        details += `\n   • Tailoring Instructions: ${item.fittingNotes}`;
      }

      const itemTotal = item.price * item.quantity;
      details += `\n   • Price: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${itemTotal.toLocaleString('en-IN')}`;

      return details;
    })
    .join('\n\n');

  const text = `Hello ${SITE_CONFIG.name},

I would like to place a luxury atelier order:

ORDER REFERENCE: ${order.orderReference}

CUSTOMER DETAILS:
• Name: ${order.customer.name}
• Phone: ${order.customer.phone}${order.customer.email ? `\n• Email: ${order.customer.email}` : ''}
• Dispatch Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.postalCode}

ORDER SUMMARY:
${itemsText}

TOTAL ORDER AMOUNT: ₹${order.subtotal.toLocaleString('en-IN')}
${order.customer.notes ? `\nSPECIAL CLIENT REQUEST:\n"${order.customer.notes}"\n` : ''}
Please confirm garment availability, dispatch timeline, and payment account details.

Thank you!`;

  return `${SITE_CONFIG.whatsapp.baseUrl}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates direct product enquiry WhatsApp URL
 */
export function generateProductEnquiryWhatsAppUrl(product: Product, size?: string, color?: string): string {
  const text = `Hello ${SITE_CONFIG.name},

I am interested in consulting and ordering:
• Garment: ${product.name} (SKU: ${product.id})
• Category: ${product.categoryTitle}
${size ? `• Preferred Size: ${size}\n` : ''}${color ? `• Preferred Colour: ${color}\n` : ''}• Listed Price: ₹${product.price.toLocaleString('en-IN')}

Please share fabric details, availability, and bespoke tailoring options.

Thank you!`;

  return `${SITE_CONFIG.whatsapp.baseUrl}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates custom stitching enquiry WhatsApp URL
 */
export function generateStitchingEnquiryWhatsAppUrl(enquiry: CustomStitchingEnquiry): string {
  const m = enquiry.measurements;
  const unit = m.unit;

  const text = `Hello ${SITE_CONFIG.name},

I would like to submit a Custom Stitching & Tailoring Consultation:

Enquiry Reference: ${enquiry.referenceNumber}
Client Name: ${enquiry.customerName}
Phone: ${enquiry.customerPhone}

Garment Type: ${enquiry.garmentType}
Fabric Selected: ${enquiry.fabricType}

Custom Measurements (${unit}):
• Bust: ${m.bust ?? '-'}
• Waist: ${m.waist ?? '-'}
• Hip: ${m.hip ?? '-'}
• Shoulder: ${m.shoulder ?? '-'}
• Armhole: ${m.armhole ?? '-'}
• Sleeve Length: ${m.sleeveLength ?? '-'}
• Garment Length: ${m.garmentLength ?? '-'}
• Front Neck Depth: ${m.frontNeckDepth ?? '-'}
• Back Neck Depth: ${m.backNeckDepth ?? '-'}

Design Instructions:
${enquiry.designNotes || 'Standard bespoke tailoring as per atelier guidance.'}
${enquiry.preferredDate ? `Preferred Delivery Date: ${enquiry.preferredDate}` : ''}

Please provide a custom stitching quotation and delivery timeline.

Thank you!`;

  return `${SITE_CONFIG.whatsapp.baseUrl}?text=${encodeURIComponent(text)}`;
}
