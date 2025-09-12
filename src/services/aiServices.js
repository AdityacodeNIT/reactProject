import Sentiment from 'sentiment';
import { franc } from 'franc';
import compromise from 'compromise';

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Language codes mapping
const languageCodes = {
  'eng': 'English',
  'spa': 'Spanish',
  'fra': 'French',
  'deu': 'German',
  'ita': 'Italian',
  'por': 'Portuguese',
  'rus': 'Russian',
  'jpn': 'Japanese',
  'kor': 'Korean',
  'chi': 'Chinese',
  'ara': 'Arabic',
  'hin': 'Hindi'
};

// Phase 1: High Impact, Easy to Implement

export const analyzeSentiment = (text) => {
  if (!text.trim()) return null;
  
  const result = sentiment.analyze(text);
  let sentimentLabel = 'Neutral';
  
  if (result.score > 2) sentimentLabel = 'Very Positive';
  else if (result.score > 0) sentimentLabel = 'Positive';
  else if (result.score < -2) sentimentLabel = 'Very Negative';
  else if (result.score < 0) sentimentLabel = 'Negative';
  
  return {
    score: result.score,
    comparative: result.comparative,
    label: sentimentLabel,
    positive: result.positive,
    negative: result.negative
  };
};

export const detectLanguage = (text) => {
  if (!text.trim()) return null;
  
  const langCode = franc(text);
  return {
    code: langCode,
    language: languageCodes[langCode] || 'Unknown',
    confidence: langCode !== 'und' ? 'High' : 'Low'
  };
};

export const summarizeText = (text, sentences = 3) => {
  if (!text.trim()) return '';
  
  const doc = compromise(text);
  const allSentences = doc.sentences().out('array');
  
  if (allSentences.length <= sentences) return text;
  
  // Simple extractive summarization - take first, middle, and last sentences
  const summary = [];
  summary.push(allSentences[0]);
  
  if (sentences > 1 && allSentences.length > 2) {
    const middleIndex = Math.floor(allSentences.length / 2);
    summary.push(allSentences[middleIndex]);
  }
  
  if (sentences > 2 && allSentences.length > 1) {
    summary.push(allSentences[allSentences.length - 1]);
  }
  
  return summary.join(' ');
};

export const checkGrammar = (text) => {
  if (!text.trim()) return [];
  
  const doc = compromise(text);
  const suggestions = [];
  
  // Basic grammar checks
  const sentences = doc.sentences().out('array');
  
  sentences.forEach((sentence, index) => {
    // Check for sentence capitalization
    if (sentence.charAt(0) !== sentence.charAt(0).toUpperCase()) {
      suggestions.push({
        type: 'capitalization',
        message: 'Sentence should start with a capital letter',
        sentence: sentence,
        position: index
      });
    }
    
    // Check for double spaces
    if (sentence.includes('  ')) {
      suggestions.push({
        type: 'spacing',
        message: 'Remove extra spaces',
        sentence: sentence,
        position: index
      });
    }
    
    // Check for missing periods
    if (!sentence.match(/[.!?]$/)) {
      suggestions.push({
        type: 'punctuation',
        message: 'Consider adding punctuation at the end',
        sentence: sentence,
        position: index
      });
    }
  });
  
  return suggestions;
};

// Phase 2: Medium Complexity

export const paraphraseText = (text) => {
  if (!text.trim()) return '';
  
  const doc = compromise(text);
  
  // Simple paraphrasing using synonym replacement and sentence restructuring
  let paraphrased = doc.text();
  
  // Basic synonym replacements
  const synonyms = {
    'good': 'excellent',
    'bad': 'poor',
    'big': 'large',
    'small': 'tiny',
    'fast': 'quick',
    'slow': 'gradual',
    'happy': 'joyful',
    'sad': 'melancholy'
  };
  
  Object.keys(synonyms).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    paraphrased = paraphrased.replace(regex, synonyms[word]);
  });
  
  return paraphrased;
};

export const adjustTone = (text, targetTone) => {
  if (!text.trim()) return '';
  
  const doc = compromise(text);
  let adjusted = text;
  
  switch (targetTone) {
    case 'formal':
      adjusted = adjusted.replace(/don't/g, 'do not')
                        .replace(/can't/g, 'cannot')
                        .replace(/won't/g, 'will not')
                        .replace(/I'm/g, 'I am');
      break;
    case 'casual':
      adjusted = adjusted.replace(/do not/g, "don't")
                        .replace(/cannot/g, "can't")
                        .replace(/will not/g, "won't")
                        .replace(/I am/g, "I'm");
      break;
    case 'professional':
      adjusted = `I would like to present the following: ${adjusted}`;
      break;
    case 'friendly':
      adjusted = `Hey there! ${adjusted} Hope this helps!`;
      break;
    default:
      return text;
  }
  
  return adjusted;
};

export const calculateReadability = (text) => {
  if (!text.trim()) return null;
  
  const doc = compromise(text);
  const sentences = doc.sentences().length;
  const words = doc.terms().length;
  const syllables = doc.terms().out('array').reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);
  
  // Flesch Reading Ease Score
  const fleschScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  
  let level = 'Graduate';
  if (fleschScore >= 90) level = 'Very Easy';
  else if (fleschScore >= 80) level = 'Easy';
  else if (fleschScore >= 70) level = 'Fairly Easy';
  else if (fleschScore >= 60) level = 'Standard';
  else if (fleschScore >= 50) level = 'Fairly Difficult';
  else if (fleschScore >= 30) level = 'Difficult';
  
  return {
    score: Math.round(fleschScore),
    level: level,
    sentences: sentences,
    words: words,
    syllables: syllables
  };
};

// Helper function to count syllables
const countSyllables = (word) => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
};

// Phase 3: Advanced Features

export const generateWritingPrompts = (keywords) => {
  const prompts = [
    `Write a story that begins with: "The ${keywords[0] || 'mysterious object'} appeared suddenly..."`,
    `Describe a world where ${keywords[0] || 'technology'} has completely changed how people live.`,
    `Create a dialogue between two characters discussing ${keywords[0] || 'an important decision'}.`,
    `Write about a day when ${keywords[0] || 'everything'} went wrong, but ended up being perfect.`,
    `Imagine you could ${keywords[0] || 'travel through time'}. Where would you go and why?`
  ];
  
  return prompts[Math.floor(Math.random() * prompts.length)];
};

export const extractKeywords = (text) => {
  if (!text.trim()) return [];
  
  const doc = compromise(text);
  const nouns = doc.nouns().out('array');
  const adjectives = doc.adjectives().out('array');
  
  // Combine and filter unique keywords
  const keywords = [...new Set([...nouns, ...adjectives])]
    .filter(word => word.length > 3)
    .slice(0, 10);
  
  return keywords;
};

export const generateHashtags = (text) => {
  const keywords = extractKeywords(text);
  return keywords.map(keyword => `#${keyword.replace(/\s+/g, '')}`).slice(0, 5);
};

// Mock translation function (in real app, you'd use Google Translate API)
export const translateText = async (text, targetLanguage) => {
  // This is a mock implementation
  // In a real app, you'd integrate with Google Translate API or similar service
  const translations = {
    'spanish': `[Traducido al español] ${text}`,
    'french': `[Traduit en français] ${text}`,
    'german': `[Ins Deutsche übersetzt] ${text}`,
    'italian': `[Tradotto in italiano] ${text}`
  };
  
  return translations[targetLanguage] || `[Translated to ${targetLanguage}] ${text}`;
};