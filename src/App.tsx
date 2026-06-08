import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  HelpCircle, 
  BookOpenText, 
  Globe, 
  Plus, 
  Type as FontIcon, 
  ArrowRight, 
  Loader2, 
  ChevronRight, 
  Bookmark, 
  Languages, 
  CheckCircle,
  Clock,
  RotateCcw,
  Trash2,
  FolderOpen
} from "lucide-react";
import { PRESET_STORIES, GradedStory, Paragraph, VocabularyItem } from "./data";



const EXTRA_TEMPLATES = [
  {
    name: "☕ Tè Russo (A1 - Tradizione)",
    description: "La ricca cultura del tè e il leggendario samovar riscaldante.",
    data: {
      id: "tmpl-tea",
      titleRu: "Ру́сский чай (Tè Russo)",
      titleIt: "La tradizione calorosa del tè",
      type: "story",
      level: "A1",
      introduction: "La cultura del tè in Russia è sinonimo di amicizia, grandi chiacchierate e dolci prelibati. Scopri la sua affascinante storia.",
      paragraphs: [
        {
          ru: "В Росси́и о́чень лю́бят пить чай. Э́то staráя и добра́я тради́ция.",
          it: "In Russia amano molto bere il tè. Questa è una vecchia e buona tradizione."
        },
        {
          ru: "Обы́чно друзья́ собира́ются на ку́хне и говоря́т: «Дава́й попьём ча́ю!»",
          it: "Di solito gli amici si riuniscono in cucina e dicono: «Dai, beviamo un po' di tè!»"
        },
        {
          ru: "Раньше на стол ста́вили большо́й металли́ческий самова́р для горя́чей воды́.",
          it: "In passato sulla tavola mettevano un grande samovar metallico per l'acqua calda."
        },
        {
          ru: "Сейча́с пьют чёрный чай с лимо́ном, мёдом, са́харом и сла́дкими конфе́тами.",
          it: "Ora bevono il tè nero con limone, miele, zucchero e dolci caramelle."
        }
      ],
      vocabulary: [
        { "ru": "Традиция", "it": "Tradizione", "note": "Sostantivo femminile" },
        { "ru": "Собираются", "it": "Si riuniscono / si radunano", "note": "Verbo riflessivo" },
        { "ru": "Давай", "it": "Dai / Facciamo", "note": "Particella esortativa molto frequente" },
        { "ru": "Самовар", "it": "Samovar", "note": "Il bollitore d'acqua storico russo" }
      ],
      grammarFocus: {
        topic: "Il caso Partitivo in -ю (чаю)",
        explanation: "Per alcuni alimenti e bevande si usa un genitivo speciale in -ю/-у invece di -я/-а per esprimere l'idea partitiva di 'un po' di'. Ad esempio: 'выпить чаю' significa 'bere dell'altro tè / un goccio di tè'."
      }
    }
  },
  {
    name: "🚇 La Metro di Mosca (A1 - Viaggi)",
    description: "Sotto le strade di Mosca, un vero e proprio museo d'arte sotterraneo.",
    data: {
      id: "tmpl-metro",
      titleRu: "Моско́вское метро́ (Il metrò)",
      titleIt: "Un museo sotterraneo nel cuore della capitale",
      type: "story",
      level: "A1",
      introduction: "La rete metropolitana di Mosca non è solo un mezzo di trasporto rapido, ma un tesoro architettonico visitato da turisti di tutto il mondo.",
      paragraphs: [
        {
          ru: "Моско́вское метро́ — одно́ из са́мых краси́вых в ми́ре.",
          it: "La metropolitana di Mosca è una delle più belle al mondo."
        },
        {
          ru: "Ста́нции похо́жи на прекра́сные за́лы во дворце́.",
          it: "Le stazioni assomigliano a splendide sale di un palazzo."
        },
        {
          ru: "Там есть мра́мор, бронзовые ста́туи, карти́ны и огро́мные лю́стры.",
          it: "Lì ci sono marmo, statue di bronzo, dipinti e enormi lampadari."
        },
        {
          ru: "Поезда́ прихо́дят ка́ждые две мину́ты. Э́то о́чень надёжный тра́нспорт.",
          it: "I treni arrivano ogni due minuti. Questo è un trasporto molto affidabile."
        }
      ],
      vocabulary: [
        { "ru": "Метро", "it": "Metropolitana", "note": "Sostantivo neutro indeclinabile" },
        { "ru": "Дворец", "it": "Palazzo", "note": "Al caso prepositivo singolare flette in 'во дворце'" },
        { "ru": "Статуи", "it": "Statue", "note": "Plurale di статуя" },
        { "ru": "Надёжный", "it": "Affidabile / sicuro", "note": "Aggettivo qualificativo russo" }
      ],
      grammarFocus: {
        topic: "Il pronome indeclinabile Метро",
        explanation: "La parola 'метро' è mutuata dal francese ed è una delle poche parole russe neutre completamente indeclinabili. Non cambia mai forma in nessun caso! Es: в метро (nella metro), около метро (vicino alla metro)."
      }
    }
  },
  {
    name: "❄️ L'Inverno Russo (A2 - Clima e Natura)",
    description: "Un racconto poetico ed evocativo sulla neve e sui passatempi invernali.",
    data: {
      id: "tmpl-winter",
      titleRu: "Ру́сская зима́ (L'inverno russo)",
      titleIt: "La magia della neve e il calore della banya",
      type: "story",
      level: "A2",
      introduction: "L'inverno in Russia è lungo e freddo, ma anche ricco di attività all'aperto, magici paesaggi innevati e tradizioni calde come la sauna russa.",
      paragraphs: [
        {
          ru: "Зима́ в Росси́и до́лгая, бе́лая и о́чень холо́дная.",
          it: "L'inverno in Russia è lungo, bianco e molto freddo."
        },
        {
          ru: "Температу́ра ча́сто па́дает ни́же мину́с двадцати́ гра́дусов.",
          it: "La temperatura scende spesso al di sotto dei meno venti gradi."
        },
        {
          ru: "Но лю́ди не сидят до́ма! Де́ти ката́ются на конька́х, лы́жах и са́нках.",
          it: "Ma le persone non stanno sedute a casa! I bambini pattinano, sciano e vanno in slittino."
        },
        {
          ru: "По́сле прогу́лки на мо́розе отли́чно пойти́ в ру́сскую ба́ню и вы́пить горя́чий сби́тень.",
          it: "Dopo una passeggiata al gelo è ottimo andare nella banya (sauna russa) e bere uno sbiten caldo."
        }
      ],
      vocabulary: [
        { "ru": "Ниже", "it": "Sotto / Inferiore", "note": "Comparativo dell'avverbio низко (basso)" },
        { "ru": "Катаются на", "it": "Pattinano/Scivolano su", "note": "Vuole la preposizione 'на' con il caso prepositivo" },
        { "ru": "Баня", "it": "Banya (sauna russa)", "note": "Bagno di vapore ancestrale, colonna della vita russa" },
        { "ru": "Сбитень", "it": "Sbiten", "note": "Bevanda bollente tradicional di miele, spezie e frutti" }
      ],
      grammarFocus: {
        topic: "I verbi di moto e scivolamento (кататься)",
        explanation: "Il verbo 'кататься' esprime l'azione di dondolarsi/scivolare per divertimento. Si abbina a 'на' + prepositivo per i mezzi: кататься на лыжах (sciare), кататься на коньках (pattinare), кататься на велосипеде (andare in bici)."
      }
    }
  }
];

