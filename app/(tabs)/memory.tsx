import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MemoryEntry {
  id: string;
  timestamp: string;
  content: string;
  type: "note" | "conversation";
}

export default function MemoryScreen() {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const stored = await AsyncStorage.getItem("friday_memories");
      if (stored) {
        setMemories(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load memories:", error);
    }
  };

  const clearMemories = async () => {
    Alert.alert("Clear Memory", "Are you sure you want to delete all memories?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("friday_memories");
            setMemories([]);
          } catch (error) {
            console.error("Failed to clear memories:", error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b border-white/5 bg-black/50">
          <Text className="text-xs font-bold text-purple-400 uppercase tracking-widest">
            💾 MEMORY CORE
          </Text>
          <Text className="text-xs text-white/40 mt-1">
            {memories.length} entries stored
          </Text>
        </View>

        {/* Content */}
        <View className="p-4">
          {memories.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-4xl mb-4">💾</Text>
              <Text className="text-white/40 text-sm text-center">
                No memories stored yet.{"\n"}
                Conversations will be saved here.
              </Text>
            </View>
          ) : (
            <>
              {memories.map((memory) => (
                <View
                  key={memory.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 mb-3"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                      {memory.type === "conversation" ? "💬 Conversation" : "📝 Note"}
                    </Text>
                    <Text className="text-xs text-white/40">{memory.timestamp}</Text>
                  </View>
                  <Text className="text-sm text-white/70 leading-relaxed">{memory.content}</Text>
                </View>
              ))}

              <TouchableOpacity
                onPress={clearMemories}
                className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <Text className="text-xs text-red-400 font-bold uppercase tracking-wider text-center">
                  🗑️ Clear All Memories
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Info */}
          <View className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <Text className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">
              ℹ️ Memory Storage
            </Text>
            <Text className="text-xs text-white/60 leading-relaxed">
              Your conversations and notes are stored locally on this device. This data is not
              synced to the cloud.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
