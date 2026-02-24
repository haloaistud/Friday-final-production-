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
} from "react-native";
import { GoogleGenAI } from "@google/genai";
import * as Haptics from "expo-haptics";
import {
  initializeAudio,
  startRecording,
  stopRecording,
  getRecordingDuration,
  isRecording,
  transcribeAudio,
} from "@/utils/voice";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  sources?: { uri: string; title: string }[];
  isVoice?: boolean;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const chatRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
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
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsRecordingAudio(false);

      const audioUri = await stopRecording();
      if (!audioUri) {
        Alert.alert("Error", "Failed to stop recording");
        return;
      }

      // Show transcribing indicator
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
    <View className={`flex-row mb-4 ${item.role === "user" ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-xs p-3 rounded-lg ${
          item.role === "user"
            ? "bg-white/10 border border-white/20"
            : "bg-cyan-500/10 border border-cyan-500/30"
        }`}
      >
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-xs font-bold text-white/60 uppercase tracking-wider">
            {item.role === "user" ? "You" : "Friday"}
          </Text>
          {item.isVoice && <Text className="text-xs">🎤</Text>}
        </View>
        <Text
          className={`text-sm leading-relaxed ${
            item.role === "user" ? "text-white/80" : "text-cyan-400"
          }`}
        >
          {item.text}
        </Text>

        {item.sources && item.sources.length > 0 && (
          <View className="mt-3 pt-3 border-t border-cyan-500/20">
            <Text className="text-xs text-cyan-400/70 font-bold mb-2 uppercase tracking-wider">
              Sources
            </Text>
            {item.sources.map((src, idx) => (
              <Text key={idx} className="text-xs text-cyan-400 mb-1">
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
      className="flex-1 bg-black"
    >
      <SafeAreaView className="flex-1 bg-black">
        {/* Header */}
        <View className="px-4 py-4 border-b border-white/5 bg-black/50">
          <Text className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            💬 TEXT UPLINK
          </Text>
          <Text className="text-xs text-white/40 mt-1">Model: Gemini 3 Flash | Voice: Enabled</Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-4xl mb-4">💬</Text>
              <Text className="text-white/40 text-sm text-center">
                Start a conversation with Friday AI{"\n"}
                Use text or voice input
              </Text>
            </View>
          }
        />

        {isTyping && (
          <View className="px-4 py-2">
            <View className="flex-row items-center bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
              <ActivityIndicator color="#00d4ff" size="small" />
              <Text className="text-xs text-cyan-400 ml-2 uppercase tracking-wider">
                Processing...
              </Text>
            </View>
          </View>
        )}

        {/* Input */}
        <View className="px-4 py-4 border-t border-white/5 bg-black/50">
          {isRecordingAudio && (
            <View className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <Text className="text-xs text-red-400 font-bold uppercase tracking-wider">
                  Recording: {recordingDuration}s
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleStopRecording}
                className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded"
              >
                <Text className="text-xs text-red-400 font-bold">Stop</Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row items-center gap-2">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Friday..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              editable={!isTyping && !isRecordingAudio}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm"
            />

            {!isRecordingAudio ? (
              <>
                <TouchableOpacity
                  onPress={handleStartRecording}
                  disabled={isTyping}
                  className={`px-4 py-3 rounded-lg ${
                    isTyping
                      ? "bg-purple-500/30 opacity-50"
                      : "bg-purple-500/20 border border-purple-500/50"
                  }`}
                >
                  <Text className="text-purple-400 font-bold text-lg">🎤</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  className={`px-4 py-3 rounded-lg ${
                    isTyping || !input.trim()
                      ? "bg-cyan-500/30 opacity-50"
                      : "bg-cyan-500/20 border border-cyan-500/50"
                  }`}
                >
                  <Text className="text-cyan-400 font-bold text-sm">Send</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
