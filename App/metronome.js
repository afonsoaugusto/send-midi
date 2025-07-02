// metronome.js
// Função para calcular a duração de um compasso em segundos
// compassoNumerator: número de batidas por compasso (ex: 4 para 4/4)
// bpm: batidas por minuto
// nCompasses: quantidade de compassos

export function compassesToSeconds({ bpm, compassoNumerator = 4, nCompasses = 1 }) {
    if (!bpm || bpm <= 0 || !compassoNumerator || compassoNumerator <= 0 || !nCompasses || nCompasses <= 0) {
        throw new Error('Parâmetros inválidos');
    }
    // duração de uma batida em segundos
    const beatDuration = 60 / bpm;
    // duração total correta: (número de batidas total) * duração de uma batida
    const totalBeats = compassoNumerator * nCompasses;
    let totalSeconds = totalBeats * beatDuration;
    // Compensação para atrasos do setTimeout (~30ms por compasso)
    const compensation = nCompasses * 0.03; // 30ms por compasso
    totalSeconds = Math.max(0, totalSeconds - compensation);
    return totalSeconds;
}

// Exemplo de uso:
// compassesToSeconds({ bpm: 100, compassoNumerator: 4, nCompasses: 2 }) // retorna 4.8 segundos
