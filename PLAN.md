# JOS — Joshua Operating System

Personal website styled as a retro DOS terminal. Visitors type commands to learn about Joshua Lane.

## Stack

- **Vite** + **React** + **TypeScript** — static site, no backend
- **Plain CSS** with custom properties — terminal aesthetic
- **VT323** Google Font — retro monospace terminal font
- Builds to static `dist/` deployable anywhere

## Current Implementation

### Done

- **Project scaffold** — Vite + React + TS, builds successfully
- **Terminal UI** — black background, green text, CRT scanline overlay, text glow, blinking cursor
- **Boot sequence** — DOS-style timed animation on page load (memory check, startup messages)
- **Command system** — registry pattern, 5 commands: `help`, `about`, `skills`, `contact`, `clear`
- **Command history** — up/down arrow keys cycle through previous commands
- **Terminal features** — auto-scroll, click-to-focus, unknown command error messages

### How to add a new command

1. Create `src/commands/mycommand.ts` exporting a `CommandHandler`
2. Import and register it in `src/commands/registry.ts`
3. It auto-appears in `help`

## Planned

### Phase 2: Content & Polish

- [ ] Update `contact.ts` with real email, GitHub, LinkedIn URLs
- [ ] Review and refine `about.ts` and `skills.ts` content
- [ ] Tune boot sequence timing and messages
- [ ] Mobile responsiveness testing
- [ ] Favicon (retro terminal icon)

### Phase 3: Fun Commands & Mini-Apps

Ideas for interactive commands that launch mini-apps either inline in the terminal or on separate pages:

- [ ] `snake` — classic Snake game
- [ ] `matrix` — Matrix rain animation
- [ ] `fortune` — random quote/joke
- [ ] `history` — show command history
- [ ] `theme` — switch color schemes (green, amber, white)
- [ ] `neofetch` — system info display (styled like the real neofetch)
- [ ] `cat resume.txt` — display a formatted resume

Mini-apps can be implemented by extending `CommandOutput` with a `component` field for inline React components, or by adding React Router for full-page apps.

### Phase 4: Deployment

- [ ] Choose hosting (GitHub Pages, Vercel, Netlify, etc.)
- [ ] Set up custom domain
- [ ] Add meta tags / Open Graph for link previews

## Key Files

```
src/
  commands/
    types.ts              # CommandHandler, OutputSegment types
    registry.ts           # Command map — central wiring point
    help.ts, about.ts, skills.ts, contact.ts, clear.ts
  components/
    Terminal.tsx           # Orchestrator: boot → ready phase
    BootSequence.tsx       # Timed boot animation
    TerminalInput.tsx      # Prompt + input + cursor
    TerminalOutput.tsx     # Scrollable output history
    OutputLine.tsx         # Renders text, links, accents
  hooks/
    useTerminal.ts        # Output state, command dispatch
    useCommandHistory.ts  # Up/down arrow navigation
    useBootSequence.ts    # Boot animation timing
  data/
    boot-sequence.ts      # Boot lines with per-line delays
  lib/
    parseCommand.ts       # Splits input into command + args
```
