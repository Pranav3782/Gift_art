'use server';
/**
 * @fileOverview AI Custom Design Flow
 * Uses Gemini 2.5 Flash Image to transform a product image based on user instructions.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CustomDesignInputSchema = z.object({
  productImage: z.string().describe("The base product image as a data URI."),
  prompt: z.string().describe("User prompt for customization."),
  name: z.string().optional().describe("Name to add to the design."),
  instructions: z.string().optional().describe("Additional special instructions.")
});

export type CustomDesignInput = z.infer<typeof CustomDesignInputSchema>;

const CustomDesignOutputSchema = z.object({
  generatedImageUrl: z.string().describe("The URL of the AI generated design.")
});

export type CustomDesignOutput = z.infer<typeof CustomDesignOutputSchema>;

export async function generateCustomDesign(input: CustomDesignInput): Promise<CustomDesignOutput> {
  const { productImage, prompt, name, instructions } = input;
  
  const fullPrompt = `Transform this product image based on the following customization:
  User Prompt: ${prompt}
  ${name ? `Include the name: "${name}"` : ""}
  ${instructions ? `Follow these special instructions: ${instructions}` : ""}
  
  Maintain the shape and core functionality of the original product but apply the requested visual changes. 
  The output should look premium and realistic.`;

  try {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      prompt: [
        { media: { url: productImage } },
        { text: fullPrompt },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error("Failed to generate design preview.");
    }

    return { generatedImageUrl: media.url };
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
