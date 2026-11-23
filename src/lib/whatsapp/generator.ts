import { SITE_CONFIG } from '@/config/site';
import { Order, CustomStitchingEnquiry, Product } from '@/types';

/**
 * Builds a secure, URL-encoded WhatsApp ordering link targeting +91 81064 57406
 */
export function generateCartOrderWhatsAppUrl(order: Order): string {
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.name}\n  Size: ${item.size}${item.color ? ` | Colour: ${item.color}` : ''}\n  Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}`
    )
    .join('\n\n');

  const text = `Hello ${SITE_CONFIG.name},

I would like to place an order.

Order Reference: ${order.orderReference}

Customer: ${order.customer.name}
Phone: ${order.customer.phone}

Products:
${itemsText}

Order Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}

Delivery Address:
${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.postalCode}
${order.customer.notes ? `\nOrder Notes:\n${order.customer.notes}` : ''}

Please confirm product availability, delivery charges and the next steps.

Thank you.`;

  return `${SITE_CONFIG.whatsapp.baseUrl}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates direct product enquiry WhatsApp URL
 */
export function generateProductEnquiryWhatsAppUrl(product: Product, size?: string): string {
  const text = `Hello ${SITE_CONFIG.name},

I am interested in ordering:
${product.name}
${size ? `Size: ${size}` : ''}
Estimated Price: ₹${product.price.toLocaleString('en-IN')}

Please share availability and customization options.

Thank you.`;

  return `${SITE_CONFIG.whatsapp.baseUrl}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates custom stitching enquiry WhatsApp URL
 */
export function generateStitchingEnquiryWhatsAppUrl(enquiry: CustomStitchingEnquiry): string {
  const m = enquiry.measurements;
  const unit = m.unit;

  const text = `Hello ${SITE_CONFIG.name},

I would like to submit a Custom Stitching Enquiry.

Enquiry Reference: ${enquiry.referenceNumber}
Client Name: ${enquiry.customerName}
Phone: ${enquiry.customerPhone}

Garment: ${enquiry.garmentType}
Fabric: ${enquiry.fabricType}

Measurements (${unit}):
• Bust: ${m.bust ?? '-'}
• Waist: ${m.waist ?? '-'}
• Hip: ${m.hip ?? '-'}
• Shoulder: ${m.shoulder ?? '-'}
• Armhole: ${m.armhole ?? '-'}
• Sleeve Length: ${m.sleeveLength ?? '-'}
• Garment Length: ${m.garmentLength ?? '-'}
• Front Neck: ${m.frontNeckDepth ?? '-'}
• Back Neck: ${m.backNeckDepth ?? '-'}

Design Instructions:
${enquiry.designNotes || 'Standard bespoke tailoring as per atelier guidance.'}
${enquiry.preferredDate ? `Preferred Date: ${enquiry.preferredDate}` : ''}

Please provide a quotation and completion timeline.

Thank you.`;

  return `${SITE_CONFIG.whatsapp.baseUrl}?text=${encodeURIComponent(text)}`;
}
