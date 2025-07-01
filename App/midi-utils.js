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
