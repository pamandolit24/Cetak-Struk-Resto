import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptData } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
    throw new Error("VITE_API_KEY environment variable is not set. For local development, please create a .env file in the root and add VITE_API_KEY=<your_api_key>.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        restaurantName: {
            type: Type.STRING,
            description: "The name of the restaurant."
        },
        address: {
            type: Type.STRING,
            description: "The address of the restaurant."
        },
        city: {
            type: Type.STRING,
            description: "The city where the restaurant is located."
        },
        phone: {
            type: Type.STRING,
            description: "The phone number of the restaurant."
        },
        date: {
            type: Type.STRING,
            description: "The date of the transaction, e.g., '10/01/2022'."
        },
        tableNumber: {
            type: Type.STRING,
            description: "The table number, e.g., 'Sengon1'."
        },
        items: {
            type: Type.ARRAY,
            description: "List of items purchased.",
            items: {
                type: Type.OBJECT,
                properties: {
                    quantity: {
                        type: Type.INTEGER,
                        description: "The quantity of the item. Assume 1 if not specified."
                    },
                    name: {
                        type: Type.STRING,
                        description: "The name of the item. Be descriptive, e.g. 'Aym Kpg Bkr Madu (E)'."
                    },
                    unitPrice: {
                        type: Type.NUMBER,
                        description: "The price for a single unit of the item."
                    },
                },
                required: ["quantity", "name", "unitPrice"]
            }
        },
        subtotal: {
            type: Type.NUMBER,
            description: "The subtotal amount before tax."
        },
        tax: {
            type: Type.NUMBER,
            description: "The tax amount, often labeled as PB1."
        },
        total: {
            type: Type.NUMBER,
            description: "The final total amount."
        },
    },
    required: ["items", "subtotal", "tax", "total"]
};


export const parseReceipt = async (base64Image: string, mimeType: string): Promise<ReceiptData> => {
    
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: `Analyze the provided receipt image. Extract the restaurant name, address, city, phone number, date, table number, subtotal, tax (labeled as PB1), and total amount. Also extract all line items. For each item, provide its quantity, name, and unit price. Provide the output as a structured JSON object according to the provided schema. The currency is Indonesian Rupiah (IDR), so represent all prices as numbers without currency symbols or thousand separators (e.g., 115,000 should be 115000). If a quantity is not explicitly mentioned for an item, assume it is 1. If an item line shows a quantity and a total price (e.g., '2 Es Teh Tawar 20,000'), you must calculate the price for a single unit and provide that value in the 'unitPrice' field. In the example, the unit price would be 10000 (20000 / 2). The price in the schema should always be the price for one unit.`
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Ensure all required fields exist
        if (!parsedJson.items || typeof parsedJson.subtotal !== 'number' || typeof parsedJson.tax !== 'number' || typeof parsedJson.total !== 'number') {
            throw new Error("Parsed JSON is missing required fields.");
        }

        return parsedJson as ReceiptData;

    } catch (error) {
        console.error("Error parsing receipt with Gemini:", error);
        throw new Error("Failed to get a valid response from the AI model.");
    }
};
