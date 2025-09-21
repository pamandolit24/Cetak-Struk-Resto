import React, { useState, useCallback, useEffect } from 'react';
import { ReceiptData, ReceiptItem, ReceiptTemplate, ProductTemplate } from './types';
import { parseReceipt, isApiKeySet } from './services/geminiService';
import * as receiptStorage from './services/receiptStorageService';
import ImageUploader from './components/ImageUploader';
import ReceiptEditor from './components/ReceiptEditor';
import LoadReceiptModal from './components/LoadReceiptModal';
import LoadTemplateModal from './components/LoadTemplateModal';
import SaveTemplateModal from './components/SaveTemplateModal';
import ProductModal from './components/ProductModal';
import { ReceiptIcon, ZapIcon, FolderIcon } from './components/icons';

const App: React.FC = () => {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [savedReceipts, setSavedReceipts] = useState<ReceiptData[]>([]);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState<boolean>(false);

  const [savedTemplates, setSavedTemplates] = useState<ReceiptTemplate[]>([]);
  const [isLoadTemplateModalOpen, setIsLoadTemplateModalOpen] = useState<boolean>(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState<boolean>(false);
  
  const [savedProducts, setSavedProducts] = useState<ProductTemplate[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);


  useEffect(() => {
    setSavedReceipts(receiptStorage.loadReceipts());
    setSavedTemplates(receiptStorage.loadReceiptTemplates());
    setSavedProducts(receiptStorage.loadProducts());
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setReceiptData(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = (reader.result as string).split(',')[1];
      setUploadedImage(reader.result as string);
      try {
        const parsedData = await parseReceipt(base64Image, file.type);
        
        const fullData: ReceiptData = {
            id: undefined, // Ensure it's treated as a new, unsaved receipt
            restaurantName: '',
            address: '',
            city: '',
            phone: '',
            date: new Date().toLocaleDateString('id-ID'),
            transactionId: `TRX-${Date.now().toString().slice(-6)}`,
            tableNumber: '',
            customerName: '',
            footerMessage: 'Thank you for your visit!',
            ...parsedData,
            paymentType: 'Tunai', // Default payment type
        };
        setReceiptData(fullData);
      } catch (e) {
        console.error(e);
        setError(`Failed to parse receipt: ${(e as Error).message}. Please try another image or check the API key.`);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      setIsLoading(false);
    };
  }, []);

  const handleDataChange = useCallback((newData: ReceiptData) => {
    setReceiptData(newData);
  }, []);

  const handleSaveReceipt = useCallback((dataToSave: ReceiptData) => {
    receiptStorage.saveReceipt(dataToSave);
    setSavedReceipts(receiptStorage.loadReceipts());
  }, []);
  
  const handleLoadReceipt = useCallback((dataToLoad: ReceiptData) => {
    setReceiptData(dataToLoad);
    setUploadedImage(null);
    setError(null);
    setIsLoadModalOpen(false);
  }, []);

  const handleDeleteReceipt = useCallback((id: string) => {
    const updatedReceipts = receiptStorage.deleteReceipt(id);
    setSavedReceipts(updatedReceipts);
  }, []);

  const handleSaveTemplate = useCallback((templateName: string) => {
    if (!receiptData) return;

    const templateData: Omit<ReceiptTemplate, 'id'> = {
        templateName,
        restaurantName: receiptData.restaurantName,
        address: receiptData.address,
        city: receiptData.city,
        phone: receiptData.phone,
        footerMessage: receiptData.footerMessage,
    };

    receiptStorage.saveReceiptTemplate(templateData);
    setSavedTemplates(receiptStorage.loadReceiptTemplates());
    setIsSaveTemplateModalOpen(false);
  }, [receiptData]);

  const handleLoadTemplate = useCallback((template: ReceiptTemplate) => {
    const emptyReceipt: ReceiptData = {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        date: new Date().toLocaleDateString('id-ID'),
        transactionId: `TRX-${Date.now().toString().slice(-6)}`,
        paymentType: 'Tunai',
    };
      
    setReceiptData(prevData => ({
        ...(prevData || emptyReceipt),
        restaurantName: template.restaurantName,
        address: template.address,
        city: template.city,
        phone: template.phone,
        footerMessage: template.footerMessage,
    }));
    setIsLoadTemplateModalOpen(false);
  }, []);

  const handleDeleteTemplate = useCallback((id: string) => {
    const updatedTemplates = receiptStorage.deleteReceiptTemplate(id);
    setSavedTemplates(updatedTemplates);
  }, []);

  const handleSaveProduct = useCallback((productData: Omit<ProductTemplate, 'id'>) => {
    receiptStorage.saveProduct(productData);
    setSavedProducts(receiptStorage.loadProducts());
  }, []);

  const handleDeleteProduct = useCallback((id: string) => {
      const updatedProducts = receiptStorage.deleteProduct(id);
      setSavedProducts(updatedProducts);
  }, []);

  const handleAddProductToReceipt = useCallback((product: ProductTemplate) => {
      if (!receiptData) return;

      const newItem: ReceiptItem = {
          name: product.name,
          quantity: 1,
          unitPrice: product.unitPrice,
      };

      const newItems = [...receiptData.items, newItem];

      const subtotal = newItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      const taxRate = receiptData.subtotal > 0 ? receiptData.tax / receiptData.subtotal : 0.1;
      const tax = subtotal * taxRate;
      const total = subtotal + tax;
      
      const newData: ReceiptData = {
          ...receiptData,
          items: newItems,
          subtotal,
          tax,
          total,
      };

      setReceiptData(newData);
      setIsProductModalOpen(false);
  }, [receiptData]);

  if (!isApiKeySet) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="text-center bg-red-900/50 border border-red-700 p-8 rounded-lg max-w-2xl">
          <h1 className="text-2xl font-bold text-red-300 mb-4">Application Configuration Error</h1>
          <p className="text-slate-300">
            The AI service is not configured correctly. The application cannot function without a valid API key.
          </p>
          <p className="mt-2 text-slate-400 text-sm">
            If you are the administrator, please set the <code className="bg-slate-700 p-1 rounded">VITE_API_KEY</code> environment variable in your Vercel project settings and redeploy the application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <ReceiptIcon className="h-8 w-8 text-cyan-400" />
              <h1 className="text-xl font-bold tracking-tight text-slate-200">
                AI Receipt Parser & POS Printer
              </h1>
            </div>
             <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsLoadTemplateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
                >
                    <FolderIcon className="w-5 h-5" />
                    <span>Load Template</span>
                </button>
                <button 
                    onClick={() => setIsLoadModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
                >
                    <FolderIcon className="w-5 h-5" />
                    <span>Load Receipts</span>
                </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-300 flex items-center gap-2">
              <ZapIcon className="w-6 h-6 text-yellow-400" />
              1. Upload Receipt Image
            </h2>
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              isLoading={isLoading}
              uploadedImage={uploadedImage}
            />
             {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                <p>{error}</p>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <ReceiptEditor 
              receiptData={receiptData} 
              onDataChange={handleDataChange}
              onSave={handleSaveReceipt}
              onSaveAsTemplate={() => setIsSaveTemplateModalOpen(true)}
              onOpenProductModal={() => setIsProductModalOpen(true)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      <SaveTemplateModal
        isOpen={isSaveTemplateModalOpen}
        onClose={() => setIsSaveTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
      />
      <LoadTemplateModal
        isOpen={isLoadTemplateModalOpen}
        onClose={() => setIsLoadTemplateModalOpen(false)}
        templates={savedTemplates}
        onLoad={handleLoadTemplate}
        onDelete={handleDeleteTemplate}
      />
      <LoadReceiptModal 
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        receipts={savedReceipts}
        onLoad={handleLoadReceipt}
        onDelete={handleDeleteReceipt}
      />
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        products={savedProducts}
        onSave={handleSaveProduct}
        onLoad={handleAddProductToReceipt}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default App;