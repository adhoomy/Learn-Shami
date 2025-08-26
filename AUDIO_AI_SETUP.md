# AI Audio Generation Setup

## Quick Start

### 1. Get OpenAI API Key
- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Create a new API key
- Copy the key

### 2. Set Environment Variable
Create or edit `.env.local` in your project root:
```bash
OPENAI_API_KEY=sk-your-key-here
```

### 3. Generate All Audios
```bash
npm run generate-audio
```

## What It Does

- ✅ Reads your lesson CSV automatically
- ✅ Generates MP3 files for each Arabic text
- ✅ Uses OpenAI's TTS-1 model with 'alloy' voice
- ✅ Saves files with correct naming (greet_0001.mp3, etc.)
- ✅ Includes rate limiting and error handling
- ✅ Shows progress and results

## Configuration Options

Edit `scripts/generate-audio.js` to customize:

```javascript
const VOICE = 'alloy';     // alloy, echo, fable, onyx, nova, shimmer
const MODEL = 'tts-1';     // tts-1, tts-1-hd (HD is higher quality)
```

## Voice Samples

- **alloy**: Neutral, clear pronunciation
- **echo**: Warm, friendly
- **fable**: Storytelling style
- **onyx**: Deep, authoritative
- **nova**: Bright, energetic
- **shimmer**: Soft, gentle

## Cost Estimate

For your 20 lesson items:
- **TTS-1**: ~$0.01-0.02 total
- **TTS-1-HD**: ~$0.02-0.04 total

## Troubleshooting

### API Key Error
```
❌ OPENAI_API_KEY environment variable is required
```
**Solution**: Check your `.env.local` file and restart terminal

### Rate Limiting
```
❌ Failed to generate: Rate limit exceeded
```
**Solution**: Script includes 1-second delays, but you can increase if needed

### Audio Quality Issues
**Solution**: Try different voices or switch to TTS-1-HD model

## Next Steps

1. Run `npm run generate-audio`
2. Check `public/audio/` for generated files
3. Test playback in your lesson viewer
4. Adjust voice/model if needed

## Manual Generation

To generate audio for specific text:
```bash
node -e "
import OpenAI from 'openai';
const openai = new OpenAI({apiKey: 'your-key'});
// Add your custom generation code here
"
```
