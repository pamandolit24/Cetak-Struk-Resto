import { ReceiptData, ReceiptItem } from '../types';

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';
const EOT = '\x04';
const NUL = '\x00';

const COMMANDS = {
  // Feed control
  LF: '\x0A', // Line feed
  // Printer hardware
  INIT: `${ESC}@`, // Initialize printer
  // Character format
  TXT_ALIGN_L: `${ESC}a\x00`,
  TXT_ALIGN_C: `${ESC}a\x01`,
  TXT_ALIGN_R: `${ESC}a\x02`,
  TXT_NORMAL: `${ESC}!\x00`,
  TXT_2HEIGHT: `${ESC}!\x10`,
  TXT_2WIDTH: `${ESC}!\x20`,
  TXT_BOLD_ON: `${ESC}E\x01`,
  TXT_BOLD_OFF: `${ESC}E\x00`,
  // Paper
  PAPER_FULL_CUT: `${GS}V\x00`,
  PAPER_PART_CUT: `${GS}V\x01`,
};

// Character width for a standard receipt printer font (usually 48 characters for 80mm, 32 for 58mm)
const RECEIPT_WIDTH = 32;

const textEncoder = new TextEncoder();

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID').format(amount);
};

const formatLine = (left: string, right: string): string => {
    const padding = RECEIPT_WIDTH - left.length - right.length;
    return `${left}${' '.repeat(Math.max(0, padding))}${right}`;
};

const generatePrintCommands = (receiptData: ReceiptData): string => {
    let commands = '';
    commands += COMMANDS.INIT;
    
    // Header
    commands += COMMANDS.TXT_ALIGN_C;
    if (receiptData.restaurantName) {
        commands += COMMANDS.TXT_BOLD_ON;
        commands += COMMANDS.TXT_2HEIGHT;
        commands += `${receiptData.restaurantName}\n`;
        commands += COMMANDS.TXT_NORMAL;
        commands += COMMANDS.TXT_BOLD_OFF;
    }
    if (receiptData.address) commands += `${receiptData.address}\n`;
    if (receiptData.city) commands += `${receiptData.city}\n`;
    if (receiptData.phone) commands += `${receiptData.phone}\n`;
    
    // Sub-header
    commands += COMMANDS.TXT_ALIGN_L;
    commands += `--------------------------------\n`;
    if (receiptData.date) commands += `${formatLine(`Date: ${receiptData.date}`, `Trx: ${receiptData.transactionId || '-'}`)}\n`;
    if (receiptData.tableNumber || receiptData.customerName) commands += `${formatLine(`Table: ${receiptData.tableNumber || '-'}`, `Cust: ${receiptData.customerName || '-'}`)}\n`;
    commands += `--------------------------------\n`;
    
    // Items
    commands += COMMANDS.TXT_ALIGN_L;
    receiptData.items.forEach((item: ReceiptItem) => {
        // Line 1: Item Name
        commands += `${item.name}\n`;

        // Line 2: Qty x Unit Price         Total Price
        const totalPrice = item.quantity * item.unitPrice;
        const leftDetails = `  ${item.quantity} x ${formatCurrency(item.unitPrice)}`;
        const rightDetails = formatCurrency(totalPrice);
        commands += `${formatLine(leftDetails, rightDetails)}\n`;
    });
    
    // Totals
    commands += `--------------------------------\n`;
    commands += COMMANDS.TXT_ALIGN_R;
    commands += `${formatLine('Subtotal', formatCurrency(receiptData.subtotal))}\n`;
    commands += `${formatLine('Tax (PB1)', formatCurrency(receiptData.tax))}\n`;
    commands += COMMANDS.TXT_BOLD_ON;
    commands += `${formatLine('TOTAL', formatCurrency(receiptData.total))}\n`;
    commands += COMMANDS.TXT_BOLD_OFF;

    // Payment Details
    commands += `--------------------------------\n`;
    if (receiptData.paymentType) {
        commands += COMMANDS.TXT_ALIGN_R;
        commands += `${formatLine('PEMBAYARAN', receiptData.paymentType.toUpperCase())}\n`;
        if (receiptData.paymentType === 'Tunai' && typeof receiptData.paymentAmount === 'number') {
            commands += `${formatLine('TUNAI', formatCurrency(receiptData.paymentAmount))}\n`;
            commands += `${formatLine('KEMBALI', formatCurrency(receiptData.paymentChange || 0))}\n`;
        }
    }
    
    commands += COMMANDS.TXT_ALIGN_C;
    commands += `\n--- LUNAS ---\n`;
    

    // Footer
    commands += `\n\n`;
    commands += COMMANDS.TXT_ALIGN_C;
    if(receiptData.footerMessage) {
        commands += `${receiptData.footerMessage}\n`;
    }
    commands += `\n\n\n`;
    
    // Cut paper
    commands += COMMANDS.PAPER_FULL_CUT;
    
    return commands;
};


export const connectAndPrint = async (receiptData: ReceiptData, updateStatus: (message: string) => void): Promise<void> => {
    // FIX: Property 'bluetooth' does not exist on type 'Navigator'. Cast to 'any' to access Web Bluetooth API.
    if (!(navigator as any).bluetooth) {
        throw new Error('Web Bluetooth API is not available on this browser.');
    }
    
    updateStatus('Requesting Bluetooth device...');
    // FIX: Property 'bluetooth' does not exist on type 'Navigator'. Cast to 'any' to access Web Bluetooth API.
    const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'] // Generic Attribute Profile (common for printers)
    });

    if (!device.gatt) {
        throw new Error('GATT Server not available on this device.');
    }

    updateStatus('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    updateStatus('Getting Primary Service...');
    // Standard service for serial port emulation over BLE
    const services = await server.getPrimaryServices();
    // A common service UUID for serial port emulation used by many thermal printers
    const sppServiceUUID = '000018f0-0000-1000-8000-00805f9b34fb'; 
    let service = services.find(s => s.uuid.includes('18f0'));

    if(!service) {
      // Fallback to trying all services if the standard one is not found
      for(const s of services) {
        try {
          const characteristics = await s.getCharacteristics();
          if (characteristics.some(c => c.properties.write || c.properties.writeWithoutResponse)) {
            service = s;
            break;
          }
        } catch(e) { /* ignore services we can't access */ }
      }
    }

    if (!service) {
      throw new Error('Could not find a suitable service on the device.');
    }

    updateStatus('Getting Characteristic...');
    const characteristics = await service.getCharacteristics();
    const characteristic = characteristics.find(c => c.properties.write || c.properties.writeWithoutResponse);

    if (!characteristic) {
        throw new Error('Could not find a writable characteristic.');
    }

    const commands = generatePrintCommands(receiptData);
    const dataToSend = textEncoder.encode(commands);

    updateStatus('Sending data to printer...');
    // Some printers have small buffers, send in chunks
    const chunkSize = 512; // BLE 5 can handle up to 512 bytes
    for (let i = 0; i < dataToSend.length; i += chunkSize) {
        const chunk = dataToSend.slice(i, i + chunkSize);
        await characteristic.writeValueWithoutResponse(chunk);
    }

    updateStatus('Printing complete. Disconnecting...');
    server.disconnect();
};
