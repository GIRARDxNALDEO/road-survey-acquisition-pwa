export async function startRearCamera(width: number, height: number) {
  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: width },
      height: { ideal: height }
    }
  };
  return navigator.mediaDevices.getUserMedia(constraints);
}

export function stopMediaStream(stream?: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}
