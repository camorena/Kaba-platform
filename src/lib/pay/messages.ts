/**
 * Public pay page copy — EN + Formal Colombian Spanish.
 * Self-contained (no admin LocaleProvider required).
 */

export type PayLocale = "en" | "es";

type PayMessages = {
  metaTitle: string;
  brandPay: string;
  invoiceLabel: string;
  forCustomer: string;
  status: string;
  total: string;
  paid: string;
  balance: string;
  depositSuggested: string;
  lineItems: string;
  description: string;
  qty: string;
  amount: string;
  payDeposit: string;
  paying: string;
  offlineTitle: string;
  offlineBody: string;
  contactUs: string;
  paidInFull: string;
  voidTitle: string;
  voidBody: string;
  noBalance: string;
  checkoutFailed: string;
  successTitle: string;
  successBody: string;
  cancelTitle: string;
  cancelBody: string;
  receiptTitle: string;
  receiptStubNote: string;
  receiptAmount: string;
  receiptMethod: string;
  receiptRef: string;
  notFoundTitle: string;
  notFoundBody: string;
  langEn: string;
  langEs: string;
  secureNote: string;
  demoBadge: string;
};

const en: PayMessages = {
  metaTitle: "Pay invoice",
  brandPay: "Invoice payment",
  invoiceLabel: "Invoice",
  forCustomer: "Prepared for",
  status: "Status",
  total: "Total",
  paid: "Paid",
  balance: "Balance due",
  depositSuggested: "Suggested deposit",
  lineItems: "Line items",
  description: "Description",
  qty: "Qty",
  amount: "Amount",
  payDeposit: "Pay deposit securely",
  paying: "Opening secure checkout…",
  offlineTitle: "Online card payment is not available yet",
  offlineBody:
    "This shop has not connected card payments. Please call or email to arrange your deposit — we will not pretend cards work here.",
  contactUs: "Contact us",
  paidInFull: "This invoice is paid in full. Thank you.",
  voidTitle: "This invoice is void",
  voidBody: "It cannot accept payment. Contact us if you believe this is a mistake.",
  noBalance: "Nothing is due on this invoice.",
  checkoutFailed: "Could not start checkout. Please try again or contact us.",
  successTitle: "Payment received — thank you",
  successBody:
    "If you just completed Checkout, your deposit will appear here shortly after confirmation. A receipt stub is shown below when available.",
  cancelTitle: "Checkout canceled",
  cancelBody: "No charge was made. You can try again when you are ready.",
  receiptTitle: "Receipt (stub)",
  receiptStubNote:
    "This is a local receipt stub — it has not been emailed. Keep a screenshot if you need a record today.",
  receiptAmount: "Amount",
  receiptMethod: "Method",
  receiptRef: "Reference",
  notFoundTitle: "Payment link not found",
  notFoundBody:
    "This link is invalid or expired. Ask Kaba Fence for a fresh pay link from your invoice.",
  langEn: "EN",
  langEs: "ES",
  secureNote: "You are on a private pay link — no admin login required.",
  demoBadge: "Demo data",
};

/** Formal Colombian Spanish (usted). */
const es: PayMessages = {
  metaTitle: "Pagar factura",
  brandPay: "Pago de factura",
  invoiceLabel: "Factura",
  forCustomer: "Preparada para",
  status: "Estado",
  total: "Total",
  paid: "Pagado",
  balance: "Saldo pendiente",
  depositSuggested: "Anticipo sugerido",
  lineItems: "Conceptos",
  description: "Descripción",
  qty: "Cant.",
  amount: "Monto",
  payDeposit: "Pagar anticipo de forma segura",
  paying: "Abriendo el pago seguro…",
  offlineTitle: "El pago con tarjeta en línea aún no está disponible",
  offlineBody:
    "Este negocio aún no ha conectado los pagos con tarjeta. Por favor llámenos o escríbanos para coordinar su anticipo — no fingiremos que las tarjetas funcionan aquí.",
  contactUs: "Contáctenos",
  paidInFull: "Esta factura está pagada en su totalidad. Gracias.",
  voidTitle: "Esta factura está anulada",
  voidBody:
    "No puede recibir pagos. Contáctenos si cree que se trata de un error.",
  noBalance: "No hay saldo pendiente en esta factura.",
  checkoutFailed:
    "No se pudo iniciar el pago. Intente de nuevo o contáctenos.",
  successTitle: "Pago recibido — gracias",
  successBody:
    "Si acaba de completar Checkout, su anticipo aparecerá aquí en breve tras la confirmación. Abajo verá un comprobante provisional cuando esté disponible.",
  cancelTitle: "Pago cancelado",
  cancelBody: "No se realizó ningún cargo. Puede intentar de nuevo cuando desee.",
  receiptTitle: "Comprobante (provisional)",
  receiptStubNote:
    "Este es un comprobante provisional local — no se ha enviado por correo. Guarde una captura si necesita el registro hoy.",
  receiptAmount: "Monto",
  receiptMethod: "Método",
  receiptRef: "Referencia",
  notFoundTitle: "Enlace de pago no encontrado",
  notFoundBody:
    "Este enlace no es válido o ha vencido. Solicite a Kaba Fence un enlace nuevo desde su factura.",
  langEn: "EN",
  langEs: "ES",
  secureNote:
    "Está en un enlace de pago privado — no se requiere inicio de sesión de administración.",
  demoBadge: "Datos de demostración",
};

export const payMessages: Record<PayLocale, PayMessages> = { en, es };

export function getPayMessages(locale: PayLocale): PayMessages {
  return payMessages[locale] ?? payMessages.en;
}
