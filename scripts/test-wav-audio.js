import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testWavAudio() {
  try {
    console.log('🧪 Testing WAV audio generation...\n');
    
    const testText = 'مرحبا';
    const outputPath = path.join(__dirname, '../public/audio/test_wav.wav');
    
    console.log(`📝 Text: "${testText}"`);
    console.log(`🎯 Output: ${outputPath}`);
    console.log(`🔧 Model: tts-1`);
    console.log(`🎤 Voice: alloy`);
    console.log(`📁 Format: WAV\n`);
    
    // Generate audio in WAV format
    const audio = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: testText,
      response_format: 'wav', // Use WAV instead of MP3
    });
    
    // Save to file
    const buffer = Buffer.from(await audio.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    
    // Get file info
    const stats = fs.statSync(outputPath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    
    console.log('✅ WAV audio generated successfully!');
    console.log(`📁 File: test_wav.wav`);
    console.log(`📏 Size: ${fileSizeInKB} KB`);
    console.log(`📍 Path: ${outputPath}`);
    
    // Test file header for WAV
    const fileHeader = buffer.slice(0, 12);
    console.log(`🔍 File header: ${fileHeader.toString('hex')}`);
    
    // Check if it looks like WAV (should start with "RIFF")
    if (fileHeader.toString('ascii', 0, 4) === 'RIFF') {
      console.log('✅ File appears to be valid WAV');
    } else {
      console.log('⚠️  File may not be valid WAV format');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response details:', error.response.data);
    }
  }
}

// Check if API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

// Run the test
testWavAudio();
