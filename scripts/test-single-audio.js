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

async function testSingleAudio() {
  try {
    console.log('🧪 Testing single audio generation...\n');
    
    const testText = 'مرحبا';
    const outputPath = path.join(__dirname, '../public/audio/test_single.mp3');
    
    console.log(`📝 Text: "${testText}"`);
    console.log(`🎯 Output: ${outputPath}`);
    console.log(`🔧 Model: tts-1`);
    console.log(`🎤 Voice: alloy\n`);
    
    // Generate audio
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: testText,
      response_format: 'mp3', // Explicitly specify format
    });
    
    // Save to file
    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    
    // Get file info
    const stats = fs.statSync(outputPath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    
    console.log('✅ Audio generated successfully!');
    console.log(`📁 File: test_single.mp3`);
    console.log(`📏 Size: ${fileSizeInKB} KB`);
    console.log(`📍 Path: ${outputPath}`);
    
    // Test file header
    const fileHeader = buffer.slice(0, 10);
    console.log(`🔍 File header: ${fileHeader.toString('hex')}`);
    
    // Check if it looks like MP3
    if (fileHeader[0] === 0xFF && (fileHeader[1] & 0xE0) === 0xE0) {
      console.log('✅ File appears to be valid MP3');
    } else {
      console.log('⚠️  File may not be valid MP3 format');
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
testSingleAudio();
