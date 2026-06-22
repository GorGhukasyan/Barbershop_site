export function buildVisualizerPrompt(hairstylePrompt: string): string {
  return `You are a professional photo editor for a barbershop.

TASK: Apply a new hairstyle to the person in this photo.

HAIRSTYLE TO APPLY: ${hairstylePrompt}

IMPORTANT RULES:
1. Keep the person's face, skin tone, and facial features EXACTLY the same
2. Only change the hair and/or beard as described
3. Make the result look realistic and natural, like a real photograph
4. Maintain the same lighting and background
5. The result should look like this person actually got this haircut
6. Do NOT add any text, watermarks, or filters to the image

Generate a realistic photo of this person with the specified hairstyle.`;
}