export default function App() {
  // Navigation tabs: preset (Sfoglia Letture) or import-json (Importatore JSON)
  const [activeTab, setActiveTab] = useState<"preset" | "import-json">("preset");
  
  // Custom states with Local Storage persistence
  const [stories, setStories] = useState<GradedStory[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("russian_reader_stories");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load stories from localStorage", e);
        }
      }
    }
    return PRESET_STORIES;
  });

  useEffect(() => {
    localStorage.setItem("russian_reader_stories", JSON.stringify(stories));
  }, [stories]);

  // Dynamic directory scanner: load persistent folder stories from the Express server directory
  useEffect(() => {
    const fetchFolderStories = async () => {
      try {
        const response = await fetch("/api/stories");
        if (response.ok) {
          const folderStories = await response.json();
          if (folderStories && folderStories.length > 0) {
            setStories(prev => {
              const existingIds = new Set(prev.map(s => s.id));
              // Filter out duplicate IDs
              const newFolderStories = folderStories.filter((s: GradedStory) => !existingIds.has(s.id));
              return [...newFolderStories, ...prev];
            });
            // Let the first folder story be active by default if found
            if (folderStories[0]) {
              setSelectedStoryId(folderStories[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Errore durante il caricamento delle letture dal server:", err);
      }
    };
    fetchFolderStories();
  }, []);

  const handleDeleteStory = async (e: React.MouseEvent, story: GradedStory) => {
    e.stopPropagation();
    if (!window.confirm(`Sei sicuro di voler rimuovere permanentemente la lettura "${story.titleRu}"?`)) {
      return;
    }

    if (story.origin === "folder" || (story as any).filename) {
      try {
        const response = await fetch(`/api/stories/${(story as any).filename || story.id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          setStories(prev => prev.filter(s => s.id !== story.id));
          if (selectedStoryId === story.id) {
            setSelectedStoryId(PRESET_STORIES[0].id);
          }
        } else {
          const errData = await response.json();
          alert(`Errore del server: ${errData.error || "Impossibile eliminare il file."}`);
        }
      } catch (err) {
        console.error(err);
        alert("Errore di rete durante la rimozione della lettura dal server.");
      }
    } else {
      // Browser Local storage only
      setStories(prev => prev.filter(s => s.id !== story.id));
      if (selectedStoryId === story.id) {
        setSelectedStoryId(PRESET_STORIES[0].id);
      }
    }
  };

  const [selectedStoryId, setSelectedStoryId] = useState<string>(() => {
    return stories.length > 0 ? stories[0].id : PRESET_STORIES[0].id;
  });

  const [layoutMode, setLayoutMode] = useState<"side-by-side" | "interlinear">("side-by-side");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("lg");
  const [showTranslations, setShowTranslations] = useState<boolean>(true);
  
  // Speech synthesis states
  const [isPlaying, setIsPlaying] = useState<number | null>(null); // paragraph index
  const [speechRate, setSpeechRate] = useState<number>(0.7); // slow for beginners
  const [ttsSupported, setTtsSupported] = useState<boolean>(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Explain-word states
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedWordContext, setSelectedWordContext] = useState<string>("");
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [wordExplanation, setWordExplanation] = useState<{
    word: string;
    ipa: string;
    dictForm: string;
    translation: string;
    grammar: string;
    explanation: string;
    examplesRu: string;
    examplesIt: string;
  } | null>(null);
  const [explainError, setExplainError] = useState<string | null>(null);

  // New JSON Import State Management
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccess, setJsonSuccess] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<"append" | "replace">("append");
  const [saveToServerDir, setSaveToServerDir] = useState<boolean>(true);

  // Permissive JSON/JS Object Parser that can automatically clean up typical user syntax errors
  const parseLooseJson = (text: string): any => {
    try {
      return JSON.parse(text);
    } catch {
      // 1. Strip comments (inline and block)
      let clean = text.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
      
      // 2. Trim whitespace
      clean = clean.trim();

      // 3. Fix unquoted keys, or keys quoted with single-quotes
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
  };

  // Load browser voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    } else {
      setTtsSupported(false);
    }
  }, []);

  // Get currently selected story object
  const currentStory = stories.find((s) => s.id === selectedStoryId) || stories[0] || PRESET_STORIES[0];

  // TTS audio player logic
  const speakParagraph = (textRu: string, index: number) => {
    if (!ttsSupported) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    if (isPlaying === index) {
      setIsPlaying(null);
      return;
    }

    // Filter out stress marks (Russian accent marks) like '́' (Unicode U+0301) for cleaner TTS recognition if needed
    const cleanText = textRu.replace(/[\u0301]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ru-RU";
    utterance.rate = speechRate;

    // Try to find a standard Russian voice
    const ruVoice = availableVoices.find((v) => v.lang.startsWith("ru-RU") || v.lang === "ru");
    if (ruVoice) {
      utterance.voice = ruVoice;
    }

    utterance.onend = () => {
      setIsPlaying(null);
    };

    utterance.onerror = () => {
      setIsPlaying(null);
    };

    setIsPlaying(index);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (ttsSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(null);
    }
  };

  // Helper to split paragraph into individual Russian clickable words
  const renderRussianWords = (text: string, contextParagraph: string) => {
    const regex = /([А-яЁё\u0301]+)|([^\sА-яЁё\u0301]+)/g;
    const tokens = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      tokens.push(match[0]);
    }

    return tokens.map((token, i) => {
      const isCyrillicWord = /[А-яЁё\u0301]/.test(token);
      if (isCyrillicWord) {
        const cleanWord = token.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
        const isCurrentlySelected = selectedWord?.toLowerCase() === cleanWord.toLowerCase();
        
        return (
          <span
            key={i}
            id={`word-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              handleWordClick(cleanWord, contextParagraph);
            }}
            className={`cursor-help select-none inline-block px-0.5 rounded transition-all duration-150 relative 
              ${isCurrentlySelected 
                ? "bg-amber-100 text-amber-950 font-semibold ring-2 ring-amber-300" 
                : "hover:bg-amber-50 hover:text-amber-900 border-b border-dotted border-stone-400"
              }`}
            title="Clicca per spiegazione e pronuncia"
          >
            {token}
          </span>
         );
      } else {
        return <span key={i}>{token}</span>;
      }
    });
  };

  // Fetch word explanation from Server API (with robust local dictionary lookup fallback!)
  const handleWordClick = async (word: string, context: string) => {
    if (!word || word.trim().length === 0) return;
    
    // Quick cleanup
    const cleanWord = word.trim().replace(/[()[\].,;:!?]/g, "");
    setSelectedWord(cleanWord);
    setSelectedWordContext(context);
    setIsExplaining(true);
    setExplainError(null);
    setWordExplanation(null);

    // Contextual Local Word Fallback: check if the word is already declared in currentStory.vocabulary
    const foundLocal = currentStory.vocabulary?.find(
      v => v.ru.toLowerCase().replace(/[\u0301]/g, "") === cleanWord.toLowerCase().replace(/[\u0301]/g, "") ||
           cleanWord.toLowerCase().includes(v.ru.toLowerCase().replace(/[\u0301]/g, "")) ||
           v.ru.toLowerCase().replace(/[\u0301]/g, "").includes(cleanWord.toLowerCase())
    );

    if (foundLocal) {
      setWordExplanation({
        word: foundLocal.ru,
        ipa: "",
        dictForm: foundLocal.ru,
        translation: foundLocal.it,
        grammar: "Vocabolario della lettura",
        explanation: foundLocal.note || "Termine utile selezionato direttamente dall'autore.",
        examplesRu: "",
        examplesIt: ""
      });
      setIsExplaining(false);
      return;
    }

    try {
      const response = await fetch("/api/explain-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: cleanWord, contextText: context }),
      });

      if (!response.ok) {
        let msg = "Impossibile spiegare la parola in questo momento.";
        try {
          const errData = await response.json();
          if (errData && errData.error) msg = errData.error;
        } catch (_) {}
        throw new Error(msg);
      }

      const data = await response.json();
      setWordExplanation(data);
    } catch (err: any) {
      console.error(err);
      // Give a highly descriptive, graceful fallback if AI fails
      setWordExplanation({
        word: cleanWord,
        ipa: "",
        dictForm: cleanWord,
        translation: "Vedi vocabolario",
        grammar: "Dispositivo di traduzione offline",
        explanation: `Spiacenti, il servizio di dizionario intelligente online di Google è momentaneamente congestionato. Questa parola si trova nel contesto della storia corrente.`,
        examplesRu: "Esecuzione offline della lettura...",
        examplesIt: ""
      });
    } finally {
      setIsExplaining(false);
    }
  };

  // Perform actual import and JSON validation with permissive relaxed custom parsing
  const handleImportJson = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setJsonError(null);
    setJsonSuccess(null);

    if (!jsonInput.trim()) {
      setJsonError("Per favore, incolla prima del codice JSON valido o testo personalizzato!");
      return;
    }

    try {
      let parsed;
      try {
        parsed = parseLooseJson(jsonInput);
      } catch (parseErr: any) {
        throw new Error(`Sintassi JSON non corretta. Abbiamo tentato l'auto-riparazione ma sono presenti errori di struttura insuperabili. Dettaglio: ${parseErr.message}`);
      }

      const itemsToValidate = Array.isArray(parsed) ? parsed : [parsed];
      const validatedStories: GradedStory[] = [];
      
      for (let i = 0; i < itemsToValidate.length; i++) {
        const item = itemsToValidate[i];
        const errorPrefix = Array.isArray(parsed) ? `Racconto #${i+1}: ` : "";

        if (!item.titleRu || typeof item.titleRu !== "string") {
          throw new Error(`${errorPrefix}Il campo 'titleRu' è obbligatorio.`);
        }
        if (!item.titleIt || typeof item.titleIt !== "string") {
          throw new Error(`${errorPrefix}Il campo 'titleIt' è obbligatorio.`);
        }
        if (!item.type || (item.type !== "story" && item.type !== "dialogue")) {
          throw new Error(`${errorPrefix}Le tipologie permesse per il campo 'type' sono 'story' o 'dialogue'.`);
        }
        if (!item.level || (item.level !== "A1" && item.level !== "A2")) {
          throw new Error(`${errorPrefix}I livelli supportati sono 'A1' o 'A2'.`);
        }
        if (!item.paragraphs || !Array.isArray(item.paragraphs) || item.paragraphs.length === 0) {
          throw new Error(`${errorPrefix}Devi inserire almeno una coppia di testo a fronte nel campo 'paragraphs'.`);
        }
        
        for (let pIdx = 0; pIdx < item.paragraphs.length; pIdx++) {
          const para = item.paragraphs[pIdx];
          if (!para.ru || typeof para.ru !== "string" || !para.it || typeof para.it !== "string") {
            throw new Error(`${errorPrefix}Il paragrafo #${pIdx+1} deve contenere chiavi stringhe 'ru' e 'it'.`);
          }
        }

        if (item.vocabulary && !Array.isArray(item.vocabulary)) {
          throw new Error(`${errorPrefix}Il campo 'vocabulary' deve essere un array di oggetti.`);
        }

        const newStory: GradedStory = {
          id: item.id || `imported-${Date.now()}-${i}`,
          titleRu: item.titleRu,
          titleIt: item.titleIt,
          type: item.type,
          level: item.level,
          introduction: item.introduction || "Racconto importato manualmente via JSON.",
          paragraphs: item.paragraphs,
          vocabulary: item.vocabulary || [],
          grammarFocus: item.grammarFocus || { topic: "Focus grammaticale", explanation: "Nessun focus dettagliato fornito." }
        };

        // Write physically to /content/stories on server if selected
        if (saveToServerDir) {
          try {
            const serverRes = await fetch("/api/stories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ storyData: newStory }),
            });
            if (serverRes.ok) {
              const resData = await serverRes.json();
              if (resData.story) {
                newStory.id = resData.story.id;
                (newStory as any).origin = "folder";
                (newStory as any).filename = resData.story.filename;
              }
            } else {
              const errData = await serverRes.json();
              console.warn("Il server ha rifiutato l'inserimento permanente della storia:", errData.error);
            }
          } catch (serverErr) {
            console.error("Incapace di agganciarsi al server per il salvataggio in cartella:", serverErr);
          }
        }

        validatedStories.push(newStory);
      }

      if (importMode === "replace") {
        setStories(validatedStories);
        setSelectedStoryId(validatedStories[0].id);
      } else {
        setStories(prev => {
          const existingIds = new Set(prev.map(s => s.id));
          const filteredNew = validatedStories.map(s => {
            if (existingIds.has(s.id)) {
              return { ...s, id: `${s.id}-imported-${Date.now()}` };
            }
            return s;
          });
          return [...filteredNew, ...prev];
        });
        setSelectedStoryId(validatedStories[0].id);
      }

      const saveContext = saveToServerDir 
        ? "Salvataggio completato e inviato fisso nella cartella del server!" 
        : "Aggiunto temporaneamente al catalogo locale del browser.";

      setJsonSuccess(`Perfetto! ${validatedStories.length} nuovo/i racconto/i registrato/i. ${saveContext}`);
      setJsonInput("");
      
      setTimeout(() => {
        setActiveTab("preset");
        setJsonSuccess(null);
      }, 1500);

    } catch (err: any) {
      setJsonError(err.message || "Formato non valido. Verifica la struttura formale.");
    }
  };

  // Quick template automatic injector
  const handleLoadTemplate = (templateData: any) => {
    setJsonError(null);
    setJsonSuccess(null);
    
    // Auto populate the state
    setStories(prev => {
      const exists = prev.some(s => s.id === templateData.id);
      if (exists) {
        // Just select it
        return prev;
      }
      return [templateData, ...prev];
    });
    
    setSelectedStoryId(templateData.id);
    setJsonSuccess(`Racconto "${templateData.titleRu}" caricato con successo nel catalogo!`);
    
    setTimeout(() => {
      setActiveTab("preset");
      setJsonSuccess(null);
    }, 800);
  };

  // Restore baseline default readings
  const handleRestoreDefaults = () => {
    if (window.confirm("Sei sicuro di voler ricaricare il catalogo originale? Questo rimuoverà le storie importate.")) {
      setStories(PRESET_STORIES);
      setSelectedStoryId(PRESET_STORIES[0].id);
      localStorage.removeItem("russian_reader_stories");
      setActiveTab("preset");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-900 font-sans selection:bg-amber-200" id="app-root">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#fdfbf7]/90 backdrop-blur border-b border-stone-200/80 px-4 py-3" id="header-container">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 text-amber-800 p-2.5 rounded-xl border border-amber-200/60 shadow-sm" id="logo-icon-wrap">
              <BookOpenText className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight text-amber-950 flex items-center gap-2">
                Lettore Russo Graduato
              </h1>
              <p className="text-xs text-stone-500 font-medium tracking-wide">
                Dialoghi d'autore, letture speculari e dizionario interattivo
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center flex-wrap gap-2" id="nav-tabs">
            <button
              onClick={() => { setActiveTab("preset"); stopSpeaking(); }}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150 flex items-center gap-2 border ${
                activeTab === "preset"
                  ? "bg-stone-900 text-[#fdfbf7] border-stone-900 shadow-sm"
                  : "bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border-stone-200"
              }`}
              id="tab-preset-stories"
            >
              <BookOpen className="w-4 h-4" />
              <span>Sfoglia Letture</span>
            </button>

            <button
              onClick={() => { setActiveTab("import-json"); stopSpeaking(); }}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150 flex items-center gap-2 border ${
                activeTab === "import-json"
                  ? "bg-amber-800 text-[#fdfbf7] border-amber-800 shadow-sm"
                  : "bg-amber-50/60 text-amber-950 hover:bg-amber-100 border-amber-200"
              }`}
              id="tab-json-importer"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              <span>Importatore JSON</span>
            </button>
          </div>
        </div>
      </header>


      {/* Main Content Areas */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8" id="primary-layout">
        
        {/* TAB 1: STORY READER VIEW */}
        {activeTab === "preset" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="tab-presets-mesh">
            
            {/* Sidebar with menu selection */}
            <div className="lg:col-span-4 space-y-6" id="sidebar-stories-shelf">
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
                  <h3 className="font-bold text-stone-800 font-display text-sm tracking-wide uppercase">
                    Scegli una Lettura
                  </h3>
                  <span className="text-xs bg-stone-100 rounded-full px-2 py-1 text-stone-500 font-semibold">
                    {stories.length} disponibili
                  </span>
                </div>

                <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1" id="stories-selection-list">
                  {stories.map((story) => {
                    const isSelected = story.id === selectedStoryId;
                    const isPreset = PRESET_STORIES.some(p => p.id === story.id);
                    
                    return (
                      <div key={story.id} className="relative group">
                        <button
                          onClick={() => {
                            setSelectedStoryId(story.id);
                            stopSpeaking();
                            // Clear word details when switching stories
                            setSelectedWord(null);
                            setWordExplanation(null);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex flex-col gap-1 relative overflow-hidden group/btn ${
                            isSelected
                              ? "bg-amber-50/80 border-amber-300 ring-1 ring-amber-200"
                              : "bg-stone-50/55 hover:bg-stone-50 border-stone-200/70"
                          }`}
                          id={`story-btn-${story.id}`}
                        >
                          {/* Selected accent slice */}
                          {isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600 rounded-r" />
                          )}

                          <div className="flex items-center justify-between pr-7">
                            <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                              story.level === "A1" 
                                ? "bg-emerald-100/90 text-emerald-800" 
                                : "bg-sky-100/90 text-sky-800"
                            }`}>
                              {story.level}
                            </span>

                            <span className="text-[10px] text-stone-400 capitalize flex items-center gap-1">
                              {story.type === "dialogue" ? (
                                <>
                                  <MessageSquare className="w-3 h-3 text-stone-300" />
                                  Dialogo
                                </>
                              ) : (
                                <>
                                  <BookOpen className="w-3 h-3 text-stone-300" />
                                  Racconto
                                </>
                              )}
                            </span>
                          </div>

                          <h4 className="font-bold text-stone-800 group-hover:text-amber-900 transition-colors mt-1.5 leading-snug">
                            {story.titleRu}
                          </h4>
                          
                          <p className="text-xs text-stone-500 italic font-medium line-clamp-1">
                            {story.titleIt}
                          </p>
                          
                          {story.origin === "folder" && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-800 bg-amber-100/60 font-bold px-1.5 py-0.5 rounded-md self-start border border-amber-200/45">
                              <FolderOpen className="w-2.5 h-2.5 text-amber-700 shrink-0" />
                              <span>In Cartella Server</span>
                            </div>
                          )}
                        </button>

                        {/* Delete trigger for folder configurations or browser imports */}
                        {(!isPreset || story.origin === "folder") && (
                          <button
                            onClick={(e) => handleDeleteStory(e, story)}
                            className="absolute top-2.5 right-2 px-1.5 py-1 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition duration-150 z-10"
                            title="Rimuovi lettura definitivamente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grammar Focus Spot (contextual for the active story) */}
              {currentStory.grammarFocus && (
                <div className="bg-amber-50/45 rounded-2xl p-5 border border-amber-200/50 shadow-xs relative overflow-hidden" id="grammar-focus-card">
                  <div className="absolute top-0 right-0 p-3 opacity-15">
                    <HelpCircle className="w-20 h-20 text-amber-800" />
                  </div>
                  
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                    Focus Grammaticale Aderente
                  </span>
                  <h4 className="font-bold text-stone-800 mt-2 font-display text-base">
                    {currentStory.grammarFocus.topic}
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed whitespace-pre-line">
                    {currentStory.grammarFocus.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Core Reading Panel & Interactive translation column */}
            <div className="lg:col-span-8 flex flex-col gap-6" id="primary-reading-column">
              
              {/* Display Controls & Fast customization bar */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/90 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
                
                {/* Visual view toggles */}
                <div className="flex items-center gap-2" id="layout-toggles">
                  <span className="text-xs text-stone-500 font-medium mr-1">Visualizzazione:</span>
                  <button
                    onClick={() => setLayoutMode("side-by-side")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      layoutMode === "side-by-side"
                        ? "bg-stone-800 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                    title="Testo a fronte in due colonne parallele"
                  >
                    Facciata a fronte
                  </button>
                  <button
                    onClick={() => setLayoutMode("interlinear")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      layoutMode === "interlinear"
                        ? "bg-stone-800 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                    title="Righe alternate tradotte direttamente sotto"
                  >
                    Riga a riga
                  </button>
                </div>

                {/* Font size adjustments */}
                <div className="flex items-center gap-1.5" id="size-options">
                  <FontIcon className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-xs text-stone-500 font-medium mr-1">Carattere:</span>
                  {(["sm", "base", "lg", "xl"] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase transition-all ${
                        fontSize === sz
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Show/Hide translation utility toggle */}
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showTranslations}
                      onChange={(e) => setShowTranslations(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    <span className="ml-2 text-xs font-semibold text-stone-600">Traduzione</span>
                  </label>
                </div>
              </div>

              {/* Story Canvas */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm relative" id="book-content-paper">
                
                {/* Audio voice help badge top corner */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                        currentStory.level === "A1"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-sky-50 text-sky-700 border border-sky-100"
                      }`}>
                        Livello {currentStory.level}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">•</span>
                      <span className="text-xs text-stone-500 font-semibold italic flex items-center gap-1">
                        {!currentStory.id.startsWith("ai") && !currentStory.id.startsWith("custom") ? "Lettura d'autore permanente" : "Generata dall'Intelligenza Artificiale"}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold font-display text-amber-950 mt-1">
                      {currentStory.titleRu}
                    </h2>
                    <p className="text-md text-stone-500 italic mt-0.5">
                      {currentStory.titleIt}
                    </p>
                  </div>

                  {/* Slow audio controller speed & main note */}
                  <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200/60" id="audio-settings-box">
                    <span className="text-[11px] text-stone-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      Velocità Audio:
                    </span>
                    <select
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="bg-white border border-stone-200 text-xs rounded px-1.5 py-0.5 font-bold text-stone-700 cursor-pointer focus:outline-none"
                    >
                      <option value="0.5">0.5x (Super Lento)</option>
                      <option value="0.65">0.65x (Molto Lento)</option>
                      <option value="0.8">0.8x (Principiante)</option>
                      <option value="1.0">1.0x (Naturale)</option>
                    </select>
                  </div>
                </div>

                {/* Introduction section */}
                {currentStory.introduction && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50/20 border-l-4 border-amber-400 text-stone-600 text-sm italic leading-relaxed">
                    {currentStory.introduction}
                  </div>
                )}

                {/* Helpful Tip */}
                <div className="mb-6 text-xs text-amber-800 bg-amber-50/60 p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                  <div className="bg-amber-100 rounded-full p-1 text-amber-800 shrink-0 font-bold text-[10px] w-5 h-5 flex items-center justify-center">?</div>
                  <p className="leading-snug">
                    <strong>Suggerimento senza stress su come usare l'app:</strong> Tocca o fai clic su qualsiasi parola russa sottolineata nel testo per visualizzare istantaneamente la traduzione a fronte, la pronuncia fonetica e la grammatica! Clicca sull'icona <Volume2 className="w-3 h-3 inline text-amber-700" /> per sentire la lettura parlata a velocità facilitata.
                  </p>
                </div>

                {/* The paragraphs list */}
                <div className="space-y-6" id="story-paragraphs-container">
                  {currentStory.paragraphs.map((para, index) => {
                    const isParaSpeaking = isPlaying === index;
                    
                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-2xl transition-all duration-200 border ${
                          isParaSpeaking 
                            ? "bg-amber-50/50 border-amber-300" 
                            : "bg-stone-50/30 hover:bg-stone-50/70 border-stone-100"
                        }`}
                        id={`paragraph-block-${index}`}
                      >
                        {/* Speaker identifier if dialogue */}
                        {para.speaker && (
                          <div className="text-xs font-bold text-amber-800 uppercase tracking-widest gap-2 flex items-center mb-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            {para.speaker}
                          </div>
                        )}

                        <div className={`grid ${layoutMode === "side-by-side" ? "grid-cols-1 md:grid-cols-2 gap-4" : "grid-cols-1 gap-2"}`}>
                          
                          {/* Russian Column/Segment */}
                          <div className="space-y-1">
                            <div className="flex items-start gap-2">
                              {/* Inline TTS audio play button */}
                              <button
                                onClick={() => speakParagraph(para.ru, index)}
                                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                                  isParaSpeaking
                                    ? "bg-amber-600 text-[#fdfbf7]"
                                    : "bg-[#f4f2ee] hover:bg-[#e8e6e1] text-stone-600"
                                }`}
                                title="Clonna audio per questo paragrafo"
                              >
                                {isParaSpeaking ? (
                                  <Pause className="w-3.5 h-3.5" />
                                ) : (
                                  <Volume2 className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Russian text markup with accents and clickable words */}
                              <p className={`font-medium tracking-wide leading-relaxed text-stone-900 ${
                                fontSize === "sm" ? "text-sm" :
                                fontSize === "base" ? "text-base" :
                                fontSize === "lg" ? "text-lg" : "text-xl"
                              }`}>
                                {renderRussianWords(para.ru, para.ru)}
                              </p>
                            </div>
                          </div>

                          {/* Italian counterpart (can be hidden) */}
                          {showTranslations && (
                            <div className={`text-stone-500 italic pl-1 flex items-start gap-1 pt-1 md:pt-0 ${
                              layoutMode === "side-by-side" 
                                ? "md:border-l md:border-stone-200/90 md:pl-4" 
                                : ""
                            }`}>
                              <span className="text-[10px] py-0.5 px-1 bg-stone-100 text-stone-400 rounded uppercase font-bold tracking-tight shrink-0 mr-1.5">it</span>
                              <p className={`leading-relaxed ${
                                fontSize === "sm" ? "text-xs" :
                                fontSize === "base" ? "text-sm" :
                                fontSize === "lg" ? "text-sm md:text-base" : "text-base md:text-lg"
                              }`}>
                                {para.it}
                              </p>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vocab Table of Authorial selections or Custom generated terms */}
                {currentStory.vocabulary && currentStory.vocabulary.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-stone-100">
                    <h3 className="font-bold text-stone-800 font-display text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4 text-amber-600 fill-amber-100" />
                      Vocabolario della Lettura
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {currentStory.vocabulary.map((vocab, index) => (
                        <div 
                          key={index} 
                          onClick={() => handleWordClick(vocab.ru, `Vocabolario: ${vocab.ru} - ${vocab.it}`)}
                          className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 hover:bg-amber-50/40 hover:border-amber-200 transition-colors cursor-pointer group flex flex-col justify-between"
                        >
                          <div>
                            <span className="font-bold text-stone-950 font-mono tracking-wide group-hover:text-amber-950">
                              {vocab.ru}
                            </span>
                            <span className="mx-1.5 text-stone-400">---</span>
                            <span className="text-xs text-stone-600 font-medium font-sans">
                              {vocab.it}
                            </span>
                          </div>
                          {vocab.note && (
                            <span className="text-[10px] text-stone-400 mt-1 block italic text-ellipsis overflow-hidden whitespace-nowrap">
                              {vocab.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Explaining Word details overlay / panel */}
              <div 
                className={`transition-all duration-300 ${
                  isExplaining || wordExplanation || explainError ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden"
                }`}
                id="explanation-canvas-wrapper"
              >
                <div className="bg-[#fcf8f2] rounded-3xl p-6 border-2 border-amber-300/80 shadow-md relative">
                  
                  {/* Close button */}
                  <button
                    onClick={() => {
                      setSelectedWord(null);
                      setWordExplanation(null);
                      setExplainError(null);
                    }}
                    className="absolute top-4 right-4 bg-stone-200/60 hover:bg-stone-200 text-stone-600 hover:text-stone-900 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-xs font-bold"
                  >
                    ✕
                  </button>

                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Dizionario Avanzato Assistito da IA</span>
                  </div>

                  {/* LOADING STATE */}
                  {isExplaining && (
                    <div className="py-6 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 text-amber-700 animate-spin" />
                      <p className="text-xs text-stone-500 font-medium">
                        Analizzando "<span className="font-bold">{selectedWord}</span>" nel contesto della frase...
                      </p>
                    </div>
                  )}

                  {/* ERROR STATE */}
                  {explainError && (
                    <div className="py-4 text-center">
                      <p className="text-sm text-red-600 font-semibold">{explainError}</p>
                      <button
                        onClick={() => selectedWord && handleWordClick(selectedWord, selectedWordContext)}
                        className="mt-3 px-3 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                      >
                        Riprova
                      </button>
                    </div>
                  )}

                  {/* DATA LOADED SUCCESS */}
                  {wordExplanation && !isExplaining && (
                    <div className="space-y-4">
                      
                      {/* Flex core terms */}
                      <div className="flex flex-wrap items-baseline gap-x-4">
                        <span className="text-2xl font-bold text-amber-950 font-mono tracking-wider">
                          {wordExplanation.word}
                        </span>
                        
                        {wordExplanation.ipa && (
                          <span className="text-xs text-stone-500 font-medium bg-stone-100 rounded px-2 py-0.5">
                            pronuncia: <span className="font-mono text-stone-700 italic">{wordExplanation.ipa}</span>
                          </span>
                        )}

                        {wordExplanation.dictForm && (
                          <span className="text-xs text-stone-500 font-medium">
                            forma base: <span className="font-mono text-amber-900 font-bold">{wordExplanation.dictForm}</span>
                          </span>
                        )}
                      </div>

                      {/* Main Translation banner */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pb-3 border-b border-amber-200/50">
                        <div className="md:col-span-4">
                          <span className="text-xs text-stone-400 block font-semibold uppercase">Traduzione</span>
                          <span className="font-bold text-amber-900 text-lg leading-tight">{wordExplanation.translation}</span>
                        </div>
                        <div className="md:col-span-8">
                          <span className="text-xs text-stone-400 block font-semibold uppercase">Grammatica</span>
                          <span className="text-xs text-stone-700 font-semibold bg-amber-100/50 px-2 py-1 rounded block mt-1">{wordExplanation.grammar}</span>
                        </div>
                      </div>

                      {/* Deep Explaining in Context */}
                      <div>
                        <span className="text-xs text-stone-400 block font-semibold uppercase">Nota di utilizzo & Cultura</span>
                        <p className="text-sm text-stone-700 leading-relaxed mt-1">
                          {wordExplanation.explanation}
                        </p>
                      </div>

                      {/* Illustrative Example */}
                      {wordExplanation.examplesRu && (
                        <div className="p-3 bg-stone-100/90 rounded-2xl border border-stone-200/80">
                          <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wide">Esempio d'uso d'appoggio</span>
                          <p className="font-bold font-mono text-stone-900 text-sm mt-0.5">
                            {wordExplanation.examplesRu}
                          </p>
                          <p className="text-xs text-stone-600 italic mt-0.5">
                            {wordExplanation.examplesIt}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: JSON IMPORTER & CATALOG UTILITIES */}
        {activeTab === "import-json" && (
          <div className="max-w-4xl mx-auto" id="json-importer-canvas">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-8">
              
              {/* Introduction & Quick explanation */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between border-b border-stone-100 pb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-amber-950 flex items-center gap-2">
                    <Plus className="w-6 h-6 text-amber-700 stroke-[2.5]" />
                    Gestione Catalogo & Importatore JSON
                  </h2>
                  <p className="text-xs text-stone-500 mt-1 max-w-xl text-stone-500 font-medium">
                    Vuoi arricchire la tua libreria? Carica nuove letture incollando un pacchetto formattato in JSON, oppure seleziona all'istante uno dei nostri incantevoli racconti aggiuntivi.
                  </p>
                </div>
                
                {/* Reset button right on top */}
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="px-3.5 py-2 text-xs font-bold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100/70 border border-red-200 rounded-xl transition duration-150 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Effettua Ripristino Catalogo
                </button>
              </div>

              {/* SECTION A: READY STORIES (1-CLICK LOAD) */}
              <div>
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
                  🚀 Racconti d'esempio aggiuntivi (Caricamento con 1-Click)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {EXTRA_TEMPLATES.map((tmpl, idx) => {
                    const alreadyExists = stories.some(s => s.id === tmpl.data.id);
                    return (
                      <div 
                        key={idx} 
                        className="p-4 rounded-2xl border border-stone-200/90 bg-stone-50/40 hover:bg-stone-50 transition duration-150 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold rounded-md px-1.5 py-0.5">
                              {tmpl.data.level}
                            </span>
                            <span className="text-[10px] text-stone-400 font-semibold">
                              {tmpl.data.type === "story" ? "Racconto" : "Dialogo"}
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-stone-800 text-sm leading-tight">
                            {tmpl.name}
                          </h4>
                          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                            {tmpl.description}
                          </p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleLoadTemplate(tmpl.data)}
                          className={`mt-4 w-full py-1.5 text-xs font-bold rounded-lg transition-all duration-150 border uppercase cursor-pointer ${
                            alreadyExists
                              ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                              : "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300"
                          }`}
                          disabled={alreadyExists}
                        >
                          {alreadyExists ? "Già nel catalogo" : "Importa lettura"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B: PASTE CUSTOM JSON SOURCE */}
              <div className="border-t border-stone-100 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                    ✏️ Incolla del Testo personalizzato (Formato JSON)
                  </h3>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const demoPayload = {
                        titleRu: "Моя́ ма́ленькая исто́рия",
                        titleIt: "La Mia Nuova Lettura",
                        type: "story",
                        level: "A1",
                        introduction: "Un esempio di testo da personalizzare a piacimento.",
                        paragraphs: [
                          {
                            ru: "Я изуча́ю ру́сский язы́к ка́ждый день.",
                            it: "Studio la lingua russa ogni giorno."
                          },
                          {
                            ru: "Э́то о́чень интере́сно!",
                            it: "Questo è molto interessante!"
                          }
                        ],
                        vocabulary: [
                          { ru: "Каждый день", it: "Ogni giorno", note: "Espressione temporale accusativa neutra" }
                        ],
                        grammarFocus: {
                          topic: "I verbi regolari",
                          explanation: "Il verbo 'изучать' (studiare) segue la prima coniugazione regolare (я изучаю)."
                        }
                      };
                      setJsonInput(JSON.stringify(demoPayload, null, 2));
                      setJsonError(null);
                    }}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline duration-150 cursor-pointer text-left"
                  >
                    Carica modello base da modificare
                  </button>
                </div>

                <form onSubmit={handleImportJson} className="space-y-4">
                  
                  {/* Select Mode Switcher */}
                  <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                    <span className="font-bold text-stone-600">Modalità di importazione:</span>
                    
                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-stone-700 select-none">
                      <input 
                        type="radio" 
                        name="importMode" 
                        value="append" 
                        checked={importMode === "append"} 
                        onChange={() => setImportMode("append")}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      Aggiungi alle letture esistenti
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-stone-700 select-none">
                      <input 
                        type="radio" 
                        name="importMode" 
                        value="replace" 
                        checked={importMode === "replace"} 
                        onChange={() => setImportMode("replace")}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      Sostituisci l'intero catalogo
                    </label>
                  </div>

                  {/* Textarea code style */}
                  <div className="relative">
                    <textarea
                      value={jsonInput}
                      onChange={(e) => {
                        setJsonInput(e.target.value);
                        setJsonError(null);
                      }}
                      rows={12}
                      placeholder='{
  "titleRu": "Пое́здка в метро́",
  "titleIt": "Un viaggio in metropolitana",
  "type": "story",
  "level": "A1",
  ... (fai clic su "Carica modello base" in alto per riempire automaticamente)
}'
                      className="w-full rounded-2xl border border-stone-200 p-4 text-xs font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-amber-600/40 bg-zinc-950 text-emerald-400 selection:bg-emerald-800 shadow-inner"
                    />
                  </div>

                  {/* Permissive parser notice & Server persistence checker */}
                  <div className="bg-stone-50/50 p-5 rounded-2xl border border-stone-200 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                          ✨ Tolleranza della Sintassi Attiva
                        </span>
                        <p className="text-stone-500 font-medium leading-relaxed max-w-lg">
                          Non preoccuparti se dimentichi una virgola di troppo, se usi gli apici singoli (<code className="bg-stone-200/60 px-1 py-0.5 rounded font-mono text-[10px]">'</code>) o se ometti le virgolette sulle chiavi: il nostro parser integrato si auto-corregge prima di scrivere su file!
                        </p>
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer font-bold text-stone-800 select-none bg-white py-2 px-4 rounded-xl border border-stone-300 shadow-xs hover:bg-stone-50 transition shrink-0">
                        <input 
                          type="checkbox" 
                          checked={saveToServerDir} 
                          onChange={(e) => setSaveToServerDir(e.target.checked)}
                          className="w-4 h-4 text-amber-800 focus:ring-amber-500 border-stone-300 rounded"
                        />
                        <span>💾 Salva in /public/stories/</span>
                      </label>
                    </div>

                    <div className="border-t border-stone-200/60 pt-3 flex items-start gap-2.5 text-xs text-stone-600 font-medium">
                      <FolderOpen className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-stone-800 block">Metodo Diretto Alternativo:</span>
                        Se preferisci, puoi semplicemente inserire o creare i tuoi file JSON direttamente nella cartella <code className="bg-stone-100 font-bold px-1 py-0.5 rounded text-amber-850 font-mono text-[11px]">/public/stories/</code> del progetto (tramite il gestore file a sinistra). L'applicazione caricherà e indicizzerà in tempo reale ogni nuova storia!
                      </div>
                    </div>
                  </div>

                  {/* Success Warning banners */}
                  {jsonSuccess && (
                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      {jsonSuccess}
                    </div>
                  )}

                  {jsonError && (
                    <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs font-semibold">
                      ❌ Errore di validazione: <span className="font-mono text-[11px] block mt-1 py-1 px-2 bg-white/60 rounded border border-red-100">{jsonError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-stone-950 text-white font-bold py-3 px-6 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Valida ed Importa Lettura nel Catalogo</span>
                  </button>

                </form>
              </div>

              {/* Quick Instructions & Schema references */}
              <div className="bg-amber-50/20 p-5 rounded-2xl border border-amber-200/40 text-xs text-stone-600 space-y-2">
                <h4 className="font-bold text-stone-800">Manuale dello Schema GradedStory:</h4>
                <p>
                  Per un corretto funzionamento del lettore graduato acustico e interattivo, ogni racconto inserito deve rispettare fedelmente la seguente struttura di attributi obbligatori:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-stone-500 font-mono text-[10px]">
                  <li><strong>titleRu</strong> (string): Titolo in lingua russa (possibilmente con accenti, es: "В кафе́").</li>
                  <li><strong>titleIt</strong> (string): Traduzione italiana speculare del titolo.</li>
                  <li><strong>type</strong> (string): Deve essere unicamente "story" (racconto) oppure "dialogue" (dialogo).</li>
                  <li><strong>level</strong> (string): Deve essere "A1" o "A2" per allinearsi alle fasce QCER.</li>
                  <li><strong>paragraphs</strong> (array): Elenco di oggetti con chiavi <span className="font-mono font-bold">ru</span> (riga russa) ed <span className="font-mono font-bold">it</span> (italiano).</li>
                  <li><strong>vocabulary</strong> (array - opzionale): Termini tradotti elencati in fondo con <span className="font-bold">ru</span>, <span className="font-bold">it</span>, e <span className="font-bold">note</span>.</li>
                </ul>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200 bg-stone-50 py-8 px-4" id="main-footer-section">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-stone-500 text-xs gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-stone-800">Lettore Russo Graduato</p>
            <p className="mt-1">Imparare il russo con letture calibrate e traduzione speculare automatica senza stress.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-300">|</span>
            <p>Sviluppato con l'ausilio di modelli Gemini AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
