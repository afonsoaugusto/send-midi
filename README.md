
# send-midi for Ampero II Stomp
[![Live Application](https://img.shields.io/badge/Live-Application-brightgreen.svg)](https://afonsorodrigues.com/send-midi/App/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository hosts a web-based MIDI controller designed specifically for the **Hotone Ampero II Stomp** effects processor. The application provides a simple and intuitive interface for musicians to manage their live performance setlists, sending precise MIDI commands to the Ampero II Stomp to automatically set the song's tempo (BPM).

The application is built with standard web technologies (HTML, CSS, JavaScript) and utilizes the **Web MIDI API**, allowing it to run in a browser on any compatible device (PC, Mac, iPad, Android tablet) and connect to the Ampero II Stomp via USB or a Bluetooth MIDI adapter.

**Live Application URL: [https://afonsorodrigues.com/send-midi/App/](https://afonsorodrigues.com/send-midi/App/)**

## Core Features

- **Setlist Management:** The entire setlist is loaded from a simple, easy-to-edit `songs.json` file.
- **Song Grouping:** Songs are organized into collapsible groups (e.g., "BLOCO VIOLÃO", "BLOCO NACIONAL") for better organization during a show.
- **One-Click Tempo Change:** Simply clicking on a song in the list instantly sends the correct MIDI messages to the Ampero II Stomp to set the master tempo.
- **Automatic BPM to MIDI Conversion:** The application automatically calculates the required two-part MIDI CC messages (MSB/LSB) based on the song's BPM.
- **MIDI Connectivity:** Supports both wired (USB) and wireless (Bluetooth LE) MIDI connections.
- **Drum Machine Control:** Includes basic controls to start/stop the Ampero's built-in drum machine, useful for practice or click tracks.
- **Responsive Design:** The interface is optimized for use on both desktop and mobile/tablet devices.

## How It Works: The MIDI Logic

The Ampero II Stomp uses a two-message system for setting the tempo via MIDI Control Change (CC) messages, which provides a high resolution across a wide BPM range (40-300 BPM). The application handles this conversion automatically.

The tempo is controlled by two CC messages:
- **CC# 74 (Tempo MSB):** The "Most Significant Byte" which determines the broad BPM range.
- **CC# 75 (Tempo LSB):** The "Least Significant Byte" which provides the specific value within that range.

The logic, based on the official Ampero II Stomp MIDI documentation (Firmware V2.0.0), is as follows:

| BPM Range   | CC #74 Value (MSB) | CC #75 Value (LSB)      | Calculation      |
|-------------|--------------------|-------------------------|------------------|
| 40 - 127    | `0`                | `40` to `127`           | `Value = BPM`    |
| 128 - 255   | `1`                | `0` to `127`            | `Value = BPM - 128` |
| 256 - 300   | `2`                | `0` to `44`             | `Value = BPM - 256` |

**Example:**
For the song "Rádio Pirata" with a BPM of **153**:
1.  The BPM `153` falls into the `128 - 255` range.
2.  The application sends `CC #74` with a value of `1`.
3.  It then calculates the LSB value: `153 - 128 = 25`.
4.  It sends `CC #75` with a value of `25`.

The Ampero II Stomp receives these two messages and sets its master tempo to 153 BPM.

## How to Use

1.  **Connect Your Device:** Connect your Ampero II Stomp to your computer, tablet, or phone.
    - **Wired:** Use a standard USB cable.
    - **Wireless:** Use a Bluetooth MIDI adapter (like a WIDI Master or Yamaha MD-BT01) connected to the Ampero's MIDI IN/OUT ports.
2.  **Open the Application:** Navigate to [**https://afonsorodrigues.com/send-midi/App/**](https://afonsorodrigues.com/send-midi/App/) in a Web MIDI-compatible browser (Google Chrome is recommended).
3.  **Connect MIDI:** Click the **`Conectar MIDI Bluetooth`** button. A browser pop-up will appear, listing available MIDI devices. Select your Ampero II Stomp or your Bluetooth MIDI adapter from the list and click "Connect".
4.  **Select a Song:** The interface will display your setlist, organized by groups. Click on any song.
5.  **Done!** The application will instantly send the corresponding MIDI messages to set the tempo on your Ampero II Stomp. The status display will confirm the messages sent.

## Customizing Your Setlist

The entire setlist is defined in the `App/songs.json` file. You can fork this repository or download the files to create your own custom setlist.

The file contains a JSON array of song objects. Each object has the following structure:

```json
{
    "group": "BLOCO VIOLÃO",
    "name": "Chão de Giz",
    "bpm": 144,
    "author": "Zé Ramalho",
    "obs": "",
    "tom": "G",
    "color": false
}
```

- **`group`**: The name of the category this song belongs to. Songs with the same group name will be clustered together in the UI.
- **`name`**: The title of the song.
- **`bpm`**: **(Required)** The Beats Per Minute for the song. This is the value used for the MIDI calculation.
- **`author`**: The artist's name.
- **`obs`**: Any additional notes (e.g., "feat. Artista", "Léo no violão").
- **`tom`**: The musical key of the song.
- **`color`**: A boolean flag, which can be used for custom styling (not currently implemented but available for future use).

Simply edit this file to add, remove, or reorder your songs, then open the `index.html` file locally or host it on your own server.

## File Structure

The core application files are located in the `/App` directory.

```
/App
├── index.html          # The main application page
├── midi-utils.js       # Core JavaScript logic for MIDI, UI rendering, and event handling
├── songs.json          # The user-configurable setlist data
└── style.css           # CSS for styling the application
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. You are free to use, modify, and distribute this software.