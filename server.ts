import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Permissive JSON/JS Object Parser that can automatically clean up typical user syntax errors
function parseLooseJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch (err) {
    // 1. Strip comments (inline and block)
    let clean = text.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    
    // 2. Trim whitespace
    clean = clean.trim();

    // 3. Fix unquoted keys, or keys quoted with single-quotes
    // We want to transform: { key: "val" } or { 'key': "val" } into { "key": "val" }
    clean = clean.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
    clean = clean.replace(/([{,]\s*)'([a-zA-Z0-9_]+)'\s*:/g, '$1"$2":');

    // 4. Convert single-quoted string values to double-quoted string values, taking care not to mess up apostrophes inside words.
    clean = clean.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (match, content) => {
      const doubleCleaned = content.replace(/"/g, '\\"');
      return `"${doubleCleaned}"`;
    });

    // 5. Remove trailing commas in arrays and objects before closing brackets/braces
    clean = clean.replace(/,(\s*[\]}])/g, '$1');

    // Attempt standard parsing
    return JSON.parse(clean);
  }
}

const STORIES_DIR = path.join(process.cwd(), "public", "stories");

// Ensure directory exists
if (!fs.existsSync(STORIES_DIR)) {
  fs.mkdirSync(STORIES_DIR, { recursive: true });
}

function getFolderStories(): any[] {
  const storiesList: any[] = [];
  try {
    if (fs.existsSync(STORIES_DIR)) {
      const files = fs.readdirSync(STORIES_DIR);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const filePath = path.join(STORIES_DIR, file);
          try {
            const rawContent = fs.readFileSync(filePath, "utf-8");
            let parsed;
            try {
              // Try standard JSON.parse first to avoid regex corruption of valid files
              parsed = JSON.parse(rawContent);
            } catch (jsonErr) {
              parsed = parseLooseJson(rawContent);
            }
            
            const items = Array.isArray(parsed) ? parsed : [parsed];
            for (const item of items) {
              if (item && typeof item === "object") {
                item.id = item.id || `file-${path.parse(file).name}-${Math.random().toString(36).substr(2, 5)}`;
                item.origin = "folder";
                item.filename = file;
                storiesList.push(item);
              }
            }
          } catch (err: any) {
            console.error(`Errore nel caricamento del file ${file}:`, err.message);
          }
        }
      }
    }
  } catch (err) {
    console.error("Errore generico della lettura cartella public/stories:", err);
  }
  return storiesList;
}

// Lazy-initialization of Gemini client for robust startup
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY non è configurata nel pannello Secrets di AI Studio."
      );
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to perform robust AI calling with retries and alternate model fallback
async function fetchGeminiWithRetry(params: {
  prompt: string;
  responseSchema?: any;
  responseMimeType?: string;
}): Promise<any> {
  const maxRetries = 2;
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Tentativo di chiamata GenAI: modello ${model}, tentativo ${attempt}/${maxRetries}...`);
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: model,
          contents: params.prompt,
          config: {
            responseMimeType: params.responseMimeType || "application/json",
            responseSchema: params.responseSchema,
          },
        });

        if (response && response.text) {
          console.log(`Successo con modello ${model} al tentativo ${attempt}`);
          return response;
        }
        throw new Error("La risposta restituita da Gemini era priva di testo.");
      } catch (err: any) {
        lastError = err;
        console.warn(
          `Chiamata non riuscita (modello ${model}, tentativo ${attempt}/${maxRetries}): ${err.message || err}`
        );

        const isTransient =
          err.message?.includes("503") ||
          err.message?.includes("demand") ||
          err.message?.includes("UNAVAILABLE") ||
          err.message?.includes("429") ||
          err.message?.includes("limit") ||
          String(err).includes("503") ||
          String(err).includes("UNAVAILABLE") ||
          String(err).includes("demand");

        if (isTransient && attempt < maxRetries) {
          const delay = 1000 * attempt;
          console.log(`Riprovo in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          // Break to try the fallback model or bubble up
          break;
        }
      }
    }
  }

  throw lastError || new Error("Errore sconosciuto di connessione con il servizio AI.");
}

// GET all stories from the folder content/stories
app.get("/api/stories", (req, res) => {
  try {
    const folderStories = getFolderStories();
    res.json(folderStories);
  } catch (err: any) {
    res.status(500).json({ error: "Impossibile caricare le letture dalla cartella server.", details: err.message });
  }
});

