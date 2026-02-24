import React from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";

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
    color: "#fbbf24",
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
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fbbf24",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  metricRow: {
    marginBottom: 16,
  },
  metricLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metricLabelText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  metricValue: {
    fontSize: 12,
    color: "#fff",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  protocolItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    marginBottom: 12,
  },
  protocolLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  protocolStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  protocolStatusText: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoCard: {
    backgroundColor: "rgba(0,212,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoTitle: {
    fontSize: 12,
    color: "#00d4ff",
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

export default function LiveScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⚡ LIVE UPLINK</Text>
          <Text style={styles.headerSubtitle}>Audio Node Active</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 System Status</Text>

            <View style={styles.metricRow}>
              <View style={styles.metricLabel}>
                <Text style={styles.metricLabelText}>CPU LOAD</Text>
                <Text style={styles.metricValue}>12%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={{ height: "100%", width: "12%", backgroundColor: "rgba(255,255,255,0.5)" }} />
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricLabel}>
                <Text style={styles.metricLabelText}>MEMORY INTEGRITY</Text>
                <Text style={{ fontSize: 12, color: "#fbbf24" }}>100%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={{ height: "100%", width: "100%", backgroundColor: "#fbbf24" }} />
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricLabel}>
                <Text style={styles.metricLabelText}>RESPONSE TIME</Text>
                <Text style={{ fontSize: 12, color: "#10b981" }}>45ms</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={{ height: "100%", width: "20%", backgroundColor: "#10b981" }} />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Protocols</Text>

            {["VOICE_SYNTH", "VISUAL_CORE", "TEXT_UPLINK", "SENTIMENT", "SECURE_KEY"].map(
              (protocol, idx) => (
                <View key={idx} style={styles.protocolItem}>
                  <Text style={styles.protocolLabel}>{protocol}</Text>
                  <View style={styles.protocolStatus}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#10b981" }} />
                    <Text style={styles.protocolStatusText}>ACTIVE</Text>
                  </View>
                </View>
              )
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>ℹ️ Live Mode</Text>
            <Text style={styles.infoText}>
              Audio-based interaction with Friday AI. Voice input and output enabled. All systems
              nominal.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
