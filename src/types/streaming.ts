export interface StreamingInfo {
    [platform: string]: string;
  }
  
  export interface MovieStreaming {
    imdbId: string;
    streaming: StreamingInfo;
  }