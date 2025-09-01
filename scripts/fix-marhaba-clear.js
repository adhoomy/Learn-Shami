import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fixMarhabaClear() {
  try {
    console.log('Regenerating marhaba audio with different voices...');
    
    // Try with different voices for better clarity
    const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    
    for (const voice of voices) {
      console.log(`Trying voice: ${voice}`);
      
      const response = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: voice,
        input: "مرحبا",
        response_format: "wav"
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      const outputPath = path.join(__dirname, '..', 'public', 'audio', 'lesson1', `greet_0001_${voice}.wav`);
      
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Created greet_0001_${voice}.wav`);
    }
    
    console.log('All voice variations created. Test them and let me know which sounds clearest!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixMarhabaClear();
