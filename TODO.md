# TODO

> FARKLE VERTICAL SLICE:
> - Client-only game against AI;
> - Lobby, game, stats pages;
> - Game "backend" lives in web worker;

## Game state machine
Initial state
Actions -> diffs -> next state -> events -> state snapshot
Players should be able to rewind/replay finished game based on events/snapshots
Game state snapshot should be network transferable

## Game page UI
Mobile first
Native 2k support
Post 2k, should zoom?

## Routing
Global loading screen
Global error screen

## UI sound system
All clicks and key presses should have dedicated sound

## Background music system
Native OS music support
Artist - Title + Cover meta info
Medieval-styled mini-player (inside settings?)
Next song in-game notification

## Ambient soundscape
Pleasant forest white noise
Day/Night summer ambience
Occasional wind, birds, woodpecker, insects flying by, crickets, owls

## Game background
Orb with golden heraldic elements on dark blue-ish cloth?
Gradient, bottom black to blurred env map?

## Dice preview
List all game dice
Every item: icon, name
Preview: description, weights, 3d model
> TUNE DIE MATERIAL JSON VALUES

## i18n

## Start page
Enable UI sounds, enable background music, enable ambient soundscape
TBD: graphical settings
Players joining/readyness system + Bunnies
Target score slider
Player name + icon form
Dice loadout selection
Game day/night theme selector

## Overlay screens
Native fullscreen dialogs
Farkle with randomized image
Lost aka died screen
Fancy winning screen + confetti

## End game page
Finished game stats table
Who won
Players score

## Settings dialog
Native HTML dialog
In-game, triggered by ESC
UI sound volume
Music volume
Ambient volume
TBD: graphical settings
TBD: gamepad support
TBD: keys rebinding
Save to localStorage

## Players score
Icon + name with hard length limits
Current player turn indication
Waiting for player action + timer

## Notification center
Height limit
Scrolling container
Scroll snap
Error notifications
Text length limit

## Dice in-game overlay
1-6 + 666 values image
Focus ring
Player/opponent half-ring
Invisible button elements covering Three.js meshes
Try to make it accessible?

## Turn announcement

## Controls and buttons

## Emotes
Anchor positioned?
Should use KCD2 small dialog visuals
Emotes scene place area for both players?
Outsource phrases, translations and voice lines to community
Rate-limit

## Pointer/Keyboard system
Support press-to-action

## Game state shape
Types and defaults

## Seeding
Game seed
Turn seeds
Randomness system

## Three.js render
WebGPU
Inspector
Renderer
Render FPS limit
Document hidden reaction
Start/stop render loop
Add/remove pre/post render updates?
Clock/Timer? (should be global?)

## Scene
Groups
Static group
Separate Player vs Opponent groups

## Game camera
Rig
Shake
Zoom in/out
Fading aka eyes closing
Update, onResize

## Debug camera
Special shortcuts
Orbit camera
Special click on any mesh -> centers orbit around it

## Debug mode
Shift + D
Scene helpers for debugging
Special shortcut toggle
Game camera
Lighting
Shadow camera
Player/opponent dice placeholders
Player/opponent cup
Player/opponent roll placement

## Lighting
Candle flame light
Candle flame visual + TSL animation
Candle flame group, update/dispose
Sun spotlight
Sun gobo + TSL animation, update/dispose

## Global assets loader component
KCD2 game loading visuals
Three.js Load Manager with percentages?

## Preload fonts, main UI assets

## Lazy load shared game assets

## Animations control
Lerp/slerp animation system instead of Tween?
Just read current state and render pipeline

## Selected theme loader + applier

## Dust particles
Update/dispose

## Integrate raycaster with interactions system
Pub/sub system?

## Cup animations
Appear
Cover dice
Pre-shake position
Shaking
Post-shake position
Reveal dice
Disappear

## Full dice rolling end-to-end
When game starts both sides have their dice and cups in idle positions
Click on cup, click on action, press on roll button
If new turn, animate moving held dice back to dice roll area
Cup animation runs
When cup covers, hide dice
Generate and apply dice values
When cup reveals, show dice
Move game camera focus in

## Dice held/unheld animation

## Polish .HTML meta tags, icons, manifest, socials, etc.

## Graphical settings
anti-aliasing: on/off
pixel ratio: 0.5-2.0
fps limit: 30, 48, 60, 90, 120
shadows: on/off
shadows map: 512, 1024, 2048
dust: on/off
game camera shake: on/off

## Try out high-res details vs low-res colors
High-res normal maps + lower res albedo, specular, emissive, details
