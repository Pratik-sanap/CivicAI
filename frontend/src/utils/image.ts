export async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to read the selected file.'));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error('Unable to read the selected file.'));
    };

    reader.readAsDataURL(file);
  });
}
