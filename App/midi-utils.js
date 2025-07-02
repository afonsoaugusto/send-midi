
// --- Constantes MIDI e textos dos botões ---
// MIDI_CC_PLAY e MIDI_CC_PAUSE usam o mesmo CC (37) por padrão neste projeto.
// Se necessário, altere o valor de MIDI_CC_PAUSE para diferenciar.
export const MIDI_CC_PLAY = 37;
export const MIDI_CC_PAUSE = 37;
export const MIDI_CC_PRESET = 38;
export const MIDI_CC_BPM_CH1 = 74;
export const MIDI_CC_BPM_CH2 = 75;

export const MIDI_VAL_PLAY = 64;
export const MIDI_VAL_PAUSE = 0;
export const MIDI_PRESET_14 = 1;
export const MIDI_PRESET_44 = 4;
export const MIDI_PRESET_ROCK = 12;
export const MIDI_PRESET_POP = 13;

export const BTN_TEXT_PLAY = 'Play';
export const BTN_TEXT_PAUSE = 'Pause';
export const BTN_TEXT_20SEC = sec => `${sec} Sec`;
export const BTN_TEXT_PRESET_14 = '1/4';
export const BTN_TEXT_PRESET_44 = '4/4';
export const BTN_TEXT_PRESET_ROCK = 'Rock';
export const BTN_TEXT_PRESET_POP = 'Pop';

// --- Funções para botão de compassos (Comp) ---
import { compassesToSeconds } from './metronome.js';

// Utilitário para feedback visual em botões
function setButtonLoading(btn, loadingText = 'Enviando...', restoreText = null, delay = 800) {
    if (!btn) return;
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = loadingText;
    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = restoreText || original;
    }, delay);
}

export function setupCompassoButton(ctx) {
    const compassoSlider = document.getElementById('compassoSlider');
    const compassoValueSpan = document.getElementById('compassoValue');
    const btnComp = document.getElementById('btn20Sec');
    // Constantes para Play/Pause
    const COMPASSO_CC_PLAY = MIDI_CC_PLAY;
    const COMPASSO_CC_PAUSE = MIDI_CC_PAUSE;
    const COMPASSO_VAL_PLAY = MIDI_VAL_PLAY;
    const COMPASSO_VAL_PAUSE = MIDI_VAL_PAUSE;
    const COMPASSO_NUMERATOR = 4; // 4/4 fixo
    const COMPASSO_BPM_DEFAULT = 120;

    if (compassoSlider && compassoValueSpan) {
        compassoSlider.addEventListener('input', function () {
            compassoValueSpan.textContent = this.value;
        });
    }

    if (btnComp && compassoSlider) {
        btnComp.textContent = `${compassoSlider.value} Comp`;
        compassoSlider.addEventListener('input', function () {
            btnComp.textContent = `${this.value} Comp`;
        });

        btnComp.onclick = async () => {
            if (!ctx.midiOutput) {
                console.warn('Nenhum dispositivo MIDI conectado!');
                return;
            }
            setButtonLoading(btnComp, 'Enviando...', `${compassoSlider.value} Comp`, 800);
            console.log('Dispositivo MIDI:', ctx.midiOutput ? ctx.midiOutput.name : ctx.midiOutput, ctx.midiOutput);
            console.log('Enviando PLAY MIDI:', [0xB0, COMPASSO_CC_PLAY, COMPASSO_VAL_PLAY]);
            try {
                ctx.midiOutput.send([0xB0, COMPASSO_CC_PLAY, COMPASSO_VAL_PLAY]);
            } catch (err) {
                console.error('Erro ao enviar PLAY MIDI:', err);
                ctx.statusDiv.textContent = 'Erro ao enviar PLAY MIDI: ' + err;
                return;
            }
            // Calcula segundos baseado no BPM da música selecionada (ou padrão 120)
            let bpm = COMPASSO_BPM_DEFAULT;
            if (ctx.songs && ctx.selectedGroup) {
                const filtered = ctx.songs.filter(song => song._group === ctx.selectedGroup);
                if (filtered[ctx.selectedIdx] && filtered[ctx.selectedIdx].bpm) {
                    bpm = parseInt(filtered[ctx.selectedIdx].bpm, 10) || COMPASSO_BPM_DEFAULT;
                }
            }
            const nCompasses = parseInt(compassoSlider.value, 10);
            let seconds = 0;
            try {
                seconds = compassesToSeconds({ bpm, compassoNumerator: COMPASSO_NUMERATOR, nCompasses });
            } catch (e) {
                // fallback: cada compasso dura 2 segundos (valor arbitrário)
                seconds = nCompasses * 2;
            }
            ctx.statusDiv.textContent = `Play enviado (CC ${COMPASSO_CC_PLAY} value ${COMPASSO_VAL_PLAY}), aguardando ${nCompasses} compasso(s) (${seconds.toFixed(2)}s)...`;
            await new Promise(res => setTimeout(res, seconds * 1000));
            console.log('Enviando PAUSE MIDI:', [0xB0, COMPASSO_CC_PAUSE, COMPASSO_VAL_PAUSE]);
            try {
                ctx.midiOutput.send([0xB0, COMPASSO_CC_PAUSE, COMPASSO_VAL_PAUSE]);
            } catch (err) {
                console.error('Erro ao enviar PAUSE MIDI:', err);
                ctx.statusDiv.textContent = 'Erro ao enviar PAUSE MIDI: ' + err;
                return;
            }
            ctx.statusDiv.textContent = `Pause enviado após ${nCompasses} compasso(s) (${seconds.toFixed(2)}s)`;
        };
    }
}

