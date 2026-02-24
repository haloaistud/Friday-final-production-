import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MemoryEntry {
  id: string;
  timestamp: string;
  content: string;
  type: "note" | "conversation";
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
    color: "#d8b4fe",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  memoryCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  memoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  memoryType: {
    fontSize: 12,
    color: "#d8b4fe",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  memoryTime: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  memoryContent: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
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
  clearButton: {
    marginTop: 24,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 12,
    color: "#f87171",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  infoCard: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(168,85,247,0.1)",
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.2)",
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 12,
    color: "#d8b4fe",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 18,
  },
});

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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💾 MEMORY CORE</Text>
          <Text style={styles.headerSubtitle}>{memories.length} entries stored</Text>
        </View>

        <View style={styles.content}>
          {memories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💾</Text>
              <Text style={styles.emptyText}>
                No memories stored yet.{"\n"}
                Conversations will be saved here.
              </Text>
            </View>
          ) : (
            <>
              {memories.map((memory) => (
                <View key={memory.id} style={styles.memoryCard}>
                  <View style={styles.memoryHeader}>
                    <Text style={styles.memoryType}>
                      {memory.type === "conversation" ? "💬 Conversation" : "📝 Note"}
                    </Text>
                    <Text style={styles.memoryTime}>{memory.timestamp}</Text>
                  </View>
                  <Text style={styles.memoryContent}>{memory.content}</Text>
                </View>
              ))}

              <TouchableOpacity onPress={clearMemories} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>🗑️ Clear All Memories</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>ℹ️ Memory Storage</Text>
            <Text style={styles.infoText}>
              Your conversations and notes are stored locally on this device. This data is not
              synced to the cloud.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
