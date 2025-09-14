import Sentiment from "sentiment";
import { franc } from "franc";
import compromise from "compromise";
import { GoogleGenerativeAI } from "@google/generative-ai";

// -------------------------
// Local Sentiment Analyzer (Fallback)
// -------------------------
const sentiment = new Sentiment();

// -------------------------
// Gemini Setup (CRA)
// -------------------------
let geminiModel = null;

const initGemini = (useBackupModel = false) => {
  if (!geminiModel) {
    const apiKey =
      process.env.REACT_APP_GEMINI_API_KEY || localStorage.getItem("gemini_api_key");

    if (!apiKey) {
      throw new Error("Please set your Gemini API key in .env or localStorage");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = useBackupModel ? "gemini-pro" : "gemini-2.5-flash-lite";
    geminiModel = genAI.getGenerativeModel({ model: modelName });
  }
  return geminiModel;
};

// -------------------------
// Gemini API Helper with Retry + Fallback Model
// -------------------------
const callGeminiAPI = async (prompt, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const useBackup = attempt > 0; // 2nd try uses gemini-pro
      const model = initGemini(useBackup);
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error(`Gemini API Error (attempt ${attempt + 1}):`, error);

      // Retry only on overload (503) or quota issues
      if (
        (error.status === 503 || error.message?.includes("503")) &&
        attempt < retries
      ) {
        const waitTime = Math.pow(2, attempt) * 1000; // 1s → 2s → 4s
        console.log(`Model overloaded, retrying in ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      throw error;
    }
  }
};

// -------------------------
// Language Codes
// -------------------------
const languageCodes = {
  eng: "English",
  spa: "Spanish",
  fra: "French",
  deu: "German",
  ita: "Italian",
  por: "Portuguese",
  rus: "Russian",
  jpn: "Japanese",
  kor: "Korean",
  chi: "Chinese",
  ara: "Arabic",
  hin: "Hindi",
};

// -------------------------
// Phase 1: High Impact
// -------------------------
export const analyzeSentiment = async (text) => {
  if (!text.trim()) return null;

  try {
    const prompt = `Analyze the sentiment of the following text and provide JSON only:
    Text: "${text}"

    JSON format:
    {
      "score": -5 to 5,
      "label": "Very Positive" | "Positive" | "Neutral" | "Negative" | "Very Negative",
      "confidence": 0-100,
      "emotions": ["..."],
      "reasoning": "..."
    }`;

    const result = await callGeminiAPI(prompt);
    const analysis = JSON.parse(result);

    return {
      score: analysis.score,
      comparative: analysis.score / 5,
      label: analysis.label,
      confidence: analysis.confidence,
      emotions: analysis.emotions || [],
      reasoning: analysis.reasoning,
      positive:
        analysis.emotions?.filter((e) =>
          ["joy", "happiness", "excitement", "love"].includes(e.toLowerCase())
        ) || [],
      negative:
        analysis.emotions?.filter((e) =>
          ["anger", "sadness", "fear", "disgust"].includes(e.toLowerCase())
        ) || [],
    };
  } catch (error) {
    console.warn("Fallback sentiment analysis:", error.message);
    const result = sentiment.analyze(text);
    let sentimentLabel = "Neutral";

    if (result.score > 2) sentimentLabel = "Very Positive";
    else if (result.score > 0) sentimentLabel = "Positive";
    else if (result.score < -2) sentimentLabel = "Very Negative";
    else if (result.score < 0) sentimentLabel = "Negative";

    return {
      score: result.score,
      comparative: result.comparative,
      label: sentimentLabel,
      confidence: Math.abs(result.comparative * 100),
      emotions: [],
      reasoning: "Basic sentiment analysis",
      positive: result.positive,
      negative: result.negative,
    };
  }
};

export const detectLanguage = (text) => {
  if (!text.trim()) return null;
  const langCode = franc(text);
  return {
    code: langCode,
    language: languageCodes[langCode] || "Unknown",
    confidence: langCode !== "und" ? "High" : "Low",
  };
};

export const summarizeText = async (text, sentences = 3) => {
  if (!text.trim()) return [];
  try {
    const prompt = `Create 3 different summaries of the following text, each in exactly ${sentences} sentences. Make each summary unique in style and focus:

    Text: "${text}"

    Return in JSON format:
    [
      {"option": 1, "title": "Concise Summary", "text": "..."},
      {"option": 2, "title": "Detailed Summary", "text": "..."},
      {"option": 3, "title": "Key Points Summary", "text": "..."}
    ]`;

    const result = await callGeminiAPI(prompt);
    const summaries = JSON.parse(result);
    return Array.isArray(summaries) ? summaries : [];
  } catch (error) {
    console.warn("Fallback summarization:", error.message);
    const doc = compromise(text);
    const allSentences = doc.sentences().out("array");

    if (allSentences.length <= sentences) {
      return [{"option": 1, "title": "Original Text", "text": text}];
    }

    const summary1 = [allSentences[0], allSentences[Math.floor(allSentences.length / 2)], allSentences.at(-1)].slice(0, sentences).join(" ");
    const summary2 = allSentences.slice(0, sentences).join(" ");
    const summary3 = allSentences.slice(-sentences).join(" ");

    return [
      {"option": 1, "title": "Key Points", "text": summary1},
      {"option": 2, "title": "Beginning Focus", "text": summary2},
      {"option": 3, "title": "Ending Focus", "text": summary3}
    ];
  }
};

export const checkGrammar = async (text) => {
  if (!text.trim()) return [];
  try {
    const prompt = `Analyze this text for grammar, spelling, and style issues:
    Text: "${text}"

    Return JSON array only:
    [
      {
        "type": "grammar|spelling|punctuation|style|clarity",
        "message": "...",
        "original": "...",
        "suggestion": "...",
        "severity": "low|medium|high"
      }
    ]`;
    const result = await callGeminiAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.warn("Fallback grammar check:", error.message);
    const doc = compromise(text);
    const suggestions = [];
    const sentences = doc.sentences().out("array");
    sentences.forEach((s, i) => {
      if (s[0] !== s[0]?.toUpperCase())
        suggestions.push({
          type: "capitalization",
          message: "Sentence should start with a capital letter",
          original: s,
          suggestion: s[0].toUpperCase() + s.slice(1),
          severity: "medium",
          position: i,
        });
      if (s.includes("  "))
        suggestions.push({
          type: "spacing",
          message: "Remove extra spaces",
          original: s,
          suggestion: s.replace(/\s+/g, " "),
          severity: "low",
          position: i,
        });
      if (!/[.!?]$/.test(s))
        suggestions.push({
          type: "punctuation",
          message: "Consider adding punctuation at the end",
          original: s,
          suggestion: s + ".",
          severity: "medium",
          position: i,
        });
    });
    return suggestions;
  }
};

// -------------------------
// Phase 2: Medium Complexity
// -------------------------
export const paraphraseText = async (text) => {
  if (!text.trim()) return [];
  try {
    const prompt = `Create 3 different paraphrases of the following text, each with a different approach:

    Text: "${text}"

    Return in JSON format:
    [
      {"option": 1, "title": "Simple Paraphrase", "text": "..."},
      {"option": 2, "title": "Formal Paraphrase", "text": "..."},
      {"option": 3, "title": "Creative Paraphrase", "text": "..."}
    ]`;

    const result = await callGeminiAPI(prompt);
    const paraphrases = JSON.parse(result);
    return Array.isArray(paraphrases) ? paraphrases : [];
  } catch (error) {
    console.warn("Fallback paraphrasing:", error.message);
    const synonyms = { good: "excellent", bad: "poor", fast: "quick", happy: "joyful", important: "significant" };
    
    const simple = text.replace(/\b(good|bad|fast|happy|important)\b/gi, (m) => synonyms[m.toLowerCase()] || m);
    const formal = text.replace(/don't/g, "do not").replace(/can't/g, "cannot");
    const creative = `Here's another way to express this: ${text}`;

    return [
      {"option": 1, "title": "Simple Paraphrase", "text": simple},
      {"option": 2, "title": "Formal Paraphrase", "text": formal},
      {"option": 3, "title": "Creative Paraphrase", "text": creative}
    ];
  }
};

export const adjustTone = async (text, targetTone) => {
  if (!text.trim()) return [];
  try {
    const prompt = `Rewrite the following text in 3 different variations of ${targetTone} tone:

    Text: "${text}"

    Return in JSON format:
    [
      {"option": 1, "title": "Light ${targetTone}", "text": "..."},
      {"option": 2, "title": "Moderate ${targetTone}", "text": "..."},
      {"option": 3, "title": "Strong ${targetTone}", "text": "..."}
    ]`;

    const result = await callGeminiAPI(prompt);
    const variations = JSON.parse(result);
    return Array.isArray(variations) ? variations : [];
  } catch (error) {
    console.warn("Fallback tone adjustment:", error.message);
    let option1, option2, option3;

    switch (targetTone) {
      case "formal":
        option1 = text.replace(/can't/g, "cannot");
        option2 = text.replace(/can't/g, "cannot").replace(/I'm/g, "I am");
        option3 = `I would like to formally present the following: ${text.replace(/can't/g, "cannot").replace(/I'm/g, "I am")}`;
        break;
      case "casual":
        option1 = text.replace(/cannot/g, "can't");
        option2 = text.replace(/cannot/g, "can't").replace(/I am/g, "I'm");
        option3 = `Hey! ${text.replace(/cannot/g, "can't")} 😊`;
        break;
      case "professional":
        option1 = `Please note: ${text}`;
        option2 = `I would like to present: ${text}`;
        option3 = `In a professional capacity, I wish to communicate: ${text}`;
        break;
      case "friendly":
        option1 = `Hi there! ${text}`;
        option2 = `Hey friend! ${text} Hope this helps!`;
        option3 = `Hello! 😊 ${text} Have a great day!`;
        break;
      default:
        option1 = option2 = option3 = text;
    }

    return [
      {"option": 1, "title": `Light ${targetTone}`, "text": option1},
      {"option": 2, "title": `Moderate ${targetTone}`, "text": option2},
      {"option": 3, "title": `Strong ${targetTone}`, "text": option3}
    ];
  }
};

export const calculateReadability = (text) => {
  if (!text.trim()) return null;
  const doc = compromise(text);
  const sentences = doc.sentences().length;
  const words = doc.terms().length;
  const syllables = doc
    .terms()
    .out("array")
    .reduce((c, w) => c + countSyllables(w), 0);
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  let level = "Graduate";
  if (score >= 90) level = "Very Easy";
  else if (score >= 80) level = "Easy";
  else if (score >= 70) level = "Fairly Easy";
  else if (score >= 60) level = "Standard";
  else if (score >= 50) level = "Fairly Difficult";
  else if (score >= 30) level = "Difficult";
  return { score: Math.round(score), level, sentences, words, syllables };
};
const countSyllables = (w) =>
  (w.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").match(/[aeiouy]{1,2}/g) || [])
    .length || 1;

// -------------------------
// Phase 3: Advanced Features
// -------------------------
export const generateWritingPrompts = async (keywords) => {
  try {
    const prompt = `Generate a creative writing prompt with keywords: ${keywords.join(", ")}`;
    return (await callGeminiAPI(prompt)).trim();
  } catch {
    return `Write a story starting with "${keywords[0] || "a strange event"}..."`;
  }
};

export const extractKeywords = async (text) => {
  if (!text.trim()) return [];
  try {
    const prompt = `Extract max 10 keywords as JSON array:
    Text: "${text}"`;
    return JSON.parse(await callGeminiAPI(prompt));
  } catch {
    const doc = compromise(text);
    return [...new Set([...doc.nouns().out("array"), ...doc.adjectives().out("array")])]
      .filter((w) => w.length > 3)
      .slice(0, 10);
  }
};

export const generateHashtags = async (text) =>
  (await extractKeywords(text)).map((k) => `#${k.replace(/\s+/g, "")}`).slice(0, 5);

export const translateText = async (text, targetLanguage) => {
  if (!text.trim()) return [];
  try {
    const prompt = `Translate the following text to ${targetLanguage} in 3 different styles:

    Text: "${text}"

    Return in JSON format:
    [
      {"option": 1, "title": "Literal Translation", "text": "..."},
      {"option": 2, "title": "Natural Translation", "text": "..."},
      {"option": 3, "title": "Cultural Translation", "text": "..."}
    ]`;

    const result = await callGeminiAPI(prompt);
    const translations = JSON.parse(result);
    return Array.isArray(translations) ? translations : [];
  } catch (error) {
    console.warn("Fallback translation:", error.message);
    const mockTranslations = {
      'spanish': `[Traducido al español] ${text}`,
      'french': `[Traduit en français] ${text}`,
      'german': `[Ins Deutsche übersetzt] ${text}`,
      'italian': `[Tradotto in italiano] ${text}`
    };

    const baseTranslation = mockTranslations[targetLanguage] || `[Translated to ${targetLanguage}] ${text}`;
    
    return [
      {"option": 1, "title": "Literal Translation", "text": baseTranslation},
      {"option": 2, "title": "Natural Translation", "text": `${baseTranslation} (Natural style)`},
      {"option": 3, "title": "Cultural Translation", "text": `${baseTranslation} (Cultural adaptation)`}
    ];
  }
};

// -------------------------
// Engineering-Specific AI Features
// -------------------------

export const analyzeResearchPaper = async (text) => {
  if (!text.trim()) return null;
  
  try {
    const prompt = `Analyze this research paper/technical document and provide structured analysis:

    Text: "${text}"

    Return JSON format:
    {
      "abstract": "...",
      "keyFindings": ["...", "..."],
      "methodology": "...",
      "technicalTerms": ["...", "..."],
      "citations": ["...", "..."],
      "complexity": "Beginner|Intermediate|Advanced",
      "domain": "Computer Science|Mechanical|Electrical|Civil|Chemical|Other",
      "recommendations": ["...", "..."]
    }`;

    const result = await callGeminiAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.warn("Fallback research analysis:", error.message);
    return {
      abstract: "Unable to extract abstract",
      keyFindings: ["Analysis unavailable"],
      methodology: "Not identified",
      technicalTerms: extractTechnicalTerms(text),
      citations: extractCitations(text),
      complexity: "Intermediate",
      domain: "Engineering",
      recommendations: ["Review document manually"]
    };
  }
};

export const generateStudyNotes = async (text) => {
  if (!text.trim()) return [];
  
  try {
    const prompt = `Create comprehensive study notes from this technical content:

    Text: "${text}"

    Return JSON format:
    [
      {
        "section": "Key Concepts",
        "content": ["concept1", "concept2", "..."]
      },
      {
        "section": "Important Formulas",
        "content": ["formula1", "formula2", "..."]
      },
      {
        "section": "Definitions",
        "content": ["term1: definition1", "term2: definition2", "..."]
      },
      {
        "section": "Summary Points",
        "content": ["point1", "point2", "..."]
      }
    ]`;

    const result = await callGeminiAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.warn("Fallback study notes:", error.message);
    return [
      {
        section: "Key Concepts",
        content: extractKeyConceptsFallback(text)
      },
      {
        section: "Summary Points",
        content: [text.substring(0, 200) + "..."]
      }
    ];
  }
};

export const checkPlagiarism = async (text) => {
  if (!text.trim()) return null;
  
  try {
    const prompt = `Analyze this text for originality and potential plagiarism. Look for:
    1. Repetitive phrases that might be copied
    2. Unusual writing style changes
    3. Very formal or academic language that seems copied
    4. Generic or template-like content

    Text: "${text}"

    Return JSON format:
    {
      "riskLevel": "Low|Medium|High",
      "originalityScore": number_between_0_and_100,
      "suspiciousPatterns": ["pattern1", "pattern2"],
      "recommendations": ["recommendation1", "recommendation2"]
    }`;

    const result = await callGeminiAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.warn("Using basic plagiarism analysis:", error.message);
    
    // Simple plagiarism detection based on text patterns
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const words = text.split(/\s+/).filter(w => w);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    
    // Calculate originality based on vocabulary diversity
    const vocabularyDiversity = (uniqueWords.size / words.length) * 100;
    const avgSentenceLength = words.length / sentences.length;
    
    let originalityScore = Math.round(vocabularyDiversity * 1.2);
    let riskLevel = "Low";
    let suspiciousPatterns = [];
    
    // Check for suspicious patterns
    if (avgSentenceLength > 25) {
      suspiciousPatterns.push("Very long sentences (possible academic copying)");
      originalityScore -= 10;
    }
    
    if (vocabularyDiversity < 40) {
      suspiciousPatterns.push("Low vocabulary diversity");
      originalityScore -= 15;
    }
    
    // Check for repeated phrases
    const phrases = [];
    for (let i = 0; i < words.length - 2; i++) {
      phrases.push(words.slice(i, i + 3).join(' ').toLowerCase());
    }
    const uniquePhrases = new Set(phrases);
    if (phrases.length - uniquePhrases.size > phrases.length * 0.1) {
      suspiciousPatterns.push("Repetitive phrases detected");
      originalityScore -= 10;
    }
    
    originalityScore = Math.max(0, Math.min(100, originalityScore));
    
    if (originalityScore < 60) riskLevel = "High";
    else if (originalityScore < 80) riskLevel = "Medium";
    
    return {
      riskLevel,
      originalityScore,
      suspiciousPatterns,
      recommendations: suspiciousPatterns.length > 0 
        ? ["Review flagged sections", "Check for proper citations", "Improve vocabulary diversity"]
        : ["Document appears original", "Good vocabulary usage"]
    };
  }
};

export const generateQuizQuestions = async (text) => {
  if (!text.trim()) return [];
  
  try {
    const prompt = `Generate quiz questions from this technical content:

    Text: "${text}"

    Return JSON format:
    [
      {
        "type": "multiple-choice",
        "question": "...",
        "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
        "correct": "A",
        "explanation": "..."
      },
      {
        "type": "short-answer",
        "question": "...",
        "answer": "...",
        "points": 5
      }
    ]`;

    const result = await callGeminiAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.warn("Fallback quiz generation:", error.message);
    return [
      {
        type: "short-answer",
        question: "What are the main concepts discussed in this document?",
        answer: "Review the document for key concepts",
        points: 5
      }
    ];
  }
};

export const analyzeCodeDocumentation = async (text) => {
  if (!text.trim()) return null;
  
  try {
    const prompt = `Analyze this code documentation or technical specification:

    Text: "${text}"

    Return JSON format:
    {
      "language": "...",
      "functions": ["...", "..."],
      "classes": ["...", "..."],
      "apis": ["...", "..."],
      "dependencies": ["...", "..."],
      "complexity": "Low|Medium|High",
      "documentation_quality": "Poor|Good|Excellent",
      "missing_elements": ["...", "..."],
      "suggestions": ["...", "..."]
    }`;

    const result = await callGeminiAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.warn("Fallback code analysis:", error.message);
    return {
      language: "Not detected",
      functions: [],
      classes: [],
      apis: [],
      dependencies: [],
      complexity: "Medium",
      documentation_quality: "Good",
      missing_elements: [],
      suggestions: ["Manual review recommended"]
    };
  }
};

export const generateProjectIdeas = async (text) => {
  if (!text.trim()) return [];
  
  try {
    const prompt = `Based on this technical content, suggest engineering project ideas:

    Text: "${text}"

    Return JSON format:
    [
      {
        "title": "...",
        "description": "...",
        "difficulty": "Beginner|Intermediate|Advanced",
        "duration": "...",
        "skills": ["...", "..."],
        "tools": ["...", "..."]
      }
    ]`;

    const result = await callGeminiAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.warn("Fallback project ideas:", error.message);
    return [
      {
        title: "Document Analysis Tool",
        description: "Create a tool to analyze technical documents",
        difficulty: "Intermediate",
        duration: "2-3 weeks",
        skills: ["Programming", "Data Analysis"],
        tools: ["Text Processing", "AI APIs"]
      }
    ];
  }
};

// Helper functions for fallback scenarios
const extractTechnicalTerms = (text) => {
  const technicalPatterns = /\b[A-Z]{2,}|\b\w*(?:tion|ing|ment|ness|ity|ism)\b|\b\w+(?:algorithm|protocol|framework|methodology)\b/gi;
  const matches = text.match(technicalPatterns) || [];
  return [...new Set(matches)].slice(0, 10);
};

const extractCitations = (text) => {
  const citationPatterns = /\[\d+\]|\(\d{4}\)|\w+\s+et\s+al\.|\w+\s+\(\d{4}\)/gi;
  const matches = text.match(citationPatterns) || [];
  return [...new Set(matches)].slice(0, 5);
};

const extractKeyConceptsFallback = (text) => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  return sentences.slice(0, 5).map(s => s.trim());
};
