import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";

export default function LiveScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b border-white/5 bg-black/50">
          <Text className="text-xs font-bold text-yellow-400 uppercase tracking-widest">
            ⚡ LIVE UPLINK
          </Text>
          <Text className="text-xs text-white/40 mt-1">Audio Node Active</Text>
        </View>

        {/* Content */}
        <View className="p-4">
          {/* Status Card */}
          <View className="bg-white/5 border border-white/10 rounded-lg p-6 mb-4">
            <Text className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">
              📊 System Status
            </Text>

            <View className="space-y-4">
              <View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-white/40">CPU LOAD</Text>
                  <Text className="text-xs text-white">12%</Text>
                </View>
                <View className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <View className="h-full w-3/12 bg-white/50" />
                </View>
              </View>

              <View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-white/40">MEMORY INTEGRITY</Text>
                  <Text className="text-xs text-yellow-400">100%</Text>
                </View>
                <View className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <View className="h-full w-full bg-yellow-400" />
                </View>
              </View>

              <View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-white/40">RESPONSE TIME</Text>
                  <Text className="text-xs text-emerald-400">45ms</Text>
                </View>
                <View className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <View className="h-full w-2/12 bg-emerald-400" />
                </View>
              </View>
            </View>
          </View>

          {/* Protocols */}
          <View className="bg-white/5 border border-white/10 rounded-lg p-6">
            <Text className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
              Protocols
            </Text>

            <View className="space-y-3">
              {["VOICE_SYNTH", "VISUAL_CORE", "TEXT_UPLINK", "SENTIMENT", "SECURE_KEY"].map(
                (protocol, idx) => (
                  <View
                    key={idx}
                    className="flex-row justify-between items-center p-3 bg-white/[0.02] rounded border border-white/5"
                  >
                    <Text className="text-xs text-white/40 font-bold uppercase tracking-wider">
                      {protocol}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <Text className="text-xs text-emerald-500 font-bold uppercase">ACTIVE</Text>
                    </View>
                  </View>
                )
              )}
            </View>
          </View>

          {/* Info */}
          <View className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <Text className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
              ℹ️ Live Mode
            </Text>
            <Text className="text-xs text-white/60 leading-relaxed">
              Audio-based interaction with Friday AI. Voice input and output enabled. All systems
              nominal.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
