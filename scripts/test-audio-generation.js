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

async function testAudioGeneration() {
  try {
    console.log('🧪 Testing OpenAI TTS setup...\n');
    
    // Test text (simple Arabic greeting)
    const testText = 'مرحبا';
    const testFilename = 'test_greeting.mp3';
    const audioDir = path.join(__dirname, '../public/audio');
    
    // Ensure audio directory exists
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    console.log(`📝 Generating audio for: "${testText}"`);
    console.log(`🎯 Using voice: alloy`);
    console.log(`🔧 Using model: tts-1\n`);
    
    // Generate audio
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: testText,
    });
    
    // Save to file
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const filepath = path.join(audioDir, testFilename);
    fs.writeFileSync(filepath, buffer);
    
    // Get file size
    const stats = fs.statSync(filepath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    
    console.log('✅ Test successful!');
    console.log(`📁 File saved: ${testFilename}`);
    console.log(`📏 File size: ${fileSizeInKB} KB`);
    console.log(`📍 Location: ${filepath}`);
    console.log('\n🎉 Your OpenAI TTS setup is working correctly!');
    console.log('🚀 You can now run: npm run generate-audio');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n💡 This looks like an API key issue. Check:');
      console.log('1. Your .env.local file has OPENAI_API_KEY=sk-...');
      console.log('2. The API key is valid and has credits');
      console.log('3. You\'ve restarted your terminal after adding the key');
    } else if (error.message.includes('rate limit')) {
      console.log('\n💡 Rate limit exceeded. Wait a moment and try again.');
    } else {
      console.log('\n💡 Check your internet connection and try again.');
    }
    
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
  console.log('4. Restart your terminal');
  process.exit(1);
}

// Run the test
testAudioGeneration();