// POST to save a story as a permanent JSON file in content/stories/
app.post("/api/stories", (req, res) => {
  try {
    const { storyData } = req.body;
    if (!storyData) {
      return res.status(400).json({ error: "Dati della storia mancanti." });
    }

    let item: any;
    if (typeof storyData === "string") {
      item = parseLooseJson(storyData);
    } else {
      item = storyData;
    }

    if (!item.titleRu || !item.titleIt || !item.paragraphs || !Array.isArray(item.paragraphs)) {
      return res.status(400).json({ error: "Sottostruttura non valida. Assicurati che contenga 'titleRu', 'titleIt' e 'paragraphs'." });
    }

    // Set clean, unique identifiers
    const baseId = item.id || `custom-${Date.now()}`;
    item.id = baseId;
    item.origin = "folder";

    // Build friendly filename
    const sanitizedTitle = (item.titleRu || "story").toLowerCase().replace(/[^a-z0-9]/g, "_").substring(0, 30);
    const filename = `${sanitizedTitle}_${Date.now()}.json`;
    const filePath = path.join(STORIES_DIR, filename);

    // Save as standard pretty JSON
    fs.writeFileSync(filePath, JSON.stringify(item, null, 2), "utf-8");
    item.filename = filename;

    res.json({
      success: true,
      story: item,
      message: `La lettura "${item.titleRu}" è stata salvata permanentemente nella cartella /public/stories/${filename}!`
    });
  } catch (err: any) {
    console.error("Errore nel salvataggio del file JSON sul server:", err);
    res.status(500).json({ error: "Impossibile salvare il file della storia sul server.", details: err.message });
  }
});

// DELETE a story file from the content/stories/ folder
app.delete("/api/stories/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    // Basic verification against path traversal
    if (!filename || filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
      return res.status(400).json({ error: "Nome file non valido o non autorizzato." });
    }

    const filePath = path.join(STORIES_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: "File rimosso con successo dalla cartella del server." });
    } else {
      return res.status(404).json({ error: "File non trovato." });
    }
  } catch (err: any) {
    console.error("Errore durante la rimozione del file:", err);
    res.status(500).json({ error: "Impossibile rimuovere il file dal server.", details: err.message });
  }
});

