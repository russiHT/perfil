/* ==========================================================================
   AUDIO ENGINE — AudioContext único e compartilhado
   --------------------------------------------------------------------------
   Antes cada bipe criava um `new AudioContext()` que nunca era fechado.
   Navegadores limitam a ~6 contextos por página: depois de algumas dezenas
   de cliques o áudio simplesmente parava de funcionar. Aqui existe UM único
   contexto, criado sob demanda e retomado no primeiro gesto do usuário
   (política de autoplay).
   ========================================================================== */

let ctx = null;
let unavailable = false;

/** Retorna o AudioContext compartilhado (ou null se o navegador não suportar). */
export function getAudioContext() {
  if (unavailable || typeof window === 'undefined') return null;

  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) {
    unavailable = true;
    return null;
  }

  if (!ctx) {
    try {
      ctx = new AudioCtor();
    } catch (err) {
      unavailable = true;
      return null;
    }
  }

  // Navegadores suspendem o contexto até haver interação do usuário.
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  return ctx;
}

/**
 * Toca um tom simples.
 * @returns {number} o instante (em tempo do contexto) em que o tom termina,
 *                   útil para encadear bipes em sequência.
 */
export function playTone({
  freq = 600,
  type = 'square',
  duration = 0.08,
  volume = 0.03,
  startAt = null
} = {}) {
  const audioCtx = getAudioContext();
  if (!audioCtx) return 0;

  const start = startAt ?? audioCtx.currentTime;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(start);
    osc.stop(start + duration);

    // Libera os nós assim que o tom acaba, evitando acúmulo na memória.
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch (err) {
        /* nó já desconectado */
      }
    };
  } catch (err) {
    return start;
  }

  return start + duration;
}

/** Clique curto de feedback do terminal. */
export function playClick() {
  playTone({ freq: 800, type: 'square', duration: 0.05, volume: 0.02 });
}

/**
 * Transmite uma string de código Morse como bipes de 700 Hz.
 * Limitado a 60 símbolos para não travar a fila de áudio.
 */
export function playMorse(morseString) {
  const audioCtx = getAudioContext();
  if (!audioCtx) return;

  const UNIT = 0.05; // 50 ms por ponto
  let cursor = audioCtx.currentTime + 0.05;

  for (const char of morseString.slice(0, 60)) {
    if (char === '.' || char === '-') {
      const duration = char === '.' ? UNIT : UNIT * 3;
      playTone({
        freq: 700,
        type: 'sine',
        duration,
        volume: 0.04,
        startAt: cursor
      });
      cursor += duration + UNIT;
    } else if (char === ' ') {
      cursor += UNIT * 2;
    } else if (char === '/') {
      cursor += UNIT * 4;
    }
  }
}