// Funções para botões Play, Pause, 20 Sec
export function setupTopButtons(ctx) {
    const btnPlay = document.getElementById('btnPlay');
    const btnPause = document.getElementById('btnPause');
    const btn20Sec = document.getElementById('btn20Sec');
    if (btnPlay) {
        btnPlay.onclick = async () => {
            if (!ctx.midiOutput) {
                console.warn('Nenhum dispositivo MIDI conectado!');
                return;
            }
            setButtonLoading(btnPlay, 'Enviando...', BTN_TEXT_PLAY, 800);
            console.log('Dispositivo MIDI:', ctx.midiOutput ? ctx.midiOutput.name : ctx.midiOutput, ctx.midiOutput);
            console.log('Enviando PLAY MIDI:', [0xB0, MIDI_CC_PLAY, MIDI_VAL_PLAY]);
            ctx.midiOutput.send([0xB0, MIDI_CC_PLAY, MIDI_VAL_PLAY]);
            ctx.statusDiv.textContent = `${BTN_TEXT_PLAY} enviado (CC ${MIDI_CC_PLAY} value ${MIDI_VAL_PLAY})`;
        };
    }
    if (btnPause) {
        btnPause.onclick = async () => {
            if (!ctx.midiOutput) {
                console.warn('Nenhum dispositivo MIDI conectado!');
                return;
            }
            setButtonLoading(btnPause, 'Enviando...', BTN_TEXT_PAUSE, 800);
            console.log('Dispositivo MIDI:', ctx.midiOutput ? ctx.midiOutput.name : ctx.midiOutput, ctx.midiOutput);
            console.log('Enviando PAUSE MIDI:', [0xB0, MIDI_CC_PAUSE, MIDI_VAL_PAUSE]);
            ctx.midiOutput.send([0xB0, MIDI_CC_PAUSE, MIDI_VAL_PAUSE]);
            ctx.statusDiv.textContent = `${BTN_TEXT_PAUSE} enviado (CC ${MIDI_CC_PAUSE} value ${MIDI_VAL_PAUSE})`;
        };
    }
    if (btn20Sec) {
        let secValue = 20;
        let btn20SecText = () => BTN_TEXT_20SEC(secValue);
        btn20Sec.textContent = btn20SecText();
        btn20Sec.onclick = async () => {
            if (!ctx.midiOutput) return;
            setButtonLoading(btn20Sec, 'Enviando...', btn20SecText(), secValue * 1000);
            ctx.midiOutput.send([0xB0, MIDI_CC_PLAY, MIDI_VAL_PLAY]);
            ctx.statusDiv.textContent = `${BTN_TEXT_PLAY} enviado (CC ${MIDI_CC_PLAY} value ${MIDI_VAL_PLAY}), aguardando ${secValue}s...`;
            await new Promise(res => setTimeout(res, secValue * 1000));
            ctx.midiOutput.send([0xB0, MIDI_CC_PAUSE, MIDI_VAL_PAUSE]);
            ctx.statusDiv.textContent = `${BTN_TEXT_PAUSE} enviado após ${secValue}s (CC ${MIDI_CC_PAUSE} value ${MIDI_VAL_PAUSE})`;
        };
        // Slider integration
        const slider = document.getElementById('secSlider');
        const secValueSpan = document.getElementById('secValue');
        if (slider && secValueSpan) {
            slider.addEventListener('input', function () {
                secValue = parseInt(this.value, 10);
                secValueSpan.textContent = secValue;
                btn20Sec.textContent = btn20SecText();
            });
        }
    }
}
// --- Funções extraídas do index.html ---
export function loadSongsApp(ctx) {
    return async function loadSongs() {
        try {
            const resp = await fetch('songs.json');
            if (!resp.ok) throw new Error('Erro HTTP: ' + resp.status);
            ctx.songs = await resp.json();
            ctx.groups = [];
            ctx.songs.forEach(song => {
                if (song.group && !ctx.groups.includes(song.group)) {
                    ctx.groups.push(song.group);
                }
                song._group = song.group || 'Outros';
            });
            ctx.selectedGroup = ctx.groups[0] || null;
            ctx.renderGroupList();
            ctx.renderSongList();
            ctx.renderSelectedSong();
        } catch (e) {
            ctx.songListDiv.innerHTML = '<div style="padding:16px;color:#c00;text-align:center">Erro ao carregar lista de músicas.<br>' + (e.message || e) + '</div>';
            ctx.groupListDiv.innerHTML = '';
        }
    }
}

