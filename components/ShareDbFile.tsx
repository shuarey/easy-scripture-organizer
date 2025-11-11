export async function shareDbFile(dbFilePath?: string) {
  if (!dbFilePath) {
    console.warn(`shareDbFile: no dbFilePath provided ${dbFilePath}`);
    return;
  }

  // Lazy-import native modules so Metro can keep them out of the initial bundle
  const FileSystem = await import('expo-file-system/legacy');
  const FS: any = FileSystem;
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const now = new Date();
  const ts = `${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${now.getHours()}:${pad(now.getMinutes())}`;
  const fileUri = FS.documentDirectory + `verse-mark ${ts}.db`;
  
  try {
    await FS.copyAsync({ from: dbFilePath, to: fileUri });

    const Sharing = await import('expo-sharing');
    const shareModule: any = Sharing;
    if (shareModule && shareModule.isAvailableAsync) {
        const sharingAvailable = await shareModule.isAvailableAsync();
        if (sharingAvailable) {
            await shareModule.shareAsync(fileUri, { dialogTitle: 'Share database file' });
        } else {
            console.warn('expo-sharing is not available on this device');
        }
    } else if (shareModule && shareModule.shareAsync) {
        await shareModule.shareAsync(fileUri, { dialogTitle: 'Share database file' });
    } else {
        console.warn('No sharing module available to share the DB file');
    }
  } catch (err) {
        console.error('Failed to prepare/send DB file', err);
  }
}

export default shareDbFile;