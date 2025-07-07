import pyttsx3

def cifra_para_nota(cifra):
    """
    Traduz uma cifra musical para o nome da nota em português.
    Exemplos:
        C  -> Dó
        C# -> Dó Sustenido
        Cb -> Dó Bemol
        C#m -> Dó Sustenido Menor
    """
    mapa = {
        'C': 'Dó', 'C#': 'Dó Sustenido', 'Cb': 'Dó Bemol',
        'D': 'Ré', 'D#': 'Ré Sustenido', 'Db': 'Ré Bemol',
        'E': 'Mi', 'E#': 'Mi Sustenido', 'Eb': 'Mi Bemol',
        'F': 'Fá', 'F#': 'Fá Sustenido', 'Fb': 'Fá Bemol',
        'G': 'Sol', 'G#': 'Sol Sustenido', 'Gb': 'Sol Bemol',
        'A': 'Lá', 'A#': 'Lá Sustenido', 'Ab': 'Lá Bemol',
        'B': 'Si', 'B#': 'Si Sustenido', 'Bb': 'Si Bemol',
    }
    cifra = cifra.strip()
    menor = False
    if cifra.lower().endswith('m') and not cifra.lower().endswith('maj7m'):
        menor = True
        cifra = cifra[:-1]
    nota = mapa.get(cifra.capitalize(), cifra)
    if menor:
        return f"{nota} Menor"
    return nota

class AudioGenerator:
    def __init__(self):
        self.engine = pyttsx3.init()

    def generate_audio(self, song):
        # self.extract song details
        number = song['number']
        name = song['name']
        author = song['author']
        bpm = song['bpm']
        tom = cifra_para_nota(song['tom'])

        # Placeholder for audio generation logic
        #print(f"Generating audio for '{name}' by {author} at {bpm} BPM in key {tom}.")
        text = f"Música '{number}', '{name}' do {author}, em {bpm} BPM, Tom {tom}."
        print(text)
        # Configurar propriedades para melhor qualidade
        voices = self.engine.getProperty('voices')
        for voice in voices:
            if 'brazil' in voice.name.lower() or 'port' in voice.name.lower():
                self.engine.setProperty('voice', voice.id)
                break

        # Configurar velocidade self.e volume
        self.engine.setProperty('rate', 150)    # Velocidade (padrão é 200)
        self.engine.setProperty('volume', 0.9)  # Volume (0.0 a 1.0)

        # Gerar self.e reproduzir o áudio
        #self.engine.say(text)
        self.engine.runAndWait()

        # Salvar self.em arquivo (opcional)
        self.engine.save_to_file(text, f"{number}.mp3")
        self.engine.runAndWait()
                
        
        



