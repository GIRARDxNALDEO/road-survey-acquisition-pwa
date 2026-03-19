export async function captureVideoFrame(
  video: HTMLVideoElement,
  width: number,
  height: number,
  quality: number
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Impossible de créer le contexte canvas.');
  }

  context.drawImage(video, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (generated) => {
        if (!generated) {
          reject(new Error('Aucune image générée.'));
          return;
        }
        resolve(generated);
      },
      'image/jpeg',
      quality
    );
  });

  return { blob, width, height };
}
