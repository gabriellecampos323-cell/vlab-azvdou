import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Download, Edit3, Check, Loader2, ChevronLeft, ChevronRight,
  Plus, Trash2, Copy, RefreshCw, Settings, Zap, TrendingUp, Target,
  BookOpen, MessageSquare, List, Film, BarChart3, Library, Brain,
  Heart, MessageCircle, Send, Bookmark, BadgeCheck, Type, Palette,
  ArrowUpRight, Award, Flame, Lightbulb, Eye, Save, Share2
} from 'lucide-react';

/* ============================================================
   VLAB — Ferramenta de Conteúdo Viral pro @azvdou
   Inclui: gerador de carrossel + reels + performance + replicação
   Estilo: dark + gold premium
   ============================================================ */

// ============== CONFIGS GLOBAIS ==============
const BRAND_DEFAULT = {
  handle: 'azvdou',
  nome: 'Lucas Azevedo',
  subtitulo: 'Trader Profissional · Especialista em Smart Money',
  bio: '9 anos de mercado · +6 mil alunos · B3 · Forex',
  verificado: true,
  fotoUrl: null, // null = usa o avatar SVG default. Usuário sobe a foto real na aba Config
};

const ARQUETIPOS_VISUAIS = [
  { id: 'minimalist',     label: 'Minimalist Clean',  desc: 'Branco + tipografia bold (estilo Renato Duran)', cor: '#FFFFFF', textCor: '#0a0a0a' },
  { id: 'trader_dark',    label: 'Trader Dark',       desc: 'Dark + gráficos (estilo Guilherme Cardoso)',     cor: '#0a0a0a', textCor: '#FFFFFF' },
  { id: 'twitter_quote',  label: 'Twitter Quote',     desc: 'Single slide branco minimalista',                cor: '#FFFFFF', textCor: '#0F1419' },
  { id: 'editorial',      label: 'Editorial Premium', desc: 'Dark + serif italic + acento (Jennifer Setti)', cor: '#0E0E0E', textCor: '#F5EFE3' },
];

const TEMAS_PRESET = [
  { id: 'amarelo_classico',     label: 'Amarelo Clássico',     hl: '#FFE94A', hlText: '#0a0a0a', fonte: 'Inter',                 vibe: 'Padrão · educativo' },
  { id: 'neon_lime',            label: 'Neon Lime',            hl: '#CCFF00', hlText: '#0a0a0a', fonte: 'Sora',                  vibe: 'Tech · crypto' },
  { id: 'trader_money_green',   label: 'Trader Money Green',   hl: '#00E676', hlText: '#0a0a0a', fonte: 'Manrope',               vibe: 'Financeiro · lucro' },
  { id: 'rosa_atencao',         label: 'Rosa Atenção',         hl: '#FF3D9A', hlText: '#FFFFFF', fonte: 'Plus Jakarta Sans',     vibe: 'Lifestyle · feminino' },
  { id: 'laranja_editorial',    label: 'Laranja Editorial',    hl: '#FF6B35', hlText: '#FFFFFF', fonte: 'DM Sans',               vibe: 'Premium · Jennifer style' },
  { id: 'ciano_eletrico',       label: 'Ciano Elétrico',       hl: '#00D4FF', hlText: '#0a0a0a', fonte: 'Space Grotesk',         vibe: 'SaaS · B2B' },
  { id: 'vermelho_urgencia',    label: 'Vermelho Urgência',    hl: '#FF2E2E', hlText: '#FFFFFF', fonte: 'Bricolage Grotesque',   vibe: 'Provocativo · alerta' },
  { id: 'noir_premium',         label: 'Noir Premium',         hl: '#FFFFFF', hlText: '#0a0a0a', fonte: 'DM Serif Display',      vibe: 'Luxo · noir', bgOverride: '#0a0a0a', fgOverride: '#FFFFFF' },
];

const TIPOS_CARROSSEL = [
  { id: 'hybrid',       label: 'Hybrid (Recomendado)', desc: 'Emocional + técnico mesclado', icon: Sparkles },
  { id: 'contrarian',   label: 'Contrarian',           desc: 'O que ninguém te conta',       icon: Zap },
  { id: 'educacional',  label: 'Educacional',          desc: 'Ensina conceito SMC/ICT',      icon: BookOpen },
  { id: 'historia',     label: 'História/Case',        desc: 'Jornada de trader',            icon: MessageSquare },
  { id: 'lista',        label: 'Lista/Checklist',      desc: '5 erros que...',               icon: List },
];

const TONS_VOZ = [
  { id: 'especialista', label: 'Especialista',  desc: 'Técnico, autoridade' },
  { id: 'amigo',        label: 'Amigo direto',  desc: 'Próximo, sem rodeios' },
  { id: 'provocador',   label: 'Provocador',    desc: 'Desafia crenças' },
];

const PRODUTOS = [
  { id: 'SmartMoneyFlix',     label: 'SmartMoneyFlix',     cta: 'Aprenda SMC/ICT do zero ao avançado',     trigger: 'SMART' },
  { id: 'Mentoria11',         label: 'Mentoria 11',        cta: 'Treinamento completo pra consistência',   trigger: 'MENTORIA' },
  { id: 'Comunidade',         label: 'Comunidade',         cta: 'Trade ao vivo todo dia',                  trigger: 'COMUNIDADE' },
  { id: 'MentoriaIndividual', label: 'Mentoria Individual', cta: '1:1 comigo. Vagas limitadas.',           trigger: 'INDIVIDUAL' },
];

const FORMULAS_HOOK = [
  'Provocação emocional',
  'Paradoxo cognitivo',
  'Reframe matemático',
  'Pergunta cultural/geracional',
  'Promessa numerada',
  'Anti-narrativa',
  'Conselho específico contraintuitivo',
  'Negação de autoridade',
  'Calculadora/Tabela',
  'Que ninguém faz',
];

// ============== MOCK DATA — POSTS POSTADOS (para Performance Tab) ==============
const POSTS_MOCK = [
  { id: 1, tipo: 'carrossel', tema: 'Stop hunt no mini índice', hook_formula: 'Negação de autoridade', tema_visual: 'amarelo_classico', arquetipo: 'minimalist', data: '2026-04-21', likes: 2340, comments: 187, shares: 142, saves: 421, dms: 56, tier: 'top' },
  { id: 2, tipo: 'reel',      tema: 'Por que 95% perde em 6 meses', hook_formula: 'Paradoxo cognitivo', tema_visual: 'amarelo_classico', arquetipo: 'minimalist', data: '2026-04-23', likes: 5410, comments: 312, shares: 287, saves: 612, dms: 89, tier: 'top' },
  { id: 3, tipo: 'carrossel', tema: 'Quanto rende R$1k investido em 10 anos', hook_formula: 'Reframe matemático', tema_visual: 'trader_money_green', arquetipo: 'twitter_quote', data: '2026-04-19', likes: 1820, comments: 94, shares: 78, saves: 312, dms: 31, tier: 'good' },
  { id: 4, tipo: 'carrossel', tema: 'Indicadores que destroem sua conta', hook_formula: 'Provocação emocional', tema_visual: 'vermelho_urgencia', arquetipo: 'minimalist', data: '2026-04-15', likes: 1240, comments: 67, shares: 41, saves: 198, dms: 18, tier: 'good' },
  { id: 5, tipo: 'reel',      tema: 'Como ler liquidez em 30 segundos', hook_formula: 'Promessa numerada', tema_visual: 'amarelo_classico', arquetipo: 'minimalist', data: '2026-04-12', likes: 880, comments: 23, shares: 19, saves: 84, dms: 9, tier: 'avg' },
  { id: 6, tipo: 'carrossel', tema: 'A mentira do price action básico', hook_formula: 'Anti-narrativa', tema_visual: 'amarelo_classico', arquetipo: 'minimalist', data: '2026-04-08', likes: 920, comments: 41, shares: 28, saves: 151, dms: 12, tier: 'avg' },
];

