export interface ChatMessage {
  text: string;
  image?: string; // base64
  replyToId?: string; // id of the message being replied to
}

export function parseChatMessage(raw: string | null | undefined): ChatMessage | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.text !== undefined || parsed.image !== undefined) {
      return parsed as ChatMessage;
    }
  } catch (e) {
    // If it fails to parse, it's a legacy plain text message.
  }
  return { text: raw };
}

export function stringifyChatMessage(msg: ChatMessage): string {
  return JSON.stringify(msg);
}

export function compressImage(file: File, maxWidth = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // JPEG compression (0.7 quality)
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
