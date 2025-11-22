"use server"

import { generateObject } from "ai"
import { z } from "zod"
import { google } from "@ai-sdk/google"

const analysisSchema = z.object({
  isFruitOrVegetable: z.boolean().describe("Whether the image contains a fruit or vegetable"),
  freshness: z
    .enum(["Very Fresh", "Fresh", "Average", "Poor", "Spoiled"])
    .describe("The freshness level of the produce"),
  confidence: z.number().min(0).max(100).describe("Confidence score of the analysis (0-100)"),
  quality: z.enum(["excellent", "good", "average", "poor"]).describe("Overall quality rating"),
  damage: z.string().describe("Description of any visible damage, or 'None'"),
  spoilage: z.string().describe("Description of any visible spoilage, or 'None'"),
})

export async function analyzeImageAction(imageBase64: string) {
  try {
    console.log("[v0] Starting image analysis with Gemini API")

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("[v0] GOOGLE_GENERATIVE_AI_API_KEY is not set")
      throw new Error("AI service is not configured")
    }

    const imageData = imageBase64.startsWith("data:image") ? imageBase64.split(",")[1] : imageBase64

    const { object } = await generateObject({
      model: google("gemini-1.5-flash-001"),
      schema: analysisSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image. Identify if it is a fruit or vegetable. If it is, determine its freshness, quality, identify any damage, and provide a confidence score. If it is NOT a fruit or vegetable, set isFruitOrVegetable to false.",
            },
            {
              type: "image",
              image: imageData,
            },
          ],
        },
      ],
    })

    console.log("[v0] Image analysis completed:", object)
    return { success: true, data: object }
  } catch (error) {
    console.error("[v0] AI Analysis failed:", error)
    return { success: false, error: "Failed to analyze image" }
  }
}
