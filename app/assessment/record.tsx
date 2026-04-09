import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, type, shadow } from '../../lib/theme';
import { reset, setAudioUri, setPrompt } from '../../lib/assessmentStore';
import { useAppState, firstName } from '../../lib/profileStore';
import AudioWaveform from '../../components/AudioWaveform';
import { useTranslation } from '../../lib/i18n';

const MAX_SECONDS = 60;
const METERING_BUFFER_SIZE = 40;

const PROMPT_KEYS: Record<string, 'promptMemory' | 'promptLanguage' | 'promptAttention' | 'promptSleep' | 'promptSocial'> = {
  memory: 'promptMemory',
  language: 'promptLanguage',
  attention: 'promptAttention',
  sleep: 'promptSleep',
  social: 'promptSocial',
};

export default function RecordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { first } = useLocalSearchParams<{ first?: string }>();
  const { profile } = useAppState();
  const name = firstName(profile);
  const isFirst = first === '1';

  // Pick prompt based on focus areas
  const focusAreas = profile?.focusAreas ?? [];
  const promptKey = focusAreas.length > 0 && PROMPT_KEYS[focusAreas[0]]
    ? PROMPT_KEYS[focusAreas[0]]
    : 'promptDefault' as const;
  const prompt = t(promptKey);

  const [status, setStatus] = useState<'idle' | 'recording' | 'stopping'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [meteringValues, setMeteringValues] = useState<number[]>([]);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    reset();
    setPrompt(prompt);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      recordingRef.current?.stopAndUnloadAsync().catch(() => {});
    };
  }, []);

  const onRecordingStatusUpdate = useCallback((recordingStatus: Audio.RecordingStatus) => {
    if (recordingStatus.isRecording && recordingStatus.metering !== undefined) {
      setMeteringValues((prev) => {
        const next = [...prev, recordingStatus.metering as number];
        if (next.length > METERING_BUFFER_SIZE) {
          return next.slice(next.length - METERING_BUFFER_SIZE);
        }
        return next;
      });
    }
  }, []);

  async function start() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(t('micNeeded'), t('micNeededMsg'));
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      };

      const { recording } = await Audio.Recording.createAsync(
        recordingOptions,
        onRecordingStatusUpdate,
        100
      );
      recordingRef.current = recording;
      setStatus('recording');
      setElapsed(0);
      setMeteringValues([]);
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (next >= MAX_SECONDS) stop();
          return next;
        });
      }, 1000);
    } catch (err: any) {
      Alert.alert(t('couldNotStart'), err?.message ?? String(err));
    }
  }

  async function stop() {
    if (status !== 'recording') return;
    setStatus('stopping');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    try {
      const rec = recordingRef.current;
      if (!rec) return;
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      recordingRef.current = null;
      if (!uri) throw new Error('Recording produced no URI');
      setAudioUri(uri);
      router.replace('/assessment/analyzing');
    } catch (err: any) {
      Alert.alert(t('couldNotStop'), err?.message ?? String(err));
      setStatus('idle');
    }
  }

  const remaining = Math.max(0, MAX_SECONDS - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(1, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 16,
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={{ ...type.headlineSm, color: colors.primary }}>
          {isFirst ? t('firstCheckInHeader') : t('voiceAssessmentHeader')}
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, gap: 20, justifyContent: 'space-between', paddingBottom: 32 }}>
        {/* Prompt */}
        <View
          style={{
            backgroundColor: colors.surfaceContainerLowest,
            padding: 28,
            borderRadius: 32,
            gap: 12,
            marginTop: 16,
            ...shadow.card,
          }}
        >
          <Text style={{ ...type.labelMd, color: colors.secondary, letterSpacing: 1.2 }}>
            {isFirst ? t('firstPromptLabel', { name: name.toUpperCase() }) : t('yourPrompt')}
          </Text>
          <Text style={{ ...type.headlineMd, color: colors.primary, lineHeight: 32 }}>
            {prompt}
          </Text>
          <Text style={{ ...type.bodyMd, color: colors.onSurfaceVariant, marginTop: 8 }}>
            {t('speakNaturally')}
          </Text>
        </View>

        {/* Timer + Waveform + Record button */}
        <View style={{ alignItems: 'center', gap: 16 }}>
          <Text
            style={{
              fontSize: 64,
              fontWeight: '200',
              color: status === 'recording' ? colors.primary : colors.outline,
              fontVariant: ['tabular-nums'],
            }}
          >
            {mm}:{ss}
          </Text>

          <AudioWaveform
            isRecording={status === 'recording'}
            meteringValues={meteringValues}
          />

          <Pressable
            onPress={status === 'idle' ? start : stop}
            disabled={status === 'stopping'}
            style={({ pressed }) => ({
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor:
                status === 'recording' ? colors.error : colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
              ...shadow.card,
            })}
          >
            <MaterialIcons
              name={status === 'recording' ? 'stop' : 'mic'}
              size={56}
              color="#fff"
            />
          </Pressable>

          <Text style={{ ...type.bodyLg, color: colors.onSurfaceVariant, textAlign: 'center' }}>
            {status === 'idle' && t('tapToStart')}
            {status === 'recording' && t('listeningTap')}
            {status === 'stopping' && t('preparingAssessment')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
