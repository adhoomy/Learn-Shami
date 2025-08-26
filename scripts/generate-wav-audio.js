import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration
const AUDIO_DIR = path.join(__dirname, '../public/audio');
const LESSON_CSV = path.join(__dirname, '../lessons/lesson1_greetings.csv');
const VOICE = 'alloy'; // Options: alloy, echo, fable, onyx, nova, shimmer
const MODEL = 'tts-1'; // Options: tts-1, tts-1-hd

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Parse CSV data
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const item = {};
    headers.forEach((header, index) => {
      item[header.trim()] = values[index]?.trim() || '';
    });
    data.push(item);
  }
  
  return data;
}

// Generate audio for a single text
async function generateAudio(text, filename) {
  try {
    console.log(`🎵 Generating WAV audio for: "${text}" -> ${filename.replace('.mp3', '.wav')}`);
    
    const mp3 = await openai.audio.speech.create({
      model: MODEL,
      voice: VOICE,
      input: text,
      response_format: 'wav', // Use WAV instead of MP3
    });
    
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const wavFilename = filename.replace('.mp3', '.wav');
    const filepath = path.join(AUDIO_DIR, wavFilename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Generated: ${wavFilename}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error.message);
    return false;
  }
}

// Main function
async function generateAllWavAudios() {
  try {
    console.log('🚀 Starting WAV audio generation for Learn Shami lessons...\n');
    
    // Read CSV file
    const csvContent = fs.readFileSync(LESSON_CSV, 'utf-8');
    const lessonData = parseCSV(csvContent);
    
    console.log(`📚 Found ${lessonData.length} lesson items\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Process each lesson item
    for (const item of lessonData) {
      if (!item.arabic || !item.audioUrl) {
        console.log(`⚠️  Skipping item without Arabic text or audioUrl: ${item.id}`);
        continue;
      }
      
      // Generate audio for Arabic text
      const success = await generateAudio(item.arabic, item.audioUrl);
      
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 WAV audio generation complete!');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📁 Audio files saved to: ${AUDIO_DIR}`);
    console.log(`🎵 All files are now in WAV format (working audio!)`);
    
  } catch (error) {
    console.error('💥 Error during audio generation:', error);
    process.exit(1);
  }
}

// Check if API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is required');
  console.log('\nTo set it up:');
  console.log('1. Get your API key from: https://platform.openai.com/api-keys');
  console.log('2. Create a .env.local file in your project root');
  console.log('3. Add: OPENAI_API_KEY=your_key_here');
  process.exit(1);
}

// Run the script
generateAllWavAudios();