const VOICE_MEMORY = {
  termos_preferidos: ['smart money', 'liquidez', 'stop hunt', 'fakeout', 'manipulação institucional', 'TILT', 'mini índice', 'Forex', 'B3'],
  termos_evitar: ['padrão genérico', 'tendência', 'sinal vago'],
  frases_aprovadas: [
    'Trader que opera com stop óbvio é apostador.',
    'Não opere o nível. Opere a reação à liquidez.',
    'Em 9 anos operando isso, vi esse padrão centenas de vezes.',
  ],
  frases_proibidas: ['Bem-vindos!', 'Espero que estejam bem', 'Hoje vou compartilhar', 'Seja autêntico', 'Confie no processo'],
};

// ============================================================
//                          MAIN APP
// ============================================================
export default function VLAB() {
  const [tab, setTab] = useState('criar');
  const [brand, setBrand] = useState(() => {
    // Carrega do localStorage se existir, senão usa default
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('vlab_brand');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return BRAND_DEFAULT;
  });

  // Persiste sempre que muda
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('vlab_brand', JSON.stringify(brand));
      } catch (e) {}
    }
  }, [brand]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f0e1', fontFamily: 'Inter, sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Manrope:wght@400;500;700;800&family=Sora:wght@400;500;700;800&family=DM+Sans:wght@400;500;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Space+Grotesk:wght@400;500;700&family=Bricolage+Grotesque:wght@400;500;700;800&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <Header tab={tab} setTab={setTab} brand={brand} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        {tab === 'criar'       && <TabCriar brand={brand} />}
        {tab === 'ideias'      && <TabIdeias setTab={setTab} />}
        {tab === 'performance' && <TabPerformance setTab={setTab} />}
        {tab === 'biblioteca'  && <TabBiblioteca />}
        {tab === 'config'      && <TabConfig brand={brand} setBrand={setBrand} />}
      </div>
    </div>
  );
}

