// --- Constantes MIDI e textos dos botões ---
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

// Funções para botões Play, Pause, 20 Sec
export function setupTopButtons(ctx) {
    const btnPlay = document.getElementById('btnPlay');
    const btnPause = document.getElementById('btnPause');
    const btn20Sec = document.getElementById('btn20Sec');
    if (btnPlay) {
        btnPlay.onclick = async () => {
            if (!ctx.midiOutput) return;
            btnPlay.disabled = true;
            btnPlay.textContent = 'Enviando...';
            ctx.midiOutput.send([0xB0, MIDI_CC_PLAY, MIDI_VAL_PLAY]);
            ctx.statusDiv.textContent = `${BTN_TEXT_PLAY} enviado (CC ${MIDI_CC_PLAY} value ${MIDI_VAL_PLAY})`;
            setTimeout(() => {
                btnPlay.disabled = false;
                btnPlay.textContent = BTN_TEXT_PLAY;
            }, 800);
        };
    }
    if (btnPause) {
        btnPause.onclick = async () => {
            if (!ctx.midiOutput) return;
            btnPause.disabled = true;
            btnPause.textContent = 'Enviando...';
            ctx.midiOutput.send([0xB0, MIDI_CC_PAUSE, MIDI_VAL_PAUSE]);
            ctx.statusDiv.textContent = `${BTN_TEXT_PAUSE} enviado (CC ${MIDI_CC_PAUSE} value ${MIDI_VAL_PAUSE})`;
            setTimeout(() => {
                btnPause.disabled = false;
                btnPause.textContent = BTN_TEXT_PAUSE;
            }, 800);
        };
    }
    if (btn20Sec) {
        let secValue = 20;
        let btn20SecText = () => BTN_TEXT_20SEC(secValue);
        btn20Sec.textContent = btn20SecText();
        btn20Sec.onclick = async () => {
            if (!ctx.midiOutput) return;
            btn20Sec.disabled = true;
            btn20Sec.textContent = 'Enviando...';
            ctx.midiOutput.send([0xB0, MIDI_CC_PLAY, MIDI_VAL_PLAY]);
            ctx.statusDiv.textContent = `${BTN_TEXT_PLAY} enviado (CC ${MIDI_CC_PLAY} value ${MIDI_VAL_PLAY}), aguardando ${secValue}s...`;
            await new Promise(res => setTimeout(res, secValue * 1000));
            ctx.midiOutput.send([0xB0, MIDI_CC_PAUSE, MIDI_VAL_PAUSE]);
            ctx.statusDiv.textContent = `${BTN_TEXT_PAUSE} enviado após ${secValue}s (CC ${MIDI_CC_PAUSE} value ${MIDI_VAL_PAUSE})`;
            btn20Sec.textContent = btn20SecText();
            btn20Sec.disabled = false;
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
                btn.disabled = true;
                btn.textContent = 'Enviando...';
                midiMsgs.forEach(msg => {
                    ctx.midiOutput.send([0xB0, msg.channel, msg.value]);
                });
                ctx.statusDiv.textContent = `MIDI enviado para BPM: ${song.bpm}`;
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = 'Enviar MIDI';
                }, 1200);
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
// Retorna um array: [{channel: 74, value: X}, {channel: 75, value: Y}]
function convertBPMToMidi(bpm) {
    bpm = parseInt(bpm, 10);
    if (isNaN(bpm) || bpm < 40 || bpm > 300) {
        return null;
    }
    if (bpm >= 40 && bpm <= 127) {
        return [
            { channel: 74, value: 0 },
            { channel: 75, value: bpm }
        ];
    } else if (bpm >= 128 && bpm <= 255) {
        return [
            { channel: 74, value: 1 },
            { channel: 75, value: bpm - 128 }
        ];
    } else if (bpm >= 256 && bpm <= 300) {
        return [
            { channel: 74, value: 2 },
            { channel: 75, value: bpm - 256 }
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
                btn.disabled = true;
                const original = btn.textContent;
                btn.textContent = 'Enviando...';
                ctx.midiOutput.send([0xB0, MIDI_CC_PRESET, preset.value]);
                ctx.statusDiv.textContent = `${preset.label} enviado (CC ${MIDI_CC_PRESET} value ${preset.value})`;
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = original;
                }, 800);
            };
        }
    });
}
