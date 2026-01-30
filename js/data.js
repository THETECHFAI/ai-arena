const TOOLS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    maker: 'OpenAI',
    logo: 'https://cdn.simpleicons.org/openai/ffffff',
    color: '#10a37f',
    colorRgb: '16,163,127',
    tagline: 'The one that started the AI revolution',
    model: 'GPT-4o, o1, o3-mini',
    launched: '2022',
    users: '200M+ weekly',
    pricing: { free: 'Free tier available', pro: '$20/mo (Plus)', top: '$200/mo (Pro)' },
    ratings: { coding: 8.5, writing: 8.0, reasoning: 9.0, speed: 8.0, vision: 8.5, creative: 8.0, value: 7.0 },
    pros: [
      'Largest plugin & GPT ecosystem',
      'Voice & video conversations',
      'Canvas for collaborative writing & code',
      'Strong at maths and reasoning (o1/o3)',
      'Real-time web browsing'
    ],
    cons: [
      'Can be verbose and hedgy',
      'Rate limits frustrate power users',
      'Pro tier is expensive ($200/mo)',
      'Sometimes refuses harmless requests'
    ],
    bestFor: 'All-purpose AI companion',
    simpleDesc: 'The most popular AI chatbot. Good at almost everything — writing, coding, answering questions. If you only try one AI tool, this is it.',
    whoFor: 'Anyone who wants a reliable AI assistant for everyday tasks',
    url: 'https://chat.openai.com'
  },
  {
    id: 'claude',
    name: 'Claude',
    maker: 'Anthropic',
    logo: 'https://cdn.simpleicons.org/anthropic/ffffff',
    color: '#d97757',
    colorRgb: '217,119,87',
    tagline: 'The thoughtful heavyweight',
    model: 'Claude 3.5 Sonnet, Claude 3 Opus',
    launched: '2023',
    users: 'Growing fast',
    pricing: { free: 'Free tier available', pro: '$20/mo (Pro)', top: '$30/mo (Team)' },
    ratings: { coding: 9.0, writing: 9.5, reasoning: 9.5, speed: 7.5, vision: 8.0, creative: 9.0, value: 8.5 },
    pros: [
      'Best-in-class writing quality',
      'Massive 200K token context window',
      'Artifacts — creates apps & documents inline',
      'Exceptional at nuanced reasoning',
      'Honest about uncertainty'
    ],
    cons: [
      'Smaller ecosystem than ChatGPT',
      'Can be overly cautious on edgy topics',
      'Slower on complex tasks',
      'No plugin marketplace'
    ],
    bestFor: 'Deep thinking, writing & complex code',
    simpleDesc: 'Known for exceptional writing and thoughtful analysis. Handles very long documents and produces nuanced, high-quality responses.',
    whoFor: 'Writers, analysts, developers, and anyone who values quality over speed',
    url: 'https://claude.ai'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    maker: 'Google',
    logo: 'https://cdn.simpleicons.org/googlegemini/ffffff',
    color: '#4285f4',
    colorRgb: '66,133,244',
    tagline: 'Google\'s multimodal powerhouse',
    model: 'Gemini 2.0 Flash, Gemini 1.5 Pro',
    launched: '2023',
    users: 'Integrated across Google',
    pricing: { free: 'Free (generous)', pro: '$20/mo (Advanced)', top: 'Vertex AI (enterprise)' },
    ratings: { coding: 8.0, writing: 7.5, reasoning: 8.5, speed: 9.0, vision: 9.0, creative: 7.5, value: 8.5 },
    pros: [
      'Deep Google Workspace integration',
      '1M+ token context — handles huge docs',
      'Excellent multimodal (images, video, audio)',
      'Very generous free tier',
      'Fast response times'
    ],
    cons: [
      'Quality can be inconsistent',
      'Sometimes confidently wrong',
      'Creative writing is weaker',
      'Privacy concerns with Google data'
    ],
    bestFor: 'Google users & multimodal tasks',
    simpleDesc: 'Google\'s AI, built right into Gmail, Docs, and Search. Great at understanding images and video, with a huge context window.',
    whoFor: 'Google Workspace users, researchers working with large documents',
    url: 'https://gemini.google.com'
  },
  {
    id: 'copilot',
    name: 'Copilot',
    maker: 'Microsoft',
    logo: 'https://cdn.simpleicons.org/microsoft/ffffff',
    color: '#0078d4',
    colorRgb: '0,120,212',
    tagline: 'AI meets the Office suite',
    model: 'GPT-4o (via Microsoft)',
    launched: '2023',
    users: 'Bundled with Windows & Office',
    pricing: { free: 'Free tier available', pro: '$30/mo (Microsoft 365)', top: '$30/user/mo (Enterprise)' },
    ratings: { coding: 8.0, writing: 7.5, reasoning: 7.5, speed: 8.0, vision: 7.5, creative: 7.0, value: 7.0 },
    pros: [
      'Built into Word, Excel, PowerPoint, Teams',
      'GitHub Copilot is elite for code',
      'Enterprise security & compliance',
      'Bing search integration',
      'Free with Windows'
    ],
    cons: [
      'Expensive for full Copilot 365 suite',
      'Jack of all trades, master of none',
      'UI can feel clunky',
      'Locked to Microsoft ecosystem'
    ],
    bestFor: 'Microsoft & enterprise users',
    simpleDesc: 'Microsoft\'s AI assistant, built into Word, Excel, and Windows. Best if you already live in the Microsoft world.',
    whoFor: 'Office workers, enterprise teams, Microsoft 365 subscribers',
    url: 'https://copilot.microsoft.com'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    maker: 'Perplexity AI',
    logo: 'https://cdn.simpleicons.org/perplexity/ffffff',
    color: '#20b2aa',
    colorRgb: '32,178,170',
    tagline: 'The answer engine',
    model: 'Multi-model (Claude, GPT-4, Sonar)',
    launched: '2022',
    users: '100M+ monthly',
    pricing: { free: 'Free (5 Pro searches/day)', pro: '$20/mo (Pro)', top: '$40/mo (Enterprise)' },
    ratings: { coding: 6.5, writing: 7.5, reasoning: 8.0, speed: 9.0, vision: 6.5, creative: 6.0, value: 9.0 },
    pros: [
      'Always cites sources — you can verify',
      'Real-time web search built in',
      'Clean, distraction-free interface',
      'Uses multiple AI models under the hood',
      'Excellent for research'
    ],
    cons: [
      'Weak at creative writing',
      'Limited coding assistance',
      'Less conversational than ChatGPT',
      'Can\'t generate images'
    ],
    bestFor: 'Research & fact-finding',
    simpleDesc: 'Think of it as a smarter Google. Ask any question, get a clear answer with sources linked. Perfect for research.',
    whoFor: 'Researchers, students, journalists, anyone who wants sourced answers',
    url: 'https://perplexity.ai'
  },
  {
    id: 'grok',
    name: 'Grok',
    maker: 'xAI',
    logo: 'https://cdn.simpleicons.org/x/ffffff',
    color: '#1da1f2',
    colorRgb: '29,161,242',
    tagline: 'The unfiltered rebel',
    model: 'Grok-2, Grok-2 mini',
    launched: '2023',
    users: 'Available via X (Twitter)',
    pricing: { free: 'Limited via X', pro: '$8/mo (X Premium)', top: '$16/mo (Premium+)' },
    ratings: { coding: 7.5, writing: 7.5, reasoning: 7.5, speed: 8.5, vision: 7.5, creative: 8.0, value: 7.5 },
    pros: [
      'Real-time X/Twitter data access',
      'Less filtered than competitors',
      'Image generation (Aurora)',
      'Good sense of humour',
      'Cheap via X subscription'
    ],
    cons: [
      'Locked into X/Twitter ecosystem',
      'Less polished than top models',
      'Smaller context window',
      'Limited third-party integrations'
    ],
    bestFor: 'Social media & trending topics',
    simpleDesc: 'Elon Musk\'s AI, built into X/Twitter. Less filtered than others, good for trending topics and social media analysis.',
    whoFor: 'X/Twitter users, social media managers, people wanting unfiltered AI',
    url: 'https://grok.x.ai'
  },
  {
    id: 'cursor',
    name: 'Cursor',
    maker: 'Cursor Inc',
    logo: 'https://www.cursor.com/favicon.ico',
    color: '#7c3aed',
    colorRgb: '124,58,237',
    tagline: 'The AI-native code editor',
    model: 'Multi-model (Claude, GPT-4o, custom)',
    launched: '2023',
    users: 'Top dev tool of 2024',
    pricing: { free: 'Free (limited)', pro: '$20/mo (Pro)', top: '$40/mo (Business)' },
    ratings: { coding: 9.5, writing: 5.0, reasoning: 8.0, speed: 8.5, vision: 6.0, creative: 5.5, value: 8.5 },
    pros: [
      'Best AI coding experience available',
      'Understands your entire codebase',
      'Multi-file editing in one go',
      'Supports multiple AI models',
      'Tab-complete that reads your mind'
    ],
    cons: [
      'Code-only — not for general AI tasks',
      'Can burn through API credits fast',
      'Learning curve for full potential',
      'VS Code fork — some extensions break'
    ],
    bestFor: 'Software development',
    simpleDesc: 'A code editor supercharged with AI. It understands your whole project and can write, edit, and debug code across multiple files.',
    whoFor: 'Software developers and engineers who want to code 10x faster',
    url: 'https://cursor.com'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    maker: 'Midjourney Inc',
    logo: 'https://cdn.simpleicons.org/midjourney/ffffff',
    color: '#ff6b35',
    colorRgb: '255,107,53',
    tagline: 'The AI artist',
    model: 'Midjourney v6.1',
    launched: '2022',
    users: '16M+ Discord members',
    pricing: { free: 'No free tier', pro: '$10/mo (Basic)', top: '$60/mo (Mega)' },
    ratings: { coding: 1.0, writing: 2.0, reasoning: 2.0, speed: 7.5, vision: 9.5, creative: 9.5, value: 8.0 },
    pros: [
      'Stunning, artistic image quality',
      'Consistent style and aesthetics',
      'Great for branding and marketing',
      'Active creative community',
      'Excellent at photorealistic images'
    ],
    cons: [
      'No free tier at all',
      'Discord-only (web editor in beta)',
      'Cannot do text, code, or chat',
      'Prompt crafting has a learning curve'
    ],
    bestFor: 'Image generation & visual design',
    simpleDesc: 'Creates beautiful AI-generated images from text descriptions. The go-to tool for marketing visuals, art, and design concepts.',
    whoFor: 'Designers, marketers, content creators, artists',
    url: 'https://midjourney.com'
  },
  {
    id: 'replit',
    name: 'Replit AI',
    maker: 'Replit',
    logo: 'https://cdn.simpleicons.org/replit/ffffff',
    color: '#f26522',
    colorRgb: '242,101,34',
    tagline: 'Describe it. Deploy it.',
    model: 'Replit Agent (multi-model)',
    launched: '2024',
    users: '30M+ developers',
    pricing: { free: 'Free (limited)', pro: '$25/mo (Core)', top: '$40/mo (Teams)' },
    ratings: { coding: 8.5, writing: 4.5, reasoning: 7.0, speed: 8.0, vision: 4.0, creative: 5.0, value: 8.0 },
    pros: [
      'Describe an app → get a working app',
      'Instant cloud deployment',
      'Full development environment in browser',
      'Great for prototyping ideas fast',
      'Handles backend + frontend + database'
    ],
    cons: [
      'Less control than local development',
      'Credit system can get expensive',
      'Quality varies on complex apps',
      'Limited to web apps'
    ],
    bestFor: 'Rapid prototyping & deployment',
    simpleDesc: 'Tell it what app you want, and it builds it for you — complete with hosting. Perfect for turning ideas into working products fast.',
    whoFor: 'Entrepreneurs, indie hackers, non-technical founders',
    url: 'https://replit.com'
  },
  {
    id: 'lovable',
    name: 'Lovable',
    maker: 'Lovable',
    logo: 'https://lovable.dev/favicon.ico',
    color: '#e040fb',
    colorRgb: '224,64,251',
    tagline: 'Vibe code your dream app',
    model: 'Multi-model (Claude-powered)',
    launched: '2024',
    users: 'Fastest growing AI builder',
    pricing: { free: 'Free (limited)', pro: '$20/mo (Launch)', top: '$100/mo (Scale)' },
    ratings: { coding: 8.0, writing: 4.0, reasoning: 6.5, speed: 8.5, vision: 7.0, creative: 7.0, value: 7.5 },
    pros: [
      'Beautiful UI designs by default',
      'Supabase backend integration',
      'Very fast iteration cycle',
      'GitHub sync built in',
      'No coding knowledge required'
    ],
    cons: [
      'React + Tailwind only stack',
      'Limited customisation for complex apps',
      'Newer platform — still maturing',
      'Can struggle with complex logic'
    ],
    bestFor: 'Beautiful web apps fast',
    simpleDesc: 'Describe the app you want, get a beautiful web app with a modern design. Integrates with databases and deploys instantly.',
    whoFor: 'Non-technical creators who want professional-looking apps',
    url: 'https://lovable.dev'
  },
  {
    id: 'llama',
    name: 'Llama',
    maker: 'Meta',
    logo: 'https://cdn.simpleicons.org/meta/ffffff',
    color: '#1877f2',
    colorRgb: '24,119,242',
    tagline: 'Open-source powerhouse',
    model: 'Llama 3.1 405B, Llama 3.2',
    launched: '2023',
    users: '300M+ downloads',
    pricing: { free: 'Completely free', pro: 'Self-hosted costs only', top: 'Via cloud providers' },
    ratings: { coding: 7.5, writing: 7.0, reasoning: 7.5, speed: 9.0, vision: 6.5, creative: 7.0, value: 9.5 },
    pros: [
      'Completely free and open source',
      'Run on your own hardware — full privacy',
      'No usage limits or rate caps',
      'Huge community and ecosystem',
      'Available via every cloud provider'
    ],
    cons: [
      'Requires technical setup to self-host',
      'Needs powerful hardware locally',
      'Behind Claude/GPT on quality',
      'No built-in web interface'
    ],
    bestFor: 'Privacy-first & self-hosted AI',
    simpleDesc: 'Meta\'s free, open-source AI model. You can run it on your own computer with full privacy. No subscriptions, no data sharing.',
    whoFor: 'Developers, privacy-conscious users, companies wanting full control',
    url: 'https://llama.meta.com'
  },
  {
    id: 'devin',
    name: 'Devin',
    maker: 'Cognition',
    logo: 'https://devin.ai/favicon.ico',
    color: '#00d4aa',
    colorRgb: '0,212,170',
    tagline: 'The autonomous AI developer',
    model: 'Devin (proprietary)',
    launched: '2024',
    users: 'Early access',
    pricing: { free: 'No', pro: '$500/mo', top: 'Enterprise (custom)' },
    ratings: { coding: 9.0, writing: 4.0, reasoning: 8.5, speed: 6.0, vision: 5.0, creative: 4.5, value: 4.5 },
    pros: [
      'Truly autonomous — works independently',
      'Own browser, terminal & code editor',
      'Can learn entire codebases',
      'Handles complex multi-step projects',
      'Plans and executes like a junior dev'
    ],
    cons: [
      'Very expensive at $500/month',
      'Slow for simple tasks',
      'Still early stage — quality varies',
      'Overkill for most use cases'
    ],
    bestFor: 'Autonomous software development',
    simpleDesc: 'An AI that works like a junior software developer. Give it a task, and it plans, codes, tests, and deploys independently.',
    whoFor: 'Engineering teams wanting to automate routine development work',
    url: 'https://devin.ai'
  }
];

