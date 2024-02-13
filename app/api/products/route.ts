import { AstraDB } from "@datastax/astra-db-ts";
import { FindOptions } from "@datastax/astra-db-ts/dist/collections";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


// Environment variables
const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT, GOOGLE_API_KEY } =
  process.env;

// Connect to Astra
const db = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT);

// Connect to Google GenAI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY || "");
const gemini_model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
const embeddings_model = genAI.getGenerativeModel({ model: "embedding-001" });

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Prompt that gets sent to the model
        const prompt = 'describe the clothing items worn in this photo';
        // Image part that gets sent to the model
        const imagePart = {
            inlineData: {
                data: data.imageBase64,
                mimeType: data.fileType,
            },
        };

        const geminiResponse = await gemini_model.generateContent([prompt, imagePart]);

        // Create embeddings of product description 
        const searchPrompt = geminiResponse.response.text();
        const result = await embeddings_model.embedContent(searchPrompt);
        const embedding = result.embedding;
        const vector = embedding.values;

        const collection = await db.collection("fashion_buddy");

        // search for similar items on Astra
        // const metadataFilter = {category: 'TOPS'}
        const options: FindOptions = {
            sort: {
                "$vector": vector
            },
            limit: 10,
            includeSimilarity: true,
            projection: {
                '$vector': 0
            }
        };

        const cursor = collection.find({}, options);

        const docs = await cursor.toArray();

        return NextResponse.json({ message: geminiResponse.response.text(), products: docs }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
