
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DocumentItem, DocumentSensitivity, EmailItem } from '../types';

// The API key is injected from the environment and does not need to be managed by the user.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const documentSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "A unique identifier for the document, e.g. doc-1" },
      name: { type: Type.STRING, description: 'e.g., "Company Picnic Menu"' },
      sensitivity: {
        type: Type.STRING,
        enum: [DocumentSensitivity.PUBLIC, DocumentSensitivity.INTERNAL, DocumentSensitivity.CONFIDENTIAL],
        description: 'The sensitivity level of the document.'
      },
    },
    required: ['id', 'name', 'sensitivity'],
  },
};

const emailSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "A unique identifier for the email, e.g. email-1" },
            sender: { type: Type.STRING, description: 'e.g., "IT Support" or "rewards@a-mazon.com"' },
            subject: { type: Type.STRING, description: 'e.g., "Urgent Password Reset Required"' },
            bodyPreview: { type: Type.STRING, description: 'A short preview of the email body, max 15 words.' },
            isPhishing: { type: Type.BOOLEAN, description: 'True if the email is a phishing attempt.' },
        },
        required: ['id', 'sender', 'subject', 'bodyPreview', 'isPhishing'],
    }
};

const getFallbackDocuments = (): DocumentItem[] => [
    { id: 'doc-1', name: 'Q3 Financial Report', sensitivity: DocumentSensitivity.CONFIDENTIAL },
    { id: 'doc-2', name: 'Team Meeting Notes', sensitivity: DocumentSensitivity.INTERNAL },
    { id: 'doc-3', name: 'Public Press Release', sensitivity: DocumentSensitivity.PUBLIC },
    { id: 'doc-4', name: 'Employee Handbook', sensitivity: DocumentSensitivity.INTERNAL },
    { id: 'doc-5', name: 'Client Database Backup', sensitivity: DocumentSensitivity.CONFIDENTIAL },
];

const getFallbackEmails = (): EmailItem[] => [
    { id: 'email-1', sender: 'IT Helpdesk <support@company.com>', subject: 'Scheduled Maintenance', bodyPreview: 'We will be performing system maintenance tonight from 11 PM to 2 AM.', isPhishing: false },
    { id: 'email-2', sender: 'rewards@a-mazon.co', subject: 'You won a prize!', bodyPreview: 'Click here now to claim your free gift card worth $100! Limited time offer.', isPhishing: true },
    { id: 'email-3', sender: 'HR Department <hr@company.com>', subject: 'Updated Holiday Policy', bodyPreview: 'Please review the attached document for the updated company holiday policy for next year.', isPhishing: false },
    { id: 'email-4', sender: 'CEO <ceo.ofice@companie.net>', subject: 'URGENT: Wire Transfer Request', bodyPreview: 'I need you to process an urgent wire transfer for a new vendor immediately.', isPhishing: true },
    { id: 'email-5', sender: 'Your Bank', subject: 'Security Alert: Suspicious Login', bodyPreview: 'We detected a suspicious login. Click this link to verify your account right away.', isPhishing: true },
];

const generateContentWithFallback = async <T,>(
    prompt: string,
    schema: object,
    fallback: T[]
): Promise<T[]> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            },
        });
        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);
        // Basic validation to ensure we got an array
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed as T[];
        }
        console.warn("Gemini response was not a valid array, using fallback data.");
        return fallback;
    } catch (e) {
        console.error("Error fetching or parsing Gemini response:", e);
        return fallback;
    }
};


export const generateDocumentScenario = async (): Promise<DocumentItem[]> => {
    const prompt = `Generate a list of 5 documents for a data security training game. Each document should have a unique id, a name, and a sensitivity level ('${DocumentSensitivity.PUBLIC}', '${DocumentSensitivity.INTERNAL}', or '${DocumentSensitivity.CONFIDENTIAL}'). Include at least one of each sensitivity level. Ensure document names are realistic for a corporate environment.`;
    return generateContentWithFallback<DocumentItem>(prompt, documentSchema, getFallbackDocuments());
};

export const generatePhishingScenario = async (): Promise<EmailItem[]> => {
    const prompt = 'Generate a list of 5 emails for a phishing detection game. Each email needs a unique id, a sender, a subject, a short body preview, and a boolean "isPhishing" flag. Include 2-3 phishing emails and the rest should be legitimate. Make the phishing attempts subtle and realistic.';
    return generateContentWithFallback<EmailItem>(prompt, emailSchema, getFallbackEmails());
};
