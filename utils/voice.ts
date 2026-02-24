import * as Audio from "expo-audio";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

export interface VoiceRecordingState {
  isRecording: boolean;
  recordingDuration: number;
  recordingUri: string | null;
}

let recording: Audio.Recording | null = null;
let recordingStartTime = 0;

export async function initializeAudio() {
  try {
    if (Platform.OS !== "web") {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpiece: false,
      });
    }
  } catch (error) {
    console.error("Failed to initialize audio:", error);
  }
}

export async function startRecording(): Promise<string | null> {
  try {
    if (recording) {
      console.warn("Recording already in progress");
      return null;
    }

    const newRecording = new Audio.Recording();
    await newRecording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await newRecording.startAsync();

    recording = newRecording;
    recordingStartTime = Date.now();

    return null; // Recording started successfully
  } catch (error) {
    console.error("Failed to start recording:", error);
    return null;
  }
}

export async function stopRecording(): Promise<string | null> {
  try {
    if (!recording) {
      console.warn("No recording in progress");
      return null;
    }

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;

    return uri;
  } catch (error) {
    console.error("Failed to stop recording:", error);
    return null;
  }
}

export function getRecordingDuration(): number {
  if (!recording) return 0;
  return Math.floor((Date.now() - recordingStartTime) / 1000);
}

export function isRecording(): boolean {
  return recording !== null;
}

export async function playAudio(uri: string): Promise<void> {
  try {
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri });
    await soundObject.playAsync();
  } catch (error) {
    console.error("Failed to play audio:", error);
  }
}

export async function transcribeAudio(
  audioUri: string,
  apiKey: string
): Promise<string | null> {
  try {
    // Read audio file as base64
    const audioData = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Call Gemini API with audio
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "audio/wav",
                    data: audioData,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const data = await response.json();
    const transcribedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || null;

    return transcribedText;
  } catch (error) {
    console.error("Failed to transcribe audio:", error);
    return null;
  }
}
