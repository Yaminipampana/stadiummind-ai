import { apiClient, APIResponse } from "./apiClient";

export interface ChatMessageRequest {
  message: string;
  session_id?: string | null;
}

export interface ChatMessageResponse {
  reply: string;
  session_id: string;
  timestamp: string;
}

export const chatService = {
  /** Sends standard POST requests to fetch full text responses */
  sendMessage: async (payload: ChatMessageRequest): Promise<APIResponse<ChatMessageResponse>> => {
    const lang = localStorage.getItem("stadiummind_lang") || "en";
    return apiClient.post<ChatMessageResponse>("/chat", payload, {
      headers: {
        "Accept-Language": lang,
      }
    });
  },

  /**
   * Establishes a readable chunk-by-chunk stream using Server-Sent Events (SSE).
   * Fully compatible with standard readable chunk consumers.
   */
  sendMessageStream: async (
    payload: ChatMessageRequest,
    onChunk: (chunk: string) => void,
    onDone: (fullReply: string, sessionId: string) => void,
    onError: (error: string) => void
  ): Promise<void> => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
      const token = localStorage.getItem("stadiummind_token");
      const lang = localStorage.getItem("stadiummind_lang") || "en";
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Accept-Language": lang,
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // We hit the streaming endpoint
      const response = await fetch(`${baseUrl}/chat/stream`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorText = `HTTP Error: ${response.status}`;
        try {
          const errData = await response.json();
          errorText = errData.detail || errData.message || errorText;
        } catch {
          // ignore parsing error if response isn't JSON
        }
        throw new Error(errorText);
      }

      if (!response.body) {
        throw new Error("Response readable stream is unavailable.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";
      let activeSessionId = payload.session_id || "session_new";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          const chunkString = decoder.decode(value, { stream: !done });
          // Split SSE format "data: {...}"
          const lines = chunkString.split("\n");
          
          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine.startsWith("data: ")) {
              const dataPayload = cleanLine.substring(6).trim();
              if (dataPayload === "[DONE]") {
                done = true;
                break;
              }
              
              try {
                const parsed = JSON.parse(dataPayload);
                if (parsed.chunk) {
                  accumulatedText += parsed.chunk;
                  onChunk(parsed.chunk);
                }
                if (parsed.session_id) {
                  activeSessionId = parsed.session_id;
                }
              } catch {
                // ignore parsing faults of incomplete buffer lines
              }
            }
          }
        }
      }

      onDone(accumulatedText, activeSessionId);
    } catch (err: any) {
      onError(err.message || "Failed to establish stream connection.");
    }
  },
};

export default chatService;