export function renderGroupListApp(ctx) {
    return function renderGroupList() {
        ctx.groupListDiv.innerHTML = '';
        if (ctx.groups.length === 0) {
            ctx.groupListDiv.innerHTML = '<div style="padding:12px;color:#888;text-align:center">Nenhum agrupamento encontrado.</div>';
            return;
        }
        ctx.groups.forEach(group => {
            const btn = document.createElement('button');
            btn.textContent = group;
            btn.style = 'display:block;width:100%;margin-bottom:6px;padding:8px 10px;border-radius:4px;border:1px solid #1976d2;background:' + (group === ctx.selectedGroup ? '#e3eaff' : '#fff') + ';color:#1976d2;cursor:pointer;font-weight:' + (group === ctx.selectedGroup ? 'bold' : 'normal') + ';';
            btn.onclick = () => {
                ctx.selectedGroup = group;
                ctx.selectedIdx = 0;
                ctx.renderGroupList();
                ctx.renderSongList();
                ctx.renderSelectedSong();
            };
            ctx.groupListDiv.appendChild(btn);
        });
    }
}

export function renderSongListApp(ctx) {
    return function renderSongList() {
        ctx.songListDiv.innerHTML = '';
        const filtered = ctx.songs.filter(song => song._group === ctx.selectedGroup);
        if (filtered.length === 0) {
            ctx.songListDiv.innerHTML = '<div style="padding:16px;color:#888;text-align:center">Nenhuma música encontrada.</div>';
            return;
        }
        filtered.forEach((song, i) => {
            const item = document.createElement('div');
            item.className = 'song-list-item';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.gap = '12px';

            // Destaque suave para músicas com color true
            if (song.color === true) {
                item.style.background = '#f3f7ff'; // azul bem claro
                item.style.borderLeft = '5px solid #90caf9'; // azul suave
            }

            let infoDiv = document.createElement('div');
            infoDiv.style.flex = '1';
            let info = `<div class='song-title'><b>${song.title || song.name}</b></div>`;
            if (song.author) info += `<div class='song-author'>Artista: ${song.author}</div>`;
            if (song.obs && song.obs.trim() !== "") info += `<div class='song-obs'>${song.obs}</div>`;
            if (song.tom) info += `<div class='song-tonality'>Tom: ${song.tom}</div>`;
            if (song.bpm) info += `<div class='song-bpm'>BPM: ${song.bpm}</div>`;
            infoDiv.innerHTML = info;

            // Botão enviar MIDI
            const btn = document.createElement('button');
            btn.className = 'send-btn';
            btn.textContent = 'Enviar MIDI';
            let midiMsgs = convertBPMToMidi(song.bpm);
            btn.disabled = !ctx.midiOutput || !midiMsgs;
            btn.onclick = async () => {
                if (!ctx.midiOutput || !midiMsgs) return;
                setButtonLoading(btn, 'Enviando...', 'Enviar MIDI', 1200);
                midiMsgs.forEach(msg => {
                    ctx.midiOutput.send([0xB0, msg.cc, msg.value]);
                });
                ctx.statusDiv.textContent = `MIDI enviado para BPM: ${song.bpm}`;
            };

            item.appendChild(infoDiv);
            item.appendChild(btn);
            ctx.songListDiv.appendChild(item);
        });
    }
}

