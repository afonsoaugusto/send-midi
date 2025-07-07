# Contents of /audio-generation-project/audio-generation-project/src/main.py

import json
from audio_generator import AudioGenerator

def load_songs(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)
# ...existing code...

def main():
    songs = load_songs('../songs.json')
    audio_generator = AudioGenerator()

    for song in songs:
        audio_generator.generate_audio(song)

if __name__ == "__main__":
    main()