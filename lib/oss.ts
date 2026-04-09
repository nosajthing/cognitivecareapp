// Alibaba Cloud OSS upload for audio files (public read-write bucket)

import * as FileSystem from 'expo-file-system/legacy';

const BUCKET = process.env.EXPO_PUBLIC_OSS_BUCKET ?? 'phdemotest';
const REGION = process.env.EXPO_PUBLIC_OSS_REGION ?? 'oss-cn-shanghai';
const ENDPOINT = `https://${BUCKET}.${REGION}.aliyuncs.com`;

/**
 * Upload a local audio file to OSS and return its public URL.
 * No signing needed — bucket is public read-write.
 */
export async function uploadAudioToOSS(localUri: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: 'base64' as any,
  });

  // Convert base64 to binary array for fetch body
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  const key = `audio/${Date.now()}.m4a`;

  const res = await fetch(`${ENDPOINT}/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'audio/m4a',
    },
    body: bytes,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OSS upload failed (${res.status}): ${txt}`);
  }

  const url = `${ENDPOINT}/${key}`;
  console.log('[OSS] Uploaded:', url);
  return url;
}
