/*
    IMPLEMENTATION PLAN
        PHASE 1:INDEXING
            1. LOAD THE DOCUMENT (PDF,TEXT)
            2. CHUNK THE DOCUMENT
            3. GENERATE VECTOR EMBEDDINGS
            4. STORE THE VECTOR EMBEDDINGS -> VECTOR DB
        PHASE 2:CHATBOT
            1. SETUP LLM
            2. ADD RETRIEVAL STEPS
            3. PASS INPUT + RELEVANT INFO TO LLM
            4. RETURN THE RESPONSE


*/
import {indexTheDocument}from "./prepare.js";
const filePath = './dummy-doc.pdf'
indexTheDocument(filePath);