export function renderSelectedSongApp(ctx) {
    return function renderSelectedSong() {
        const panel = document.getElementById('selectedSong');
        if (panel) panel.innerHTML = '';
    }
}

export function initMIDIApp(ctx) {
    return async function initMIDI(options = {}) {
        if (!navigator.requestMIDIAccess) {
            ctx.statusDiv.textContent = 'Web MIDI API não suportada neste navegador.';
            return;
        }
        try {
            ctx.midiAccess = await navigator.requestMIDIAccess(options);
            const outputs = Array.from(ctx.midiAccess.outputs.values());
            if (outputs.length === 0) {
                ctx.statusDiv.textContent = 'Nenhum dispositivo MIDI encontrado.';
                return;
            }
            ctx.midiOutput = outputs[0];
            ctx.statusDiv.textContent = 'Dispositivo MIDI pronto: ' + ctx.midiOutput.name;
            ctx.renderSelectedSong();
        } catch (e) {
            ctx.statusDiv.textContent = 'Erro ao acessar MIDI: ' + e;
        }
    }
}

export function setupConnectMidiBtnApp(ctx) {
    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('connectMidiBtn');
        if (btn) {
            btn.onclick = async () => {
                ctx.statusDiv.textContent = 'Solicitando conexão MIDI Bluetooth...';
                await ctx.initMIDI({ sysex: true, software: true });
            };
        }
    });
}
// Função para converter BPM em mensagens MIDI conforme a regra fornecida
// Retorna um array: [{cc: 74, value: X}, {cc: 75, value: Y}]
export function convertBPMToMidi(bpm) {
    bpm = parseInt(bpm, 10);
    if (isNaN(bpm) || bpm < 40 || bpm > 300) {
        return null;
    }
    if (bpm >= 40 && bpm <= 127) {
        return [
            { cc: 74, value: 0 },
            { cc: 75, value: bpm }
        ];
    } else if (bpm >= 128 && bpm <= 255) {
        return [
            { cc: 74, value: 1 },
            { cc: 75, value: bpm - 128 }
        ];
    } else if (bpm >= 256 && bpm <= 300) {
        return [
            { cc: 74, value: 2 },
            { cc: 75, value: bpm - 256 }
        ];
    }
    return null;
}

// Funções para botões de preset (1/4, 4/4, Rock, Pop)
export function setupPresetButtons(ctx) {
    const presets = [
        { id: 'btnPreset14', value: MIDI_PRESET_14, label: BTN_TEXT_PRESET_14 },
        { id: 'btnPreset44', value: MIDI_PRESET_44, label: BTN_TEXT_PRESET_44 },
        { id: 'btnPresetRock', value: MIDI_PRESET_ROCK, label: BTN_TEXT_PRESET_ROCK },
        { id: 'btnPresetPop', value: MIDI_PRESET_POP, label: BTN_TEXT_PRESET_POP },
    ];
    presets.forEach(preset => {
        const btn = document.getElementById(preset.id);
        if (btn) {
            btn.onclick = async () => {
                if (!ctx.midiOutput) return;
                setButtonLoading(btn, 'Enviando...', preset.label, 800);
                ctx.midiOutput.send([0xB0, MIDI_CC_PRESET, preset.value]);
                ctx.statusDiv.textContent = `${preset.label} enviado (CC ${MIDI_CC_PRESET} value ${preset.value})`;
            };
        }
    });
}