const CATEGORIES = [
  { id: 'coding', name: 'Coding', icon: '💻', desc: 'Writing, debugging & understanding code', simple: 'How good is it at helping you write software?' },
  { id: 'writing', name: 'Writing', icon: '✍️', desc: 'Prose, copywriting & content creation', simple: 'How well does it write emails, articles, and creative content?' },
  { id: 'reasoning', name: 'Reasoning', icon: '🧩', desc: 'Logic, analysis & problem solving', simple: 'How well does it think through complex problems?' },
  { id: 'speed', name: 'Speed', icon: '⚡', desc: 'Response time & throughput', simple: 'How fast does it reply?' },
  { id: 'vision', name: 'Vision', icon: '👁️', desc: 'Image understanding & generation', simple: 'Can it understand and create images?' },
  { id: 'creative', name: 'Creative', icon: '🎭', desc: 'Imagination, humour & originality', simple: 'How original and imaginative are its responses?' },
  { id: 'value', name: 'Value', icon: '💰', desc: 'Features vs price', simple: 'Is it worth what you pay?' }
];

function getScoreLabel(score) {
  if (score >= 9.0) return 'Elite';
  if (score >= 8.0) return 'Excellent';
  if (score >= 7.0) return 'Strong';
  if (score >= 6.0) return 'Good';
  if (score >= 5.0) return 'Average';
  return 'Limited';
}

function getTierLabel(overall) {
  if (overall >= 9.0) return { tier: 'S', color: '#ffd700' };
  if (overall >= 8.0) return { tier: 'A', color: '#00ff88' };
  if (overall >= 7.0) return { tier: 'B', color: '#00f0ff' };
  if (overall >= 6.0) return { tier: 'C', color: '#ff8800' };
  return { tier: 'N', color: '#ff00aa' };
}
