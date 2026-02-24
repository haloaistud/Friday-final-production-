import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
} from "react-native";
import { GoogleGenAI } from "@google/genai";
import * as Haptics from "expo-haptics";
import {
  initializeAudio,
  startRecording,
  stopRecording,
  transcribeAudio,
} from "@/utils/voice";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  sources?: { uri: string; title: string }[];
  isVoice?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#00d4ff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    marginTop: 4,
  },
  messageContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  userBubble: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  aiBubble: {
    backgroundColor: "rgba(0,212,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.3)",
  },
  messageLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: "rgba(255,255,255,0.8)",
  },
  aiText: {
    color: "#00d4ff",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  sendButton: {
    backgroundColor: "rgba(0,212,255,0.2)",
    borderColor: "rgba(0,212,255,0.5)",
  },
  voiceButton: {
    backgroundColor: "rgba(168,85,247,0.2)",
    borderColor: "rgba(168,85,247,0.5)",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  sendButtonText: {
    color: "#00d4ff",
  },
  voiceButtonText: {
    color: "#a855f7",
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    justifyContent: "space-between",
  },
  recordingText: {
    fontSize: 12,
    color: "#f87171",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,212,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.3)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  typingText: {
    fontSize: 12,
    color: "#00d4ff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    textAlign: "center",
  },
});

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const chatRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const recordingIntervalRef = useRef<any>(null);
  const apiKeyRef = useRef<string>(
    process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.API_KEY || ""
  );

  useEffect(() => {
    initializeAudio();
  }, []);

  const initChat = () => {
    if (!chatRef.current) {
      if (!apiKeyRef.current) {
        Alert.alert("Error", "Gemini API key not configured");
        return;
      }
      const ai = new GoogleGenAI({ apiKey: apiKeyRef.current });
      chatRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction:
            "You are FRIDAY, a highly advanced AI assistant. Respond intelligently, concisely, and helpfully.",
          tools: [{ googleSearch: {} }],
        },
      });
    }
  };

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText || isTyping) return;

    initChat();
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        text: messageText,
        isVoice: !!textToSend,
      },
    ]);
    setIsTyping(true);

    try {
      const responseStream = await chatRef.current.sendMessageStream({
        message: messageText,
      });
      const aiMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: aiMsgId, role: "model", text: "" }]);

      let aiText = "";
      let aiSources: { uri: string; title: string }[] = [];

      for await (const chunk of responseStream) {
        if (chunk.text) {
          aiText += chunk.text;
        }

        const chunks = chunk.groundingMetadata?.groundingChunks;
        if (chunks && Array.isArray(chunks)) {
          chunks.forEach((gChunk: any) => {
            if (gChunk.web?.uri && gChunk.web?.title) {
              if (!aiSources.some((s) => s.uri === gChunk.web.uri)) {
                aiSources.push({ uri: gChunk.web.uri, title: gChunk.web.title });
              }
            }
          });
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, text: aiText, sources: [...aiSources] } : msg
          )
        );
      }
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "model", text: `[ERROR: ${error.message}]` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      setIsRecordingAudio(true);
      setRecordingDuration(0);

      await startRecording();

      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Failed to start recording");
      setIsRecordingAudio(false);
    }
  };

  const handleStopRecording = async () => {
    try {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }

      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setIsRecordingAudio(false);

      const audioUri = await stopRecording();
      if (!audioUri) {
        Alert.alert("Error", "Failed to stop recording");
        return;
      }

      setIsTyping(true);

      const transcribedText = await transcribeAudio(audioUri, apiKeyRef.current);

      if (transcribedText) {
        await handleSend(transcribedText);
      } else {
        Alert.alert("Error", "Failed to transcribe audio");
        setIsTyping(false);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      Alert.alert("Error", "Failed to stop recording");
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={{ flexDirection: item.role === "user" ? "row-reverse" : "row", marginBottom: 16 }}>
      <View style={[styles.messageBubble, item.role === "user" ? styles.userBubble : styles.aiBubble]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Text style={styles.messageLabel}>
            {item.role === "user" ? "You" : "Friday"}
          </Text>
          {item.isVoice && <Text>🎤</Text>}
        </View>
        <Text style={[styles.messageText, item.role === "user" ? styles.userText : styles.aiText]}>
          {item.text}
        </Text>

        {item.sources && item.sources.length > 0 && (
          <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(0,212,255,0.2)" }}>
            <Text style={{ fontSize: 10, color: "rgba(0,212,255,0.7)", fontWeight: "bold", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Sources
            </Text>
            {item.sources.map((src, idx) => (
              <Text key={idx} style={{ fontSize: 10, color: "#00d4ff", marginBottom: 4 }}>
                🔗 {src.title}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💬 TEXT UPLINK</Text>
          <Text style={styles.headerSubtitle}>Model: Gemini 3 Flash | Voice: Enabled</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyText}>
                Start a conversation with Friday AI{"\n"}
                Use text or voice input
              </Text>
            </View>
          }
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator color="#00d4ff" size="small" />
            <Text style={styles.typingText}>Processing...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          {isRecordingAudio && (
            <View style={styles.recordingIndicator}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#ef4444" }} />
                <Text style={styles.recordingText}>Recording: {recordingDuration}s</Text>
              </View>
              <TouchableOpacity
                onPress={handleStopRecording}
                style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "rgba(239,68,68,0.2)", borderWidth: 1, borderColor: "rgba(239,68,68,0.5)", borderRadius: 4 }}
              >
                <Text style={{ fontSize: 12, color: "#f87171", fontWeight: "bold" }}>Stop</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Friday..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              editable={!isTyping && !isRecordingAudio}
              style={styles.textInput}
            />

            {!isRecordingAudio ? (
              <>
                <TouchableOpacity
                  onPress={handleStartRecording}
                  disabled={isTyping}
                  style={[styles.button, styles.voiceButton, isTyping && { opacity: 0.5 }]}
                >
                  <Text style={[styles.buttonText, styles.voiceButtonText]}>🎤</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  style={[styles.button, styles.sendButton, (isTyping || !input.trim()) && { opacity: 0.5 }]}
                >
                  <Text style={[styles.buttonText, styles.sendButtonText]}>Send</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