// 1. Explaining a word in context
app.post("/api/explain-word", async (req, res) => {
  try {
    const { word, contextText } = req.body;
    if (!word) {
      return res.status(400).json({ error: "Parola mancante" });
    }

    const prompt = `Sei un insegnante di lingua russa esperto per parlanti italiani. Spiega la parola o espressione russa "${word}" considerando che si trova nel seguente contesto: "${contextText || 'Nessun contesto fornito'}".

La tua spiegazione deve essere estremamente chiara, stress-free per un principiante assoluto, e formattata rigidamente in formato JSON valido in italiano con questa struttura:
{
  "word": "La parola o corta espressione in cirillico",
  "ipa": "Trascrizione fonetica amichevole in lettere latine, mostrando dove cade l'accento usando maiuscole, es: pa-ZHA-lu-ysta",
  "dictForm": "Forma base del dizionario (es. infinito per i verbi, nominativo singolare per sostantivi e aggettivi)",
  "translation": "Traduzione primaria in italiano amichevole",
  "grammar": "Analisi grammaticale brevissima e comprensibile (es. 'Sostantivo maschile', 'Verbo imperfettivo al presente', ecc.)",
  "explanation": "Spiegazione amichevole del significato, del contesto d'uso o di curiosità culturali in italiano",
  "examplesRu": "Un esempio corto e semplice di utilizzo in russo",
  "examplesIt": "La traduzione in italiano del suddetto esempio"
}`;

    const response = await fetchGeminiWithRetry({
      prompt,
      responseSchema: {
        type: Type.OBJECT,
        required: [
          "word",
          "ipa",
          "dictForm",
          "translation",
          "grammar",
          "explanation",
          "examplesRu",
          "examplesIt",
        ],
        properties: {
          word: { type: Type.STRING },
          ipa: { type: Type.STRING },
          dictForm: { type: Type.STRING },
          translation: { type: Type.STRING },
          grammar: { type: Type.STRING },
          explanation: { type: Type.STRING },
          examplesRu: { type: Type.STRING },
          examplesIt: { type: Type.STRING },
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Errore explain-word:", error);
    res.status(503).json({
      error: "Il servizio di intelligenza artificiale di Google è temporaneamente molto richiesto. Riprova tra pochi istanti.",
      details: error.message,
    });
  }
});

// 2. Generating a customized graded story/dialogue
app.post("/api/generate-story", async (req, res) => {
  try {
    const { theme, level = "A1", type = "story" } = req.body;
    if (!theme) {
      return res.status(400).json({ error: "Tema mancante" });
    }

    const subTypeDesc = type === "dialogue" ? "dialogo interattivo tra due personaggi" : "racconto ad impianto narrativo semplice";
    
    const prompt = `Sei un autore didattico di lingua russa ed esperto professore per principianti italiani.
Crea un ${subTypeDesc} originale, interessante ma rilassante, per il livello principiante "${level}" (livello russo A1 o A2 per parlanti italiani).
Il tema richiesto è: "${theme}".

Assicurati che il vocabolario contenga espressioni di uso comune ed evita frasi eccessivamente contorte o parole troppo rare.
Fornisci l'output rigorosamente in formato JSON valido con questa struttura:
{
  "titleRu": "Titolo in cirillico con l'indicazione degli accenti principali se possibile",
  "titleIt": "Traduzione poetica ed elegante in italiano del titolo",
  "level": "Livello didattico",
  "introduction": "Una o due frasi in italiano che introducono l'ambientazione e forniscono un'atmosfera rilassata",
  "paragraphs": [
    {
      "ru": "Frase singola (o massimo due brevi) in russo",
      "it": "Traduzione esatta e naturale a fronte in italiano",
      "speaker": "Nome del personaggio in italiano (se è un dialogo), es: 'Anna', 'Ivan', ecc. Altrimenti vuoto per storie narrative"
    }
  ],
  "vocabulary": [
    {
      "ru": "Parola russa importante",
      "it": "Significato in italiano",
      "note": "Trascrizione della pronuncia o nota grammaticale rapida (es: 'accento sulla o')"
    }
  ],
  "grammarFocus": {
    "topic": "Argomento grammaticale chiave della storia (es: Verbi riflessivi, Caso Prepositivo)",
    "explanation": "Spiegazione sintetica, stress-free e pratica in lingua italiana sul perché questo si applica alla storia, con mini-esempi"
  }
}`;

    const response = await fetchGeminiWithRetry({
      prompt,
      responseSchema: {
        type: Type.OBJECT,
        required: ["titleRu", "titleIt", "level", "introduction", "paragraphs", "vocabulary", "grammarFocus"],
        properties: {
          titleRu: { type: Type.STRING },
          titleIt: { type: Type.STRING },
          level: { type: Type.STRING },
          introduction: { type: Type.STRING },
          paragraphs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["ru", "it"],
              properties: {
                ru: { type: Type.STRING },
                it: { type: Type.STRING },
                speaker: { type: Type.STRING },
              },
            },
          },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["ru", "it", "note"],
              properties: {
                ru: { type: Type.STRING },
                it: { type: Type.STRING },
                note: { type: Type.STRING },
              },
            },
          },
          grammarFocus: {
            type: Type.OBJECT,
            required: ["topic", "explanation"],
            properties: {
              topic: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
          },
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Errore generate-story:", error);
    res.status(503).json({
      error: "Il servizio di intelligenza artificiale di Google è temporaneamente molto richiesto. Riprova tra circa 15 secondi o utilizza una delle letture permanenti d'autore!",
      details: error.message,
    });
  }
});

// 3. Translating and analyzing custom pasted Russian text
app.post("/api/translate-custom", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Testo mancante" });
    }

    const prompt = `Sei un assistente didattico di lingua russa. L'utente ha inserito il seguente testo scritto in russo che desidera leggere con traduzione a fronte (traduzione interlineare o speculare in italiano).
Analizza il testo, dividilo in segmenti logici coerenti e frasi non troppo lunghe, in modo che sia facilmente leggibile per un principiante.
Genera la traduzione italiana di ogni segmento, ricava un vocabolario dei termini utili e identifica un focus grammaticale per aiutare l'apprendimento.

Testo fornito:
"""
${text}
"""

Fornisci il risultato rigorosamente in formato JSON valido con questa struttura:
{
  "titleRu": "Un titolo appropriato in cirillico dedotto dal testo (o 'Testo Personalizzato')",
  "titleIt": "Traduzione del titolo in italiano",
  "paragraphs": [
    {
      "ru": "Frase singola (o segmento breve) in russo",
      "it": "La traduzione esatta corrispondente in italiano"
    }
  ],
  "vocabulary": [
    {
      "ru": "Termine russo chiave identificato nel testo",
      "it": "Significato in italiano",
      "note": "Nota grammaticale o di pronuncia (es: 'nominativo', 'verbo')"
    }
  ],
  "grammarFocus": {
    "topic": "Argomento grammaticale principale individuato nel testo (es. Uso del caso genitivo)",
    "explanation": "Spiegazione semplice, accessibile ed in italiano del tema con riferimento al testo"
  }
}`;

    const response = await fetchGeminiWithRetry({
      prompt,
      responseSchema: {
        type: Type.OBJECT,
        required: ["titleRu", "titleIt", "paragraphs", "vocabulary", "grammarFocus"],
        properties: {
          titleRu: { type: Type.STRING },
          titleIt: { type: Type.STRING },
          paragraphs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["ru", "it"],
              properties: {
                ru: { type: Type.STRING },
                it: { type: Type.STRING },
              },
            },
          },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["ru", "it", "note"],
              properties: {
                ru: { type: Type.STRING },
                it: { type: Type.STRING },
                note: { type: Type.STRING },
              },
            },
          },
          grammarFocus: {
            type: Type.OBJECT,
            required: ["topic", "explanation"],
            properties: {
              topic: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
          },
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Errore translate-custom:", error);
    res.status(503).json({
      error: "Il servizio di intelligenza artificiale di Google è temporaneamente molto richiesto. Riprova tra circa 15 secondi o utilizza una delle letture permanenti d'autore!",
      details: error.message,
    });
  }
});

// Vite Middleware integration for standard production and development environments
const createViteServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteDevServer } = await import("vite");
    const vite = await createViteDevServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
};

createViteServer().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
});
