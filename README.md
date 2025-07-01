# send-midi

Este repositório <https://github.com/afonsoaugusto/send-midi> está publicado no github pages na pagina <https://afonsorodrigues.com/send-midi/>.

O objeto da aplicação e prover uma interface web simples para enviar mensagens MIDI para um dispositivo MIDI conectado ao computador/celular/ipad.

É necessário que seja enviada 2 mensagens MIDI de forma simultanea para o dispositivo:

- Canal MIDI:74
- value: (0 - 2)

- Canal MIDI: 75
- value: (0 - 127)

Na interface será uma lista estatica onde a parte de cima terá o nome, valor e um botão para enviar a mensagem MIDI.

- Lista:
  - Nome: In the Air Tonight – Phil Collins (Tom: C, BPM: 99)
    - Canal MIDI: 74
      - Value: 0
    - Canal MIDI: 75
      - Value: 99
  - Nome: Crazy – Seal (Tom: B minor, BPM: 103)
    - Canal MIDI: 74
      - Value: 0
    - Canal MIDI: 75
      - Value: 103
  - Nome: Rádio Pirata – RPM (Tom: B, BPM: 153)
    - Canal MIDI: 74
      - Value: 0
    - Canal MIDI: 75
      - Value: 153
