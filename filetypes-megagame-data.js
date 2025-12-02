// File Types Forge – Stage & Question Data
// Covers: image, audio, video formats and lossy/lossless compression.

window.FILETYPE_STAGES = [
  {
    id: "imageFormats",
    name: "Stage 1 – Image Format Showdown",
    intro: "Pick the most suitable still image format for each scenario.",
    type: "imageScenario",
    questions: [
      {
        scenario: "A photographer wants to keep every detail from a high-end DSLR photo so it can be edited later without losing quality.",
        answer: "RAW",
        options: ["RAW", "JPG", "PNG", "GIF"]
      },
      {
        scenario: "A designer needs a logo with a transparent background for use on different coloured web pages.",
        answer: "PNG",
        options: ["PNG", "JPG", "GIF", "PDF"]
      },
      {
        scenario: "A social media manager is uploading holiday photos and wants small file sizes with acceptable quality.",
        answer: "JPG",
        options: ["JPG", "RAW", "PNG", "GIF"]
      },
      {
        scenario: "An online advert uses a short looping animation of a character waving.",
        answer: "GIF",
        options: ["GIF", "PNG", "JPG", "RAW"]
      },
      {
        scenario: "A magazine is being sent to the printer as a finished document with all images and text embedded.",
        answer: "PDF",
        options: ["PDF", "PNG", "JPG", "GIF"]
      },
      {
        scenario: "A web banner must look sharp but also support semi-transparent edges for a glow effect.",
        answer: "PNG",
        options: ["PNG", "JPG", "GIF", "RAW"]
      }
    ]
  },
  {
    id: "audioFormats",
    name: "Stage 2 – Audio Format Arena",
    intro: "Choose the most appropriate audio format based on the description.",
    type: "audioScenario",
    questions: [
      {
        scenario: "A sound engineer is recording a band in a studio and wants the highest quality for editing, with no compression.",
        answer: "WAV",
        options: ["WAV", "MP3", "AAC", "FLAC"]
      },
      {
        scenario: "A music streaming app wants good quality songs but with very small file sizes and wide support.",
        answer: "MP3",
        options: ["MP3", "WAV", "AAC", "FLAC"]
      },
      {
        scenario: "A video platform needs a modern compressed audio format with better quality than MP3 at the same file size.",
        answer: "AAC",
        options: ["AAC", "MP3", "WAV", "FLAC"]
      },
      {
        scenario: "An archive website wants to store high-quality albums using lossless compression that reduces file size.",
        answer: "FLAC",
        options: ["FLAC", "MP3", "AAC", "WAV"]
      },
      {
        scenario: "A game developer wants quick preview sounds that will load fast and use very little storage on mobile devices.",
        answer: "MP3",
        options: ["MP3", "WAV", "FLAC", "AAC"]
      }
    ]
  },
  {
    id: "videoFormats",
    name: "Stage 3 – Video Format Vault",
    intro: "Pick the most suitable moving image format for each situation.",
    type: "videoScenario",
    questions: [
      {
        scenario: "A video creator is uploading a vlog to YouTube and wants a well-compressed, widely supported format.",
        answer: "MP4",
        options: ["MP4", "AVI", "WMV", "MOV"]
      },
      {
        scenario: "A film studio is editing footage and wants to avoid losing quality during the editing stage.",
        answer: "AVI (lossless / uncompressed)",
        options: ["AVI (lossless / uncompressed)", "MP4", "WMV", "MOV"]
      },
      {
        scenario: "A website needs short video clips that stream efficiently in modern browsers using open-source formats.",
        answer: "WebM",
        options: ["WebM", "MP4", "SWF", "WMV"]
      },
      {
        scenario: "An older Windows-only application has been built around a traditional Microsoft video format.",
        answer: "WMV",
        options: ["WMV", "MP4", "AVI", "MOV"]
      },
      {
        scenario: "A video editor is exporting a trailer aimed mainly at Apple devices and older Macs.",
        answer: "MOV",
        options: ["MOV", "MP4", "AVI", "WMV"]
      },
      {
        scenario: "A legacy animation on a very old website uses the Flash plugin.",
        answer: "SWF",
        options: ["SWF", "MP4", "MOV", "WebM"]
      }
    ]
  },
  {
    id: "properties",
    name: "Stage 4 – Properties & Quality Quiz",
    intro: "Match each description to the correct technical property.",
    type: "propertyMatch",
    questions: [
      {
        description: "The number of pixels across and down an image, such as 1920×1080.",
        answer: "Pixel dimensions",
        options: ["Pixel dimensions", "Resolution (DPI/PPI)", "Frame rate", "Bit depth"]
      },
      {
        description: "The number of dots or pixels per inch in an image or on a display.",
        answer: "Resolution (DPI/PPI)",
        options: ["Resolution (DPI/PPI)", "Pixel dimensions", "Sample rate", "Frame rate"]
      },
      {
        description: "The number of times per second that an analogue sound wave is measured.",
        answer: "Sample rate",
        options: ["Sample rate", "Bit depth", "Frame rate", "Resolution (DPI/PPI)"]
      },
      {
        description: "How many different levels each audio sample can store, affecting the detail of the sound.",
        answer: "Bit depth",
        options: ["Bit depth", "Sample rate", "Frame rate", "Pixel dimensions"]
      },
      {
        description: "The number of images shown every second in a video or animation.",
        answer: "Frame rate",
        options: ["Frame rate", "Sample rate", "Resolution (DPI/PPI)", "Bit depth"]
      },
      {
        description: "An image model that uses a grid of pixels, which may look blocky when zoomed in too far.",
        answer: "Bitmap image",
        options: ["Bitmap image", "Vector image", "Lossless compression", "Lossy compression"]
      },
      {
        description: "Graphics described using lines, curves and fills that can be scaled without losing quality.",
        answer: "Vector image",
        options: ["Vector image", "Bitmap image", "Sample rate", "Pixel dimensions"]
      }
    ]
  },
  {
    id: "compressionTypes",
    name: "Stage 5 – Lossy or Lossless?",
    intro: "Decide whether each example is lossy or lossless compression – or no compression at all.",
    type: "lossyLossless",
    questions: [
      {
        statement: "A .JPG photograph that throws away some colour detail to make the file much smaller.",
        answer: "Lossy compression",
        options: ["Lossy compression", "Lossless compression", "Uncompressed"]
      },
      {
        statement: "A .PNG logo where file size is reduced but all pixel information is kept exactly.",
        answer: "Lossless compression",
        options: ["Lossless compression", "Lossy compression", "Uncompressed"]
      },
      {
        statement: "A .WAV file exported from a studio with no compression applied.",
        answer: "Uncompressed",
        options: ["Uncompressed", "Lossy compression", "Lossless compression"]
      },
      {
        statement: "An .MP3 song that is 10% the size of the .WAV original but missing some frequencies.",
        answer: "Lossy compression",
        options: ["Lossy compression", "Lossless compression", "Uncompressed"]
      },
      {
        statement: "A FLAC audio file where size is reduced but can be fully rebuilt to the original.",
        answer: "Lossless compression",
        options: ["Lossless compression", "Lossy compression", "Uncompressed"]
      },
      {
        statement: "An AVI file used in a studio that stores every frame without compression.",
        answer: "Uncompressed",
        options: ["Uncompressed", "Lossy compression", "Lossless compression"]
      }
    ]
  },
  {
    id: "compressionTradeOffs",
    name: "Stage 6 – Compression Trade-offs",
    intro: "Choose the best explanation of how compression affects quality and file size in real projects.",
    type: "compressionScenario",
    questions: [
      {
        scenario: "A school network needs to store many student videos for coursework.",
        answer: "Use a lossy format like MP4 with sensible compression so files are smaller but still good quality.",
        options: [
          "Use a lossy format like MP4 with sensible compression so files are smaller but still good quality.",
          "Always store uncompressed AVI to keep the very highest quality, even if storage runs out.",
          "Convert all videos to GIFs so that they loop forever.",
          "Only use audio files instead of video to save space."
        ]
      },
      {
        scenario: "A film studio is archiving the final master of a movie for future re-releases.",
        answer: "Store a lossless or uncompressed master so no quality is lost, even if file sizes are huge.",
        options: [
          "Store a lossless or uncompressed master so no quality is lost, even if file sizes are huge.",
          "Export only a low-bitrate MP4 copy to save space.",
          "Upload the film to a streaming site and delete the original.",
          "Compress the movie repeatedly to make it as small as possible."
        ]
      },
      {
        scenario: "A mobile game must be downloaded quickly over a slow connection.",
        answer: "Use well-compressed textures, audio and video so the overall file size stays small.",
        options: [
          "Use well-compressed textures, audio and video so the overall file size stays small.",
          "Use only uncompressed WAV and BMP files to get maximum quality.",
          "Avoid any compression because it always ruins quality.",
          "Only support 4K video assets in the game."
        ]
      },
      {
        scenario: "A photographer is exporting images for a high-quality print brochure.",
        answer: "Use high-resolution images in a print-ready PDF with minimal compression to keep quality.",
        options: [
          "Use high-resolution images in a print-ready PDF with minimal compression to keep quality.",
          "Use tiny low-resolution JPGs to keep the brochure file extremely small.",
          "Convert every image to GIF, even full-page photos.",
          "Use screen-resolution images at 72 DPI only."
        ]
      }
    ]
  },
  {
    id: "eightMarkFiles",
    name: "Stage 7 – 8-Mark Builder: File Types & Compression",
    intro: "Pick the strongest exam-style sentence for an 8-mark answer about file types and compression.",
    type: "eightMarkFiles",
    questions: [
      {
        question: "Which opening sentence would gain the most marks in an 8-mark answer comparing bitmap and vector images?",
        answer: 1,
        options: [
          "Bitmap and vector images are used for pictures on computers.",
          "Bitmap images are made from a grid of pixels that can become pixelated when scaled, while vector images are made from lines and curves defined by maths so they can be resized without losing quality.",
          "Images can be big or small depending on the file format.",
          "There are many different image types such as JPG and PNG."
        ]
      },
      {
        question: "Which sentence best explains the impact of sample rate and bit depth on audio files?",
        answer: 2,
        options: [
          "Sample rate and bit depth are numbers that appear in audio settings.",
          "Higher sample rates and bit depths always make audio sound better for everyone.",
          "Increasing the sample rate means more measurements of the sound wave per second and increasing the bit depth increases the precision of each measurement, which improves quality but also increases file size.",
          "Audio files with low sample rates are always bad."
        ]
      },
      {
        question: "Which concluding sentence would best finish an 8-mark answer about choosing video formats for streaming and cinema release?",
        answer: 0,
        options: [
          "Overall, compressed formats like MP4 are ideal for online streaming because they balance quality and small file size, while lossless or lightly compressed formats such as high-quality AVI are better for editing and cinema masters where every detail must be preserved.",
          "In conclusion, there are lots of different video file formats that can be chosen.",
          "I have talked about MP4 and AVI and why they matter.",
          "Video files are large so compression is needed."
        ]
      }
    ]
  }
];
