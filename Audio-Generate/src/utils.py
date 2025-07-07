def load_songs(file_path):
    import json
    with open(file_path, 'r', encoding='utf-8') as file:
        songs = json.load(file)
    return songs

def format_song_data(song):
    return {
        "title": song["name"],
        "author": song["author"],
        "bpm": song["bpm"],
        "key": song["tom"],
        "group": song["group"]
    }