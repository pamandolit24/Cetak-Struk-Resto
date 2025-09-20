import { ReceiptData, ReceiptTemplate, ProductTemplate } from '../types';

const STORAGE_KEY = 'savedReceipts';
const TEMPLATE_STORAGE_KEY = 'savedReceiptTemplates';
const PRODUCT_STORAGE_KEY = 'savedProducts';

/**
 * Saves a receipt to local storage. Always creates a new entry with a unique ID
 * to prevent overwriting existing receipts.
 * @param receipt The receipt data to save.
 */
export const saveReceipt = (receipt: ReceiptData): void => {
    try {
        const receipts = loadReceipts();
        
        // To prevent overwriting, create a new receipt object with a new unique ID for every save.
        const newReceipt = { ...receipt, id: `receipt-${Date.now()}` };

        receipts.unshift(newReceipt); // Add the new receipt to the top of the list
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
    } catch (error) {
        console.error("Failed to save receipt to localStorage", error);
    }
};

/**
 * Loads all saved receipts from local storage.
 * @returns An array of saved ReceiptData objects.
 */
export const loadReceipts = (): ReceiptData[] => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
        console.error("Failed to load receipts from localStorage", error);
        return [];
    }
};

/**
 * Deletes a receipt from local storage by its ID.
 * @param id The unique ID of the receipt to delete.
 * @returns The updated array of receipts after deletion.
 */
export const deleteReceipt = (id: string): ReceiptData[] => {
    try {
        let receipts = loadReceipts();
        receipts = receipts.filter(r => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
        return receipts;
    } catch (error) {
        console.error("Failed to delete receipt from localStorage", error);
        return loadReceipts(); // Return original list on failure
    }
};


/**
 * Saves a receipt template to local storage.
 * @param template The template data to save, excluding the ID.
 */
export const saveReceiptTemplate = (template: Omit<ReceiptTemplate, 'id'>): void => {
    try {
        const templates = loadReceiptTemplates();
        const newTemplate = { ...template, id: `template-${Date.now()}` };
        templates.unshift(newTemplate);
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
        console.error("Failed to save template to localStorage", error);
    }
};

/**
 * Loads all saved receipt templates from local storage.
 * @returns An array of saved ReceiptTemplate objects.
 */
export const loadReceiptTemplates = (): ReceiptTemplate[] => {
    try {
        const savedData = localStorage.getItem(TEMPLATE_STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
        console.error("Failed to load templates from localStorage", error);
        return [];
    }
};

/**
 * Deletes a receipt template from local storage by its ID.
 * @param id The unique ID of the template to delete.
 * @returns The updated array of templates after deletion.
 */
export const deleteReceiptTemplate = (id: string): ReceiptTemplate[] => {
    try {
        let templates = loadReceiptTemplates();
        templates = templates.filter(t => t.id !== id);
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
        return templates;
    } catch (error) {
        console.error("Failed to delete template from localStorage", error);
        return loadReceiptTemplates();
    }
};

/**
 * Saves a product to local storage.
 * @param product The product data to save, excluding the ID.
 */
export const saveProduct = (product: Omit<ProductTemplate, 'id'>): void => {
    try {
        const products = loadProducts();
        const newProduct = { ...product, id: `product-${Date.now()}` };
        products.unshift(newProduct);
        localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
        console.error("Failed to save product to localStorage", error);
    }
};

/**
 * Loads all saved products from local storage.
 * @returns An array of saved ProductTemplate objects.
 */
export const loadProducts = (): ProductTemplate[] => {
    try {
        const savedData = localStorage.getItem(PRODUCT_STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
        console.error("Failed to load products from localStorage", error);
        return [];
    }
};

/**
 * Deletes a product from local storage by its ID.
 * @param id The unique ID of the product to delete.
 * @returns The updated array of products after deletion.
 */
export const deleteProduct = (id: string): ProductTemplate[] => {
    try {
        let products = loadProducts();
        products = products.filter(p => p.id !== id);
        localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
        return products;
    } catch (error) {
        console.error("Failed to delete product from localStorage", error);
        return loadProducts();
    }
};
