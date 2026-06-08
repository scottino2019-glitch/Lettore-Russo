export interface Paragraph {
  ru: string;
  it: string;
  speaker?: string;
}

export interface VocabularyItem {
  ru: string;
  it: string;
  note: string;
}

export interface GrammarFocus {
  topic: string;
  explanation: string;
}

export interface GradedStory {
  id: string;
  titleRu: string;
  titleIt: string;
  type: "dialogue" | "story";
  level: "A1" | "A2";
  introduction: string;
  paragraphs: Paragraph[];
  vocabulary: VocabularyItem[];
  grammarFocus: GrammarFocus;
  origin?: string;
  filename?: string;
}

export const PRESET_STORIES: GradedStory[] = [
  {
    id: "di-parco",
    titleRu: "В па́рке (Nel parco)",
    titleIt: "Incontro e Presentazioni",
    type: "dialogue",
    level: "A1",
    introduction: "Due giovani, Anna e Maksim, si incontrano casualmente in un bellissimo parco nel centro di Mosca. Conversano piacevolmente scoprendo i propri interessi.",
    paragraphs: [
      {
        ru: "Приве́т! Извини́те, э́то ме́сто свобо́дно?",
        it: "Ciao! Scusa, questo posto è libero?",
        speaker: "Анна"
      },
      {
        ru: "Приве́т! Да, коне́чно, сади́сь, пожа́луйста.",
        it: "Ciao! Sì, certo, siediti pure, prego.",
        speaker: "Максим"
      },
      {
        ru: "Спаси́бо. Меня́ зову́т А́нна. А тебя́?",
        it: "Grazie. Mi chiamo Anna. E tu?",
        speaker: "Анна"
      },
      {
        ru: "Очень прия́тно. Моё и́мя Макси́м. Ты ча́сто гуля́ешь здесь?",
        it: "Molto piacere. Il mio nome è Maksim. Passeggi spesso qui?",
        speaker: "Максим"
      },
      {
        ru: "Да, я люблю́ э́тот парк. Он очень краси́вый и ти́хий. А ты?",
        it: "Sì, amo questo parco. È molto bello e tranquillo. E tu?",
        speaker: "Анна"
      },
      {
        ru: "Я то́же. Я ча́сто чита́ю здесь кни́ги по выходны́м.",
        it: "Anche io. Leggo spesso libri qui nei fine settimana.",
        speaker: "Максим"
      },
      {
        ru: "Кака́я хоро́шая привы́чка! Что ты чита́ешь сейча́с?",
        it: "Che bella abitudine! Cosa stai leggendo adesso?",
        speaker: "Анна"
      },
      {
        ru: "Интере́сный рома́н. Рад был познако́миться, А́нна!",
        it: "Un romanzo interessante. È stato un piacere conoscerti, Anna!",
        speaker: "Максим"
      },
      {
        ru: "Взаи́мно, Макси́м. Хоро́шего дня!",
        it: "Reciproco, Maksim. Buona giornata!",
        speaker: "Анна"
      }
    ],
    vocabulary: [
      { ru: "Извините", it: "Scusi / Scusate", note: "Formula di cortesia o per iniziare una frase" },
      { ru: "Свободно", it: "Libero", note: "Usato anche per indicare posti non occupati" },
      { ru: "Пожалуйста", it: "Prego / Per favore", note: "La 'й' non si pronuncia forte" },
      { ru: "Очень приятно", it: "Molto piacere", note: "Risposta standard quando ci si presenta" },
      { ru: "Часто", it: "Spesso", note: "Avverbio di frequenza" },
      { ru: "По выходным", it: "Nei fine settimana", note: "Caso dativo plurale per abitudine" }
    ],
    grammarFocus: {
      topic: "Espressioni per Presentarsi (Меня зовут...)",
      explanation: "In russo, per dire 'Mi chiamo...' si usa l'espressione 'Меня зовут...' letteralmente 'Mi chiamano...'. Il nome 'Anna' rimane al nominativo, ma se usassimo un pronome per presentare qualcuno, useremmo i pronomi al caso accusativo (меня = me, тебя = te, его = lui, её = lei)."
    }
  },
  {
    id: "di-cafe",
    titleRu: "В кафе́ (Al bar - Al caffè)",
    titleIt: "Ordinare da bere e da mangiare",
    type: "dialogue",
    level: "A1",
    introduction: "Un cliente di nome Ivan ordina un pasto leggero e una bevanda calda in un accogliente caffè di San Pietroburgo, dialogando con la cameriera.",
    paragraphs: [
      {
        ru: "Здравствуйте! Мо́жно меню́, пожа́луйста?",
        it: "Salve! È possibile avere il menu, per favore?",
        speaker: "Иван"
      },
      {
        ru: "Здравствуйте! Да, вот, возьми́те, пожа́луйста.",
        it: "Salve! Sì, ecco, prenda pure.",
        speaker: "Официант"
      },
      {
        ru: "Спаси́бо. Что у вас сего́дня вку́сное?",
        it: "Grazie. Cosa avete di buono (saporito) oggi?",
        speaker: "Иван"
      },
      {
        ru: "У нас есть све́жий борщ и отли́чные блины́ с мёдом.",
        it: "Abbiamo del borscht fresco e ottime bliny (crespelle) con miele.",
        speaker: "Официант"
      },
      {
        ru: "Прекра́сно. Я бу́ду борщ и ча́шку чёрного кофе.",
        it: "Benissimo. Prenderò (sarà) il borscht e una tazza di caffè nero.",
        speaker: "Иван"
      },
      {
        ru: "Хорошо́. Кофе с са́харом?",
        it: "Va bene. Caffè con lo zucchero?",
        speaker: "Официант"
      },
      {
        ru: "Нет, без са́хара, но мо́жно с молоко́м, пожа́луйста.",
        it: "No, senza zucchero, ma se possibile con latte, per favore.",
        speaker: "Иван"
      },
      {
        ru: "Да, коне́чно. Оди́н мину́ту.",
        it: "Sì, certo. Un minuto.",
        speaker: "Официант"
      }
    ],
    vocabulary: [
      { ru: "Можно...", it: "Si può... / È possibile...", note: "Utilissimo per chiedere cose in modo gentile" },
      { ru: "Возьмите", it: "Prenda / Prendete", note: "Imperativo del verbo 'vendere' o 'prendere'" },
      { ru: "Вкусное", it: "Saporito / Gustoso", note: "Aggettivo neutro riferito a ciò che si mangia" },
      { ru: "Блины", it: "Bliny (crêpes russe)", note: "Piatto tradizionale russo amatissimo" },
      { ru: "Я буду...", it: "Prenderò... / Sceglierò...", note: "Letteralmente significa 'Io sarò...'" },
      { ru: "Без сахара", it: "Senza zucchero", note: "La preposizione 'Без' vuole il caso Genitivo" }
    ],
    grammarFocus: {
      topic: "Le preposizioni 'С' (con) e 'БЕЗ' (senza)",
      explanation: "La preposizione 'С' (con) richiede il caso Strumentale (es. с молоко́м - con latte, с са́харом - con zucchero). Invece la preposizione 'БЕЗ' (senza) richiede il caso Genitivo (es. без са́хара - senza zucchero, без молока́ - senza latte). Nota come cambiano le desinenze finali delle parole!"
    }
  },
  {
    id: "st-gatto",
    titleRu: "Кот, кото́рый уме́л говори́ть (Il gatto che sapeva parlare)",
    titleIt: "Una favola moderna e rilassante",
    type: "story",
    level: "A2",
    introduction: "Un racconto tenero e magico su un signore solitario che vive a Mosca ed un gatto randagio molto speciale che bussa alla sua porta.",
    paragraphs: [
      {
        ru: "Оди́н ста́рый челове́к по и́мени Ви́ктор жил в ма́ленькой кварти́ре в Москве́.",
        it: "Un vecchio signore di nome Viktor viveva in un piccolo appartamento a Mosca."
      },
      {
        ru: "Он был одино́к, но у него́ было много книг и тёплых воспомина́ний.",
        it: "Era solo, ma aveva molti libri e caldi ricordi."
      },
      {
        ru: "Одна́жды ве́чером он услы́шал ти́хий звук из окна́: 'Мяу'.",
        it: "Una sera sentì un suono sommesso dalla finestra: 'Miao'."
      },
      {
        ru: "Ви́ктор откры́л окно́ и уви́дел на подоко́ннике се́рого пуши́стого кота́.",
        it: "Viktor aprì la finestra e vide sul davanzale un gatto grigio e soffice."
      },
      {
        ru: "Кот посмотре́л на него́ и сказа́л на чи́стом ру́сском языке́: 'Холо́дно сего́дня, да?'",
        it: "Il gatto lo guardò e disse in perfetto russo: 'Fa freddo oggi, vero?'"
      },
      {
        ru: "Ви́ктор очень удиви́лся, но впусти́л его́ в ко́мнату и предложи́л подогре́тое молоко́.",
        it: "Viktor si meravigliò moltissimo, ma lo fece entrare nella stanza e gli offrì del latte riscaldato."
      },
      {
        ru: "С тех пор они́ живу́т вме́сте, пьют чай, чита́ют ска́зки и обща́ются о филосо́фии.",
        it: "Da allora vivono insieme, bevono tè, leggono fiabe e chiacchierano di filosofia."
      }
    ],
    vocabulary: [
      { ru: "По имени", it: "Di nome", note: "Letteralmente 'per nome'" },
      { ru: "Однажды", it: "Un giorno / Una volta", note: "Usato per avviare le narrazioni passate" },
      { ru: "Подоконник", it: "Davanzale", note: "Composto da под (sotto) e окно (finestra)" },
      { ru: "Удивился", it: "Si meravigliò", note: "Verbo riflessivo al passato maschile" },
      { ru: "С тех пор", it: "Da allora", note: "Costruzione idiomatica temporale" },
      { ru: "Общаются", it: "Chiacchierano / Socializzano", note: "Verbo imperfettivo plur. presente" }
    ],
    grammarFocus: {
      topic: "Il Tempo Passato dei Verbi",
      explanation: "Il tempo passato in russo è insolitamente semplice! Non ci sono ausiliari (tipo essere o avere). Si prende l'infinito del verbo (es. жить - vivere, говорить - parlare), si toglie '-ть' e si aggiunge '-л' per il maschile, '-ла' per il femminile, '-ло' per il neutro e '-ли' per il plurale. Viktor 'жил' (maschile), ma se fosse Anna sarebbe 'жила'."
    }
  },
  {
    id: "st-routina",
    titleRu: "Мой прекра́сный день (Il mio giorno perfetto)",
    titleIt: "La routine di una ragazza principiante",
    type: "story",
    level: "A1",
    introduction: "Elena descrive in modo semplice la sua giornata tipica. Un ottimo stimolo per apprendere verbi quotidiani e orari senza stress.",
    paragraphs: [
      {
        ru: "Обы́чно я встаю́ ра́но, в семь часов утра́.",
        it: "Di solito mi sveglio presto, alle sette del mattino."
      },
      {
        ru: "Я де́лаю лёгкую заря́дку, умыва́юсь и иду́ на ку́хню.",
        it: "Faccio una leggera ginnastica, mi lavo la faccia e vado in cucina."
      },
      {
        ru: "На за́втрак я люблю́ пить зелёный чай и есть овся́ную ка́шу с я́годами.",
        it: "A colazione amo bere tè verde e mangiare pappa d'avena con frutti di bosco."
      },
      {
        ru: "Пото́м я е́ду на рабо́ту на метро́. Я рабо́таю в библио́теке.",
        it: "Poi vado al lavoro in metropolitana. Lavoro in biblioteca."
      },
      {
        ru: "Там всегда́ ти́хо, много хоро́ших книг и добрых люде́й.",
        it: "Lì è sempre silenzioso, ci sono molti bei libri e persone gentili."
      },
      {
        ru: "Ве́чером я возвраща́юсь домо́й, гото́влю у́жин и слу́шаю класси́ческую му́зыку.",
        it: "La sera ritorno a casa, preparo la cena e ascolto musica classica."
      },
      {
        ru: "Я ложу́сь спать в деся́ть часов. Я люблю́ мою́ жизнь!",
        it: "Vado a dormire alle dieci. Amo la mia vita!"
      }
    ],
    vocabulary: [
      { ru: "Обычно", it: "Di solito", note: "Avverbio di frequenza molto comune" },
      { ru: "Зарядка", it: "Ginnastica / Esercizi", note: "Letteralmente 'ricarica' (come per le batterie!)" },
      { ru: "Умываюсь", it: "Mi lavo (il viso)", note: "Verbo riflessivo quotidiano" },
      { ru: "Каша", it: "Cereale cotto / Porridge", note: "Piatto forte della colazione russa" },
      { ru: "Пешком / На метро", it: "A piedi / In metro", note: "Mezzi di trasporto con preposizioni" },
      { ru: "Домой", it: "A casa (moto a luogo)", note: "Da non confondere con 'Дома' (stato in luogo)" }
    ],
    grammarFocus: {
      topic: "Moto a Luogo (Домой) vs Stato in Luogo (Дома)",
      explanation: "Attenzione a questo trabocchetto russo! Quando rispondi alla domanda 'Dove sei?' (Stato) usi 'Дома' (a casa, es: Я дома). Quando rispondi alla domanda 'Dove vai?' (Moto a luogo) usi l'avverbio 'Домой' (verso casa, es: Я иду домой). Spesso i principianti confondono queste due parole."
    }
  }
];