// ============================================================
//                          HEADER + NAV
// ============================================================
function Header({ tab, setTab, brand }) {
  const tabs = [
    { id: 'criar',       label: 'Criar',      icon: Sparkles  },
    { id: 'ideias',      label: 'Ideias',     icon: Lightbulb },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'biblioteca',  label: 'Biblioteca', icon: Library   },
    { id: 'config',      label: 'Config',     icon: Settings  },
  ];

  return (
    <div style={{ borderBottom: '1px solid #1f1f1f', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #c9a961 0%, #8b7341 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#0a0a0a', fontFamily: "'Playfair Display', serif" }}>
            V
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, lineHeight: 1, color: '#f5f0e1' }}>VLAB</div>
            <div style={{ fontSize: 10, color: '#8a8478', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>@{brand.handle}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const ativo = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: ativo ? 'rgba(201, 169, 97, 0.1)' : 'transparent',
                border: 'none',
                color: ativo ? '#c9a961' : '#8a8478',
                padding: '10px 18px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s',
              }}>
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* User badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: '#111', border: '1px solid #1f1f1f', borderRadius: 100 }}>
          <BrandPhoto photoUrl={brand.fotoUrl} size={26} />
          <div style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            {brand.handle} {brand.verificado && <BadgeCheck size={12} style={{ color: '#1D9BF0' }} fill="#1D9BF0" />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//                       TAB: CRIAR
// ============================================================
function TabCriar({ brand }) {
  const [contentMode, setContentMode] = useState('carrossel'); // carrossel | reel
  const [step, setStep] = useState('config'); // config | generating | editing
  const [tipo, setTipo] = useState('hybrid');
  const [arquetipo, setArquetipo] = useState('minimalist');
  const [tema, setTema] = useState('');
  const [contexto, setContexto] = useState('');
  const [numSlides, setNumSlides] = useState(6);
  const [duracaoReel, setDuracaoReel] = useState(30);
  const [tomVoz, setTomVoz] = useState('especialista');
  const [ctaTipo, setCtaTipo] = useState('produto');
  const [ctaProduto, setCtaProduto] = useState('SmartMoneyFlix');
  const [temaVisual, setTemaVisual] = useState('amarelo_classico');
  const [error, setError] = useState('');
  const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const gerar = () => {
    if (!tema.trim()) {
      setError('Coloca o tema primeiro');
      return;
    }
    setError('');
    setStep('generating');
    setTimeout(() => {
      // Mock generation — em produção, chamaria a API com voice-memory
      setSlides(gerarMockSlides(tema, numSlides, ctaProduto));
      setActiveSlide(0);
      setStep('editing');
    }, 1500);
  };

  const reset = () => { setStep('config'); setSlides([]); setTema(''); setContexto(''); };

  if (step === 'generating') return <TelaGerando tipo={contentMode} />;

  if (step === 'editing' && contentMode === 'carrossel') {
    return <EditorCarrossel
      slides={slides} setSlides={setSlides}
      activeSlide={activeSlide} setActiveSlide={setActiveSlide}
      arquetipo={arquetipo} temaVisual={temaVisual}
      brand={brand}
      reset={reset}
    />;
  }

  // ============ CONFIG SCREEN ============
  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={pillTag}>
          <Sparkles size={12} /> Estúdio editorial
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, margin: '20px 0 12px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Smart money. <em style={{ color: '#c9a961', fontStyle: 'italic', fontWeight: 400 }}>Smart content.</em>
        </h1>
        <p style={{ color: '#8a8478', fontSize: 14 }}>
          Estúdio editorial · @{brand.handle}
        </p>
      </div>

      {/* TOGGLE: carrossel vs reel */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, padding: 4, background: '#111', border: '1px solid #1f1f1f', borderRadius: 12 }}>
        <ContentToggle ativo={contentMode === 'carrossel'} onClick={() => setContentMode('carrossel')} icon={<List size={16} />} label="Carrossel" />
        <ContentToggle ativo={contentMode === 'reel'} onClick={() => setContentMode('reel')} icon={<Film size={16} />} label="Reel" />
      </div>

      {/* 01 — Tipo */}
      <Section label="01 / Tipo de conteúdo">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
          {TIPOS_CARROSSEL.map(t => {
            const Icon = t.icon;
            const ativo = tipo === t.id;
            return (
              <button key={t.id} onClick={() => setTipo(t.id)} style={tipoCard(ativo)}>
                <Icon size={20} style={{ color: ativo ? '#c9a961' : '#5a5448', marginBottom: 10 }} />
                <div style={{ fontWeight: 600, fontSize: 15 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: '#8a8478', marginTop: 4 }}>{t.desc}</div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* 02 — Tema */}
      <Section label="02 / Tema">
        <input
          value={tema}
          onChange={e => setTema(e.target.value)}
          placeholder='Ex: Por que tomar 3 stops seguidos te faz operar pior nos próximos trades'
          style={inputStyle}
        />
        <textarea
          value={contexto}
          onChange={e => setContexto(e.target.value)}
          placeholder="(Opcional) Contexto: ângulo específico, dado, história pessoal..."
          rows={3}
          style={{ ...inputStyle, marginTop: 10, resize: 'vertical' }}
        />
      </Section>

      {/* 03 — Arquétipo visual + Tema */}
      <Section label="03 / Estilo visual">
        <Label>Arquétipo</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 16 }}>
          {ARQUETIPOS_VISUAIS.map(a => {
            const ativo = arquetipo === a.id;
            return (
              <button key={a.id} onClick={() => setArquetipo(a.id)} style={tipoCard(ativo)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 4, background: a.cor, border: '1px solid rgba(201,169,97,0.2)' }} />
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.label}</div>
                </div>
                <div style={{ fontSize: 11, color: '#8a8478' }}>{a.desc}</div>
              </button>
            );
          })}
        </div>

        <Label style={{ marginTop: 12 }}>Tema (cor da pílula + fonte)</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
          {TEMAS_PRESET.map(t => {
            const ativo = temaVisual === t.id;
            return (
              <button key={t.id} onClick={() => setTemaVisual(t.id)} style={{
                ...tipoCard(ativo), padding: 12, textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: t.hl }} />
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</div>
                </div>
                <div style={{ fontSize: 10, color: '#8a8478', fontFamily: t.fonte }}>{t.fonte} · {t.vibe}</div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* 04 — Configurações */}
      <Section label="04 / Configurações">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <Label>{contentMode === 'carrossel' ? 'Número de slides' : 'Duração (segundos)'}</Label>
            {contentMode === 'carrossel' ? (
              <select value={numSlides} onChange={e => setNumSlides(parseInt(e.target.value))} style={inputStyle}>
                {[3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} slides</option>)}
              </select>
            ) : (
              <select value={duracaoReel} onChange={e => setDuracaoReel(parseInt(e.target.value))} style={inputStyle}>
                {[15, 30, 60, 90].map(d => <option key={d} value={d}>{d} segundos</option>)}
              </select>
            )}
          </div>
          <div>
            <Label>Tom de voz</Label>
            <select value={tomVoz} onChange={e => setTomVoz(e.target.value)} style={inputStyle}>
              {TONS_VOZ.map(t => <option key={t.id} value={t.id}>{t.label} — {t.desc}</option>)}
            </select>
          </div>
        </div>
      </Section>

      {/* 05 — CTA */}
      <Section label="05 / Call to Action">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <RadioCard ativo={ctaTipo === 'produto'} onClick={() => setCtaTipo('produto')} icon={<Target size={16} />} label="Promover produto" />
          <RadioCard ativo={ctaTipo === 'engajamento'} onClick={() => setCtaTipo('engajamento')} icon={<TrendingUp size={16} />} label="Engajamento puro" />
        </div>
        {ctaTipo === 'produto' && (
          <select value={ctaProduto} onChange={e => setCtaProduto(e.target.value)} style={inputStyle}>
            {PRODUTOS.map(p => <option key={p.id} value={p.id}>{p.label} — {p.cta} (DM: {p.trigger})</option>)}
          </select>
        )}
      </Section>

      {error && (
        <div style={{ background: '#3a1a1a', border: '1px solid #6a2a2a', color: '#ff9a8a', padding: 14, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      <button onClick={gerar} style={btnPrimary}>
        <Sparkles size={18} /> Gerar {contentMode === 'carrossel' ? 'Carrossel' : 'Reel'}
      </button>
    </div>
  );
}

function ContentToggle({ ativo, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '10px 16px', border: 'none', borderRadius: 8, cursor: 'pointer',
      background: ativo ? 'linear-gradient(135deg, #c9a961 0%, #8b7341 100%)' : 'transparent',
      color: ativo ? '#0a0a0a' : '#8a8478',
      fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      {icon} {label}
    </button>
  );
}

function TelaGerando({ tipo }) {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={48} style={{ color: '#c9a961', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 28, margin: '24px 0 8px' }}>
          Gerando seu {tipo}...
        </h2>
        <p style={{ color: '#8a8478', fontSize: 14 }}>
          Aplicando voice memory + hybrid mode + 8 sinais de autoridade
        </p>
      </div>
    </div>
  );
}

// ============================================================
//                  EDITOR DE CARROSSEL
// ============================================================
function EditorCarrossel({ slides, setSlides, activeSlide, setActiveSlide, arquetipo, temaVisual, brand, reset }) {
  const slide = slides[activeSlide];
  const tema = TEMAS_PRESET.find(t => t.id === temaVisual);
  const [exporting, setExporting] = useState(false);

  const updateSlide = (field, value) => {
    setSlides(prev => prev.map((s, i) => i === activeSlide ? { ...s, [field]: value } : s));
  };

  const removeSlide = (idx) => {
    if (slides.length <= 2) return;
    setSlides(prev => prev.filter((_, i) => i !== idx));
    setActiveSlide(Math.max(0, idx - 1));
  };

  const addSlide = () => {
    const novo = { tipo: 'conteudo', titulo: 'Novo slide', corpo: 'Edite o conteúdo', destaque: '' };
    setSlides(prev => [...prev, novo]);
    setActiveSlide(slides.length);
  };

  // Exporta todos os slides como PNGs usando html2canvas
  const exportarPNG = async () => {
    setExporting(true);
    try {
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      for (let i = 0; i < slides.length; i++) {
        const el = document.getElementById(`vlab-export-slide-${i}`);
        if (!el) continue;
        const canvas = await window.html2canvas(el, {
          scale: 2,
          backgroundColor: null,
          width: 1080,
          height: 1350,
          useCORS: true,
        });
        const link = document.createElement('a');
        link.download = `vlab-slide-${String(i + 1).padStart(2, '0')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        await new Promise(r => setTimeout(r, 250));
      }
    } catch (err) {
      console.error('Erro ao exportar:', err);
      alert('Erro ao exportar. Tenta de novo ou tira screenshot manual (Win + Shift + S).');
    }
    setExporting(false);
  };

  return (
    <div style={{ marginTop: -32 }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, marginBottom: 24 }}>
        <button onClick={reset} style={btnSecondary}>
          <RefreshCw size={14} /> Novo
        </button>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#c9a961' }}>
          {slides.length} slides · {arquetipo} · {tema.label}
        </div>
        <button style={btnPrimary} onClick={exportarPNG} disabled={exporting}>
          {exporting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={16} />}
          {exporting ? 'Exportando...' : 'Baixar PNGs'}
        </button>
      </div>

      {/* Hidden full-size slides for export */}
      <div style={{ position: 'absolute', left: -99999, top: 0, pointerEvents: 'none' }}>
        {slides.map((s, i) => (
          <div key={`export-${i}`} id={`vlab-export-slide-${i}`}>
            <SlideRender slide={s} numSlide={i + 1} totalSlides={slides.length} arquetipo={arquetipo} tema={tema} brand={brand} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 320px', gap: 20 }}>

        {/* SIDEBAR ESQUERDA — lista de slides */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 16, height: 'fit-content' }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#5a5448', textTransform: 'uppercase', marginBottom: 14 }}>
            Slides
          </div>
          {slides.map((s, i) => (
            <div key={i} onClick={() => setActiveSlide(i)} style={{
              padding: 12, marginBottom: 8,
              border: activeSlide === i ? '1px solid #c9a961' : '1px solid #1f1f1f',
              borderRadius: 8, cursor: 'pointer',
              background: activeSlide === i ? '#1a1410' : '#0f0f0f',
            }}>
              <div style={{ fontSize: 10, color: '#c9a961', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                {String(i + 1).padStart(2, '0')} · {s.tipo}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f5f0e1', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {s.titulo}
              </div>
            </div>
          ))}
          <button onClick={addSlide} style={{
            width: '100%', padding: 10, background: 'transparent', border: '1px dashed #2a2a2a', borderRadius: 8,
            color: '#8a8478', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13
          }}>
            <Plus size={14} /> Adicionar slide
          </button>
        </div>

        {/* CENTRO — preview do slide */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <button onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))} disabled={activeSlide === 0} style={navBtn(activeSlide === 0)}>
              <ChevronLeft size={18} />
            </button>
            <span style={{ color: '#8a8478', fontSize: 13 }}>{activeSlide + 1} / {slides.length}</span>
            <button onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))} disabled={activeSlide === slides.length - 1} style={navBtn(activeSlide === slides.length - 1)}>
              <ChevronRight size={18} />
            </button>
          </div>

          <SlideRender slide={slide} numSlide={activeSlide + 1} totalSlides={slides.length} arquetipo={arquetipo} tema={tema} brand={brand} />
        </div>

        {/* SIDEBAR DIREITA — edição */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#5a5448', textTransform: 'uppercase', marginBottom: 14 }}>
            Editar slide {activeSlide + 1}
          </div>

          <Label>Tipo</Label>
          <select value={slide.tipo} onChange={e => updateSlide('tipo', e.target.value)} style={inputStyle}>
            <option value="capa">Capa</option>
            <option value="contexto">Contexto</option>
            <option value="conteudo">Conteúdo</option>
            <option value="insight">Insight</option>
            <option value="cta">CTA</option>
          </select>

          <Label style={{ marginTop: 14 }}>Título</Label>
          <textarea value={slide.titulo || ''} onChange={e => updateSlide('titulo', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />

          <Label style={{ marginTop: 14 }}>Subtítulo / corpo</Label>
          <textarea value={slide.corpo || ''} onChange={e => updateSlide('corpo', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />

          <Label style={{ marginTop: 14 }}>Palavra destaque (vai pra pílula)</Label>
          <input value={slide.destaque || ''} onChange={e => updateSlide('destaque', e.target.value)} placeholder="Ex: TILT, vingança, DEPOIS" style={inputStyle} />

          <button onClick={() => removeSlide(activeSlide)} disabled={slides.length <= 2} style={{ ...btnSecondary, marginTop: 16, width: '100%', justifyContent: 'center', color: '#ff9a8a', borderColor: '#3a1a1a' }}>
            <Trash2 size={14} /> Remover slide
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//             RENDER DO SLIDE (4 ARQUÉTIPOS)
// ============================================================
function SlideRender({ slide, numSlide, totalSlides, arquetipo, tema, brand = BRAND_DEFAULT }) {
  if (!slide) return null;

  const isMinimalist = arquetipo === 'minimalist' || arquetipo === 'twitter_quote';
  const bg = tema?.bgOverride || (isMinimalist ? '#FFFFFF' : '#0a0a0a');
  const fg = tema?.fgOverride || (isMinimalist ? '#0a0a0a' : '#FFFFFF');
  const fonte = tema?.fonte || 'Inter';

  const renderTitulo = (texto, destaque) => {
    if (!destaque || !texto) return texto;
    const parts = texto.split(new RegExp(`(${destaque})`, 'gi'));
    return parts.map((p, i) =>
      p.toLowerCase() === destaque.toLowerCase()
        ? <span key={i} style={{
            background: tema.hl,
            color: tema.hlText,
            padding: '0 12px 6px 12px',
            borderRadius: 8,
            display: 'inline-block',
            margin: '0 2px',
          }}>{p}</span>
        : <span key={i}>{p}</span>
    );
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: 432, height: 540,
        background: bg, color: fg,
        padding: '32px 36px',
        borderRadius: 16,
        display: 'flex', flexDirection: 'column',
        fontFamily: fonte + ', sans-serif',
        boxShadow: '0 12px 48px rgba(0,0,0,0.4)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Brand bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <BrandPhoto photoUrl={brand.fotoUrl} size={28} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.1 }}>{brand.nome}</div>
            <div style={{ fontSize: 9, opacity: 0.6, lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: 3 }}>
              @{brand.handle} {brand.verificado && <BadgeCheck size={9} style={{ color: '#1D9BF0' }} fill="#1D9BF0" />}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{
            fontSize: numSlide === 1 ? 32 : 24,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}>
            {renderTitulo(slide.titulo, slide.destaque)}
          </h2>

          {slide.corpo && (
            <p style={{
              fontSize: 13,
              opacity: 0.6,
              marginTop: 14,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}>
              {slide.corpo}
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 10, opacity: 0.4 }}>
          <span>@{brand.handle}</span>
          <span>{numSlide < totalSlides ? 'arrasta →' : ''}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//                       TAB: IDEIAS
// ============================================================
function TabIdeias({ setTab }) {
  const ideias = [
    { id: 1, tema: 'O Stop Loss salvou minha conta de zerar 3 vezes', formula: 'Provocação emocional', arquetipo: 'minimalist', potencial: 'alto', motivo: 'Polariza imediatamente — quem não usa stop fica desconfortável e quem usa concorda. Gera comentários em massa.' },
    { id: 2, tema: 'Quanto renderia o salário mínimo investido por 30 anos', formula: 'Reframe matemático', arquetipo: 'twitter_quote', potencial: 'explosivo', motivo: 'Permite cálculo mental do leitor. Inspirado em @thiago.nigro (8,3k likes).' },
    { id: 3, tema: 'Carrosséis que traders nunca fazem (e por isso ficam invisíveis)', formula: 'Que ninguém faz', arquetipo: 'editorial', potencial: 'médio', motivo: 'Meta-conteúdo sobre como traders deveriam comunicar.' },
    { id: 4, tema: 'Por que 95% dos traders perdem nos primeiros 6 meses', formula: 'Promessa numerada', arquetipo: 'trader_dark', potencial: 'alto', motivo: 'Dado chocante + lista numerada. CTA forte pra DM.' },
    { id: 5, tema: 'Operar 10 minutos por dia vs 8 horas por dia', formula: 'Paradoxo cognitivo', arquetipo: 'twitter_quote', potencial: 'alto', motivo: 'Vai contra o senso comum. Identifica o trader cansado.' },
    { id: 6, tema: 'A mentira do price action básico que você aprendeu em curso', formula: 'Anti-narrativa', arquetipo: 'minimalist', potencial: 'alto', motivo: 'Provoca quem investiu em curso. Gera defesa e identificação.' },
    { id: 7, tema: 'Trader que opera em tilt já perdeu antes de clicar', formula: 'Provocação emocional', arquetipo: 'minimalist', potencial: 'médio', motivo: 'Toca dor universal — todo trader já operou em tilt.' },
    { id: 8, tema: 'O que 9 anos de mercado me ensinaram sobre disciplina', formula: 'Storytelling', arquetipo: 'editorial', potencial: 'médio', motivo: 'Storytelling pessoal + autoridade. Bom pra construir relacionamento.' },
    { id: 9, tema: 'A regra dos 3 stops que blindou minha conta', formula: 'Conselho específico', arquetipo: 'trader_dark', potencial: 'alto', motivo: 'Promessa concreta + CTA pro framework. Lead generation forte.' },
    { id: 10, tema: 'Por que indicador NÃO te dá vantagem (e o que dá)', formula: 'Negação de autoridade', arquetipo: 'minimalist', potencial: 'alto', motivo: 'Quebra crença comum. Posiciona Smart Money como diferencial.' },
  ];

  const corPotencial = (p) => p === 'explosivo' ? '#ff6b00' : p === 'alto' ? '#c9a961' : '#5a5448';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <div style={pillTag}><Lightbulb size={12} /> Brainstorm semanal</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, margin: '16px 0 8px', letterSpacing: '-0.02em' }}>
            10 ideias <em style={{ color: '#c9a961', fontWeight: 400 }}>magnéticas</em> pra essa semana
          </h1>
          <p style={{ color: '#8a8478', fontSize: 13 }}>
            Geradas com base em tendências dos seus competidores + voice memory @azvdou + temas em alta no nicho
          </p>
        </div>
        <button style={btnPrimary} onClick={() => window.location.reload()}>
          <RefreshCw size={16} /> Regenerar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16 }}>
        {ideias.map(i => (
          <div key={i.id} style={{
            background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 24,
            transition: 'all 0.15s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#5a5448', letterSpacing: 1, textTransform: 'uppercase' }}>
                #{String(i.id).padStart(2, '0')} · {i.formula}
              </div>
              <div style={{
                fontSize: 10, padding: '3px 10px', borderRadius: 100, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                background: corPotencial(i.potencial) + '20', color: corPotencial(i.potencial), border: `1px solid ${corPotencial(i.potencial)}40`,
              }}>
                {i.potencial}
              </div>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, lineHeight: 1.3, margin: '0 0 14px', color: '#f5f0e1' }}>
              {i.tema}
            </h3>
            <p style={{ fontSize: 12, color: '#8a8478', lineHeight: 1.5, marginBottom: 16 }}>
              {i.motivo}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => {
                try {
                  const saved = JSON.parse(window.localStorage.getItem('vlab_temas_pendentes') || '[]');
                  saved.push({ tema: i.tema, formula: i.formula, arquetipo: i.arquetipo, data: new Date().toISOString() });
                  window.localStorage.setItem('vlab_pre_tema', i.tema);
                  window.localStorage.setItem('vlab_pre_formula', i.formula);
                  window.localStorage.setItem('vlab_pre_arquetipo', i.arquetipo);
                } catch (e) {}
                setTab('criar');
              }} style={{ ...btnSecondary, fontSize: 12, padding: '8px 14px' }}>
                <Sparkles size={13} /> Gerar este
              </button>
              <button onClick={() => {
                try {
                  const saved = JSON.parse(window.localStorage.getItem('vlab_ideias_salvas') || '[]');
                  if (!saved.find(s => s.id === i.id)) {
                    saved.push({ ...i, salvo_em: new Date().toISOString() });
                    window.localStorage.setItem('vlab_ideias_salvas', JSON.stringify(saved));
                  }
                  alert('✅ Ideia salva! Você pode acessá-la na aba Biblioteca.');
                } catch (e) { alert('Erro ao salvar.'); }
              }} style={{ ...btnSecondary, fontSize: 12, padding: '8px 14px' }}>
                <Save size={13} /> Salvar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//                    TAB: PERFORMANCE
// ============================================================
function TabPerformance({ setTab }) {
  const totais = POSTS_MOCK.reduce((acc, p) => ({
    likes: acc.likes + p.likes, comments: acc.comments + p.comments, shares: acc.shares + p.shares,
    saves: acc.saves + p.saves, dms: acc.dms + p.dms,
  }), { likes: 0, comments: 0, shares: 0, saves: 0, dms: 0 });

  const top3 = [...POSTS_MOCK].sort((a, b) => b.likes - a.likes).slice(0, 3);

  // Pattern detection (mock)
  const insights = [
    { tipo: 'win', icone: Award, titulo: 'Hook formula vencedora', valor: 'Provocação emocional', detalhe: 'Suas postagens com hook emocional convertem 2,3× mais que listas numeradas' },
    { tipo: 'win', icone: Flame, titulo: 'Tema visual em alta', valor: 'Amarelo Clássico', detalhe: '4 dos seus 6 melhores posts usam esse tema. Continue priorizando' },
    { tipo: 'win', icone: TrendingUp, titulo: 'Reels superando carrosséis em reach', valor: '+87%', detalhe: 'Seus reels têm 87% mais alcance médio. Ideal alternar 50/50' },
    { tipo: 'tip', icone: Target, titulo: 'Melhor horário de postagem', valor: 'Terça/Quinta 18h', detalhe: 'Seus 3 posts mais engajados foram nesse slot' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={pillTag}><BarChart3 size={12} /> Performance & padrões</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, margin: '16px 0 8px', letterSpacing: '-0.02em' }}>
          O que está <em style={{ color: '#c9a961', fontWeight: 400 }}>dando certo</em>
        </h1>
        <p style={{ color: '#8a8478', fontSize: 13 }}>
          A IA aprende do que você posta e replica os padrões dos seus posts vencedores
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
        <StatCard icon={Heart}        label="Curtidas total"   valor={totais.likes.toLocaleString('pt-BR')} />
        <StatCard icon={MessageCircle} label="Comentários"      valor={totais.comments.toLocaleString('pt-BR')} />
        <StatCard icon={Share2}       label="Shares"           valor={totais.shares.toLocaleString('pt-BR')} />
        <StatCard icon={Bookmark}     label="Saves"            valor={totais.saves.toLocaleString('pt-BR')} />
        <StatCard icon={Send}         label="DMs ativados"     valor={totais.dms.toLocaleString('pt-BR')} highlight />
      </div>

      {/* Insights de padrão */}
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>
        🧠 Insights detectados pela IA
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 32 }}>
        {insights.map((ins, i) => {
          const Icon = ins.icone;
          return (
            <div key={i} style={{
              background: ins.tipo === 'win' ? 'linear-gradient(135deg, rgba(201,169,97,0.06) 0%, rgba(201,169,97,0.02) 100%)' : '#0d0d0d',
              border: `1px solid ${ins.tipo === 'win' ? 'rgba(201,169,97,0.25)' : '#1f1f1f'}`,
              borderRadius: 12, padding: 18,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(201,169,97,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} style={{ color: '#c9a961' }} />
                </div>
                <div style={{ fontSize: 11, color: '#8a8478', letterSpacing: 1, textTransform: 'uppercase' }}>{ins.titulo}</div>
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#f5f0e1', marginBottom: 6 }}>
                {ins.valor}
              </div>
              <p style={{ fontSize: 12, color: '#8a8478', lineHeight: 1.5 }}>{ins.detalhe}</p>
            </div>
          );
        })}
      </div>

      {/* Top 3 vencedores */}
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>
        🏆 Top 3 vencedores · pode replicar
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {top3.map((p, idx) => (
          <div key={p.id} style={{
            background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 20,
            display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 18, alignItems: 'center',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900,
              color: idx === 0 ? '#c9a961' : '#5a5448', textAlign: 'center',
            }}>
              {String(idx + 1).padStart(2, '0')}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 10, padding: '2px 8px', background: '#1a1410', color: '#c9a961', borderRadius: 100, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {p.tipo}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', background: '#0a1a0a', color: '#7ac97a', borderRadius: 100, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {p.hook_formula}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, margin: '0 0 6px', color: '#f5f0e1' }}>
                {p.tema}
              </h3>
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#8a8478' }}>
                <span>❤ {p.likes.toLocaleString('pt-BR')}</span>
                <span>💬 {p.comments}</span>
                <span>🔁 {p.shares}</span>
                <span>🔖 {p.saves}</span>
                <span style={{ color: '#c9a961', fontWeight: 700 }}>📥 {p.dms} DMs</span>
              </div>
            </div>
            <button onClick={() => setTab('criar')} style={{ ...btnSecondary, fontSize: 12, padding: '8px 16px', whiteSpace: 'nowrap' }}>
              <Sparkles size={13} /> Replicar
            </button>
          </div>
        ))}
      </div>

      {/* Histórico completo */}
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>
        Histórico completo
      </h2>
      <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#111', borderBottom: '1px solid #1f1f1f' }}>
              <th style={tableHeader}>Tipo</th>
              <th style={tableHeader}>Tema</th>
              <th style={tableHeader}>Fórmula</th>
              <th style={{...tableHeader, textAlign: 'right'}}>Likes</th>
              <th style={{...tableHeader, textAlign: 'right'}}>Saves</th>
              <th style={{...tableHeader, textAlign: 'right'}}>Shares</th>
              <th style={{...tableHeader, textAlign: 'right'}}>DMs</th>
              <th style={tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {POSTS_MOCK.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={tableCell}>
                  <span style={{ fontSize: 10, padding: '2px 8px', background: p.tipo === 'reel' ? '#1a1410' : '#1a1a1a', color: p.tipo === 'reel' ? '#c9a961' : '#8a8478', borderRadius: 100, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    {p.tipo}
                  </span>
                </td>
                <td style={{ ...tableCell, color: '#f5f0e1', fontWeight: 500 }}>{p.tema}</td>
                <td style={{ ...tableCell, color: '#8a8478', fontSize: 12 }}>{p.hook_formula}</td>
                <td style={{ ...tableCell, textAlign: 'right' }}>{p.likes.toLocaleString('pt-BR')}</td>
                <td style={{ ...tableCell, textAlign: 'right' }}>{p.saves}</td>
                <td style={{ ...tableCell, textAlign: 'right' }}>{p.shares}</td>
                <td style={{ ...tableCell, textAlign: 'right', color: '#c9a961', fontWeight: 700 }}>{p.dms}</td>
                <td style={tableCell}>
                  <button onClick={() => setTab('criar')} style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#c9a961', padding: '4px 12px', fontSize: 11, borderRadius: 6, cursor: 'pointer' }}>
                    Replicar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, valor, highlight }) {
  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg, rgba(201,169,97,0.1) 0%, rgba(201,169,97,0.04) 100%)' : '#0d0d0d',
      border: highlight ? '1px solid rgba(201,169,97,0.3)' : '1px solid #1f1f1f',
      borderRadius: 12, padding: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: highlight ? '#c9a961' : '#8a8478', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
        <Icon size={14} /> {label}
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#f5f0e1' }}>
        {valor}
      </div>
    </div>
  );
}

// ============================================================
//                    TAB: BIBLIOTECA
// ============================================================
function TabBiblioteca() {
  const items = [
    { id: 1, tema: 'Vingança depois de 3 stops seguidos', tipo: 'carrossel', arquetipo: 'minimalist', status: 'pronto' },
    { id: 2, tema: 'Stop hunt na abertura do mini índice', tipo: 'reel', arquetipo: 'trader_dark', status: 'rascunho' },
    { id: 3, tema: 'Por que SMC ganhou de price action clássico', tipo: 'carrossel', arquetipo: 'editorial', status: 'pronto' },
    { id: 4, tema: 'Day trade não tem férias', tipo: 'carrossel', arquetipo: 'minimalist', status: 'pronto' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={pillTag}><Library size={12} /> Biblioteca</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, margin: '16px 0 8px', letterSpacing: '-0.02em' }}>
          Conteúdos <em style={{ color: '#c9a961', fontWeight: 400 }}>salvos</em>
        </h1>
        <p style={{ color: '#8a8478', fontSize: 13 }}>Carrosséis e Reels gerados — prontos pra postar ou editar</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
        {items.map(it => (
          <div key={it.id} style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 10, padding: '2px 8px', background: '#1a1a1a', color: '#c9a961', borderRadius: 100, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {it.tipo}
              </span>
              <span style={{ fontSize: 10, padding: '2px 8px', background: it.status === 'pronto' ? '#0a1a0a' : '#1a1410', color: it.status === 'pronto' ? '#7ac97a' : '#c9a961', borderRadius: 100, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {it.status}
              </span>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, lineHeight: 1.3, margin: '0 0 10px', color: '#f5f0e1' }}>
              {it.tema}
            </h3>
            <div style={{ fontSize: 11, color: '#8a8478', marginBottom: 14 }}>
              Arquétipo: {it.arquetipo}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => alert(`📂 Abrindo: "${it.tema}"\n\nEm breve: visualização full do carrossel/reel.`)} style={{ ...btnSecondary, fontSize: 11, padding: '6px 12px' }}><Eye size={12} /> Abrir</button>
              <button onClick={() => alert(`✅ "${it.tema}" duplicado!\n\nO conteúdo será replicado na aba Criar com os mesmos parâmetros.`)} style={{ ...btnSecondary, fontSize: 11, padding: '6px 12px' }}><Copy size={12} /> Duplicar</button>
              <button onClick={() => alert(`✏️ Editar "${it.tema}"\n\nEm breve: editor inline pra ajustar slides salvos.`)} style={{ ...btnSecondary, fontSize: 11, padding: '6px 12px' }}><Edit3 size={12} /> Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//                    TAB: CONFIG
// ============================================================
function TabConfig({ brand, setBrand }) {
  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Selecione uma imagem (JPG, PNG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBrand(b => ({ ...b, fotoUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url) => setBrand(b => ({ ...b, fotoUrl: url || null }));
  const removerFoto = () => setBrand(b => ({ ...b, fotoUrl: null }));
  const updateField = (field, value) => setBrand(b => ({ ...b, [field]: value }));

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={pillTag}><Settings size={12} /> Configurações</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, margin: '16px 0 8px', letterSpacing: '-0.02em' }}>
          Calibragem da <em style={{ color: '#c9a961', fontWeight: 400 }}>VLAB</em>
        </h1>
        <p style={{ color: '#8a8478', fontSize: 13 }}>Branding, voice memory, integração com N8N</p>
      </div>

      {/* ============ Branding ============ */}
      <Section label="01 / Sua marca · foto + identidade">
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 24 }}>
          {/* Preview + upload */}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24, alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #1f1f1f' }}>
            <div style={{ position: 'relative' }}>
              <BrandPhoto photoUrl={brand.fotoUrl} size={104} />
              {!brand.fotoUrl && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'rgba(201, 169, 97, 0.08)', border: '2px dashed rgba(201, 169, 97, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#c9a961', textAlign: 'center', fontWeight: 600,
                }}>
                  Sem foto
                </div>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#f5f0e1', marginBottom: 6 }}>Foto de perfil</div>
              <div style={{ fontSize: 12, color: '#8a8478', marginBottom: 14, lineHeight: 1.5 }}>
                Essa foto vai aparecer em <strong>todos os carrosséis e reels</strong> que você gerar (header de cada slide).
                Pode subir um arquivo ou colar uma URL pública (Imgur, Cloudinary, etc).
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button onClick={() => fileInputRef.current?.click()} style={btnSecondary}>
                  <Plus size={14} /> Subir arquivo
                </button>
                {brand.fotoUrl && (
                  <button onClick={removerFoto} style={{ ...btnSecondary, color: '#ff9a8a', borderColor: '#3a1a1a' }}>
                    <Trash2 size={14} /> Remover
                  </button>
                )}
              </div>

              <div style={{ marginTop: 14 }}>
                <Label style={{ fontSize: 11 }}>Ou cole uma URL</Label>
                <input
                  type="url"
                  value={brand.fotoUrl && brand.fotoUrl.startsWith('http') ? brand.fotoUrl : ''}
                  onChange={e => handleUrlChange(e.target.value)}
                  placeholder="https://i.imgur.com/sua-foto.jpg"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Identidade textual editável */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <Label>Handle Instagram (sem o @)</Label>
              <input value={brand.handle} onChange={e => updateField('handle', e.target.value.replace('@', ''))} style={inputStyle} />
            </div>
            <div>
              <Label>Nome de exibição</Label>
              <input value={brand.nome} onChange={e => updateField('nome', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Label>Subtítulo</Label>
              <input value={brand.subtitulo} onChange={e => updateField('subtitulo', e.target.value)} placeholder="Ex: Trader Profissional · Smart Money" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Label>Bio (linha de credenciais)</Label>
              <input value={brand.bio} onChange={e => updateField('bio', e.target.value)} placeholder="Ex: 9 anos de mercado · +6 mil alunos" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#f5f0e1' }}>
                <input
                  type="checkbox"
                  checked={brand.verificado}
                  onChange={e => updateField('verificado', e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#1D9BF0' }}
                />
                Mostrar selo verificado <BadgeCheck size={14} style={{ color: '#1D9BF0' }} fill="#1D9BF0" />
              </label>
            </div>
          </div>

          <div style={{ marginTop: 18, padding: 12, background: 'rgba(201,169,97,0.05)', border: '1px solid rgba(201,169,97,0.2)', borderRadius: 8, fontSize: 12, color: '#c9a961', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={14} /> Mudanças salvas automaticamente · valem em todos os conteúdos novos
          </div>
        </div>
      </Section>

      {/* Voice Memory */}
      <Section label="02 / Voice Memory · termos preferidos">
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 20 }}>
          <Label>Termos validados</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {VOICE_MEMORY.termos_preferidos.map(t => (
              <span key={t} style={{ padding: '6px 12px', background: '#1a1410', color: '#c9a961', borderRadius: 100, fontSize: 12, border: '1px solid rgba(201,169,97,0.3)' }}>
                {t}
              </span>
            ))}
          </div>

          <Label>Frases proibidas (não vão aparecer)</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {VOICE_MEMORY.frases_proibidas.map(t => (
              <span key={t} style={{ padding: '6px 12px', background: '#3a1a1a', color: '#ff9a8a', borderRadius: 100, fontSize: 12, border: '1px solid rgba(255,154,138,0.3)', textDecoration: 'line-through' }}>
                {t}
              </span>
            ))}
          </div>

          <button onClick={() => alert('✏️ Voice Memory\n\nEm breve: editor pra adicionar/remover termos preferidos, frases proibidas e ajustes de tom diretamente aqui.\n\nPor enquanto, esses dados ficam no arquivo voice-memory.json do projeto N8N.')} style={btnSecondary}>
            <Edit3 size={14} /> Editar voice memory
          </button>
        </div>
      </Section>

      {/* Integrações */}
      <Section label="03 / Integrações">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <IntegrationCard label="N8N (VPS)" status="conectado" desc="Workflows: gerador, ideias, performance" />
          <IntegrationCard label="OpenAI API" status="conectado" desc="GPT-4o · gpt-4o-mini" />
          <IntegrationCard label="Meta Insights API" status="pendente" desc="Pra puxar métricas de posts publicados automaticamente" />
          <IntegrationCard label="Apify Instagram" status="pendente" desc="Trend scanner dos competidores" />
        </div>
      </Section>

      {/* Produtos & DM Triggers */}
      <Section label="04 / Produtos & DM Triggers">
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 12, padding: 4 }}>
          {PRODUTOS.map((p, i) => (
            <div key={p.id} style={{
              padding: 16, borderBottom: i === PRODUTOS.length - 1 ? 'none' : '1px solid #1f1f1f',
              display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: 600, color: '#f5f0e1', fontSize: 14, marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: '#8a8478' }}>{p.cta}</div>
              </div>
              <div style={{ fontSize: 11, color: '#5a5448', letterSpacing: 1, textTransform: 'uppercase' }}>Trigger DM</div>
              <span style={{ background: '#FFE94A', color: '#0a0a0a', padding: '4px 14px', borderRadius: 6, fontWeight: 700, fontSize: 13 }}>
                {p.trigger}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function IntegrationCard({ label, status, desc }) {
  const statusCor = status === 'conectado' ? '#7ac97a' : '#c9a961';
  return (
    <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 10, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 600, color: '#f5f0e1', fontSize: 13 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusCor }} />
          <span style={{ fontSize: 11, color: statusCor, textTransform: 'uppercase', letterSpacing: 0.5 }}>{status}</span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#8a8478', lineHeight: 1.4 }}>{desc}</div>
    </div>
  );
}

// ============================================================
//                  COMPONENTES AUXILIARES
// ============================================================
/**
 * BrandPhoto — usa a foto real (photoUrl) se fornecida, senão fallback pro avatar SVG default.
 * O usuário sobe a foto na aba Config (file upload OU URL externa).
 */
function BrandPhoto({ photoUrl, size = 32 }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt="brand"
        style={{
          width: size, height: size, borderRadius: '50%',
          flexShrink: 0, objectFit: 'cover',
          border: '1px solid rgba(201, 169, 97, 0.3)',
        }}
      />
    );
  }

  // Fallback: avatar SVG silhueta
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, #a8c0d6 0%, #6b87a8 50%, #2a3a4d 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: size * 0.18, left: '50%', transform: 'translateX(-50%)',
        width: size * 0.4, height: size * 0.4, borderRadius: '50%', background: '#d4b896',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: size * 0.7, height: size * 0.4, borderRadius: '50% 50% 0 0', background: '#1a1a1a',
      }} />
    </div>
  );
}

// Alias mantido pra retrocompatibilidade
const PhotoAzvdou = BrandPhoto;

const Section = ({ label, children }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ fontSize: 11, letterSpacing: 3, color: '#c9a961', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>
      {label}
    </div>
    {children}
  </div>
);

const Label = ({ children, style }) => (
  <div style={{ fontSize: 12, color: '#8a8478', marginBottom: 8, fontWeight: 500, ...style }}>{children}</div>
);

const RadioCard = ({ ativo, onClick, icon, label }) => (
  <button onClick={onClick} style={{
    flex: 1,
    background: ativo ? 'linear-gradient(135deg, #1a1410 0%, #2a1f15 100%)' : '#111',
    border: ativo ? '1px solid #c9a961' : '1px solid #1f1f1f',
    borderRadius: 10, padding: '14px 16px', cursor: 'pointer',
    color: ativo ? '#c9a961' : '#8a8478', fontSize: 14, fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: 10,
  }}>
    {icon}{label}
  </button>
);

// ============== STYLES ==============
const inputStyle = {
  width: '100%',
  background: '#111',
  border: '1px solid #1f1f1f',
  color: '#f5f0e1',
  padding: '12px 14px',
  borderRadius: 8,
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const btnPrimary = {
  background: 'linear-gradient(135deg, #c9a961 0%, #8b7341 100%)',
  color: '#0a0a0a',
  border: 'none',
  padding: '14px 28px',
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 700,
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  letterSpacing: 0.3,
  boxShadow: '0 8px 32px rgba(201, 169, 97, 0.2)',
  width: '100%',
  justifyContent: 'center',
};

const btnSecondary = {
  background: 'transparent',
  border: '1px solid #2a2a2a',
  color: '#c9a961',
  padding: '8px 16px',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'Inter, sans-serif',
};

const tipoCard = (ativo) => ({
  background: ativo ? 'linear-gradient(135deg, #1a1410 0%, #2a1f15 100%)' : '#111',
  border: ativo ? '1px solid #c9a961' : '1px solid #1f1f1f',
  borderRadius: 12,
  padding: 16,
  cursor: 'pointer',
  textAlign: 'left',
  color: '#f5f0e1',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.15s',
});

const navBtn = (disabled) => ({
  background: '#111',
  border: '1px solid #1f1f1f',
  color: disabled ? '#3a3a3a' : '#c9a961',
  width: 36, height: 36, borderRadius: 8,
  cursor: disabled ? 'default' : 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});

const pillTag = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '5px 14px',
  border: '1px solid rgba(201,169,97,0.3)',
  background: 'rgba(201,169,97,0.05)',
  borderRadius: 100,
  fontSize: 11,
  letterSpacing: 1.5,
  color: '#c9a961',
  textTransform: 'uppercase',
};

const tableHeader = {
  textAlign: 'left',
  padding: '14px 18px',
  fontSize: 11,
  color: '#8a8478',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontWeight: 600,
};

const tableCell = {
  padding: '14px 18px',
  color: '#f5f0e1',
};

// ============== MOCK GENERATOR (substituir por API real) ==============
function gerarMockSlides(tema, n, produto) {
  const produtoData = PRODUTOS.find(p => p.id === produto) || PRODUTOS[0];
  return [
    { tipo: 'capa',     titulo: `Depois do 3º stop seguido,\nvocê não opera mais.\n\nVocê SE VINGA.`,                                      corpo: '(e é aí que a conta zera de verdade)',                  destaque: 'SE VINGA' },
    { tipo: 'contexto', titulo: `Você tomou 3 stops.\nConta sangrando.\nA próxima vela vai "recuperar tudo".\n\n❌ Aumenta o lote\n❌ Tira o stop\n❌ Opera contra estrutura`, corpo: '📌 Esse trade nunca decide nada. Esse trade quebra você.', destaque: 'quebra você' },
    { tipo: 'conteudo', titulo: `Tem nome técnico: TILT.\n\nMesmo conceito do pôquer profissional.\n\nSeu cérebro deixa de calcular probabilidade.\nComeça a calcular vingança.`, corpo: 'E o mercado adora trader em modo vingança.',           destaque: 'TILT' },
    { tipo: 'conteudo', titulo: `A regra não é "estude mais".\nNão é "tenha mais disciplina".\n\nA regra é matemática:\n\n🛑 Stop loss DIÁRIO.\n🛑 3 stops = encerra o dia.`,    corpo: 'Sem "um pra recuperar". Cabeça fria amanhã.',                       destaque: 'DIÁRIO' },
    { tipo: 'insight',  titulo: `O trade que te quebra\n\nnão é o stop número 1, 2 ou 3.\n\nÉ o trade que você fez DEPOIS deles.`,        corpo: '',                                                                  destaque: 'DEPOIS' },
    { tipo: 'cta',      titulo: `Já tomou 3 stops hoje?\n\nFecha a plataforma. Sério.\n\nComenta ${produtoData.trigger}`,                  corpo: `Mando o framework de 4 regras que uso há 9 anos pra blindar dia ruim. (antes lê a legenda 🔥)`, destaque: produtoData.trigger },
  ].slice(0, n);
}
