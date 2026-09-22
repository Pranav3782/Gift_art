/**
 * @fileOverview Genkit Initialization
 * Enabled with Google AI plugin for image generation.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
});
