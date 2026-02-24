# Voice Input Features

This document describes the voice input and transcription capabilities of Friday AI Mobile.

## Overview

Friday AI Mobile now supports voice input for hands-free interaction. Users can:
- Record voice messages using the microphone button
- Automatically transcribe speech to text using Gemini AI
- Send transcribed messages to Friday AI for processing
- See voice messages marked with a 🎤 indicator

## Features

### 1. Voice Recording
- **Button**: Purple microphone button in the chat input area
- **Duration**: Unlimited recording length (shows elapsed time)
- **Feedback**: 
  - Haptic feedback when starting/stopping recording
  - Visual indicator showing recording status
  - Real-time duration counter

### 2. Voice Transcription
- **Technology**: Google Gemini AI speech-to-text
- **Supported Formats**: WAV, MP3, OGG, M4A
- **Accuracy**: High-quality transcription with context awareness
- **Processing**: Automatic after recording stops

### 3. User Experience
- **Visual Feedback**: Recording indicator with duration
- **Voice Indicator**: Messages sent via voice are marked with 🎤
- **Error Handling**: Clear error messages if recording or transcription fails
- **Permissions**: Automatic permission requests on iOS and Android

## Technical Implementation

### Files
- `utils/voice.ts` - Voice recording and transcription utilities
- `app/(tabs)/chat.tsx` - Chat interface with voice input
- `app.config.ts` - Audio permissions configuration

### Dependencies
- `expo-audio` - Audio recording and playback
- `expo-file-system` - File handling for audio data
- `expo-haptics` - Haptic feedback
- `@google/genai` - Gemini API for transcription

### Audio Pipeline
```
User presses 🎤
    ↓
startRecording() initializes Audio.Recording
    ↓
User speaks into microphone
    ↓
User presses Stop (or timeout)
    ↓
stopRecording() saves audio file
    ↓
transcribeAudio() sends to Gemini API
    ↓
Gemini returns transcribed text
    ↓
handleSend() sends transcribed text as chat message
    ↓
Friday AI responds
```

## API Configuration

### Gemini API Setup
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create or copy your API key
3. Add to `.env.local`:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
   ```

### Permissions

#### iOS
- **Microphone**: Requested automatically
- **Info.plist**: `NSMicrophoneUsageDescription` configured
- **Local Network**: Configured for API communication

#### Android
- **RECORD_AUDIO**: Requested automatically
- **INTERNET**: Required for API calls
- **Manifest**: Permissions configured in `app.config.ts`

## Usage

### Recording Voice
1. Tap the purple 🎤 button
2. Speak your message
3. Tap "Stop" or wait for auto-stop
4. Audio is automatically transcribed
5. Transcribed text is sent to Friday AI

### Keyboard Input (Alternative)
1. Type your message in the text field
2. Tap "Send" button (cyan)
3. Message is sent to Friday AI

### Switching Between Input Methods
- While recording: Only "Stop" button is visible
- While typing: Both 🎤 and "Send" buttons are visible
- During processing: All input buttons are disabled

## Error Handling

### Common Issues

**"Failed to start recording"**
- Check microphone permissions
- Ensure audio hardware is available
- Try restarting the app

**"Failed to transcribe audio"**
- Verify Gemini API key is set
- Check internet connection
- Ensure audio file was created successfully

**"Microphone permission denied"**
- Grant permission in device settings
- App → Permissions → Microphone → Allow

## Future Enhancements

- [ ] Voice output (text-to-speech responses)
- [ ] Audio playback of AI responses
- [ ] Voice activity detection (auto-stop)
- [ ] Noise cancellation
- [ ] Multiple language support
- [ ] Voice command shortcuts
- [ ] Audio message history

## Troubleshooting

### Voice not working on iOS
1. Check Settings → Privacy → Microphone
2. Ensure app has microphone permission
3. Try restarting the app
4. Check iOS version (requires iOS 13+)

### Voice not working on Android
1. Check Settings → Apps → Permissions → Microphone
2. Ensure app has RECORD_AUDIO permission
3. Check device has working microphone
4. Try restarting the app

### Transcription errors
1. Verify internet connection
2. Check Gemini API key is valid
3. Ensure audio file is not corrupted
4. Try shorter audio clips
5. Check API quota hasn't been exceeded

## Performance Notes

- Recording uses minimal CPU/memory
- Transcription typically takes 2-5 seconds
- Audio files are temporary and deleted after transcription
- No audio data is stored permanently unless user saves it

## Privacy

- Audio is only sent to Google Gemini API for transcription
- Audio files are deleted after processing
- No audio is stored on device or sent to other services
- User data is handled according to Google's privacy policy
