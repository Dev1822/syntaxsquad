import { DEFAULT_ROOMS } from '../config/rooms.js';

export async function generateMysteryData(players) {
  const playerCount = players.length;
  
  const prompt = `You are a master mystery writer generating a structured murder mystery game.
Generate a complete mystery in JSON format.

REQUIREMENTS:
- There must be EXACTLY ${playerCount} suspects (these correspond to the players).
- The murderer must be chosen randomly among the suspects (it must make narrative sense).
- HORROR TWIST: Weave in a supernatural red herring (e.g., rumors of a ghost, cursed manor). Clues may initially point toward paranormal activity, but the true solution MUST be logical (human-committed). The horror comes from atmosphere and misdirection.
- ROOMS & CLUES: Populate specific, atmospheric horror-themed descriptions and clues for the mansion's rooms.

OUTPUT FORMAT MUST BE STRICT JSON matching this schema:
{
  "victim": {
    "name": "string",
    "backstory": "string"
  },
  "location": {
    "name": "string",
    "description": "string (include supernatural rumors)"
  },
  "suspects": [
    {
      "name": "string",
      "age": "number",
      "occupation": "string",
      "physicalDescription": "string",
      "publicBackground": "string (known to all)",
      "privateObjective": "string (e.g., 'You owe the victim money; you need to frame someone else')",
      "hiddenInformation": "string (e.g., 'You saw the victim arguing with the gardener at 10pm')",
      "secretRelationship": "string (e.g., 'You are the victim\\'s illegitimate child')"
    }
  ],
  "timeline": [
    {
      "time": "string",
      "event": "string (sequence of events with gaps)"
    }
  ],
  "initialClues": [
    {
      "name": "string",
      "description": "string (e.g., a broken watch, a muddy footprint)"
    }
  ],
  "rooms": [
    {
      "id": "string (MUST EXACTLY MATCH one of these: hallway, garage, basement, library, kitchen, study, dining_room, room_1, bathroom, conservatory, room_2, observatory, room_3)",
      "name": "string (e.g., 'Dusty Library', 'Bloodstained Kitchen', 'Abandoned Garage')",
      "description": "string (detailed spooky description)",
      "clues": [
        {
          "name": "string (clue name)",
          "description": "string (what the clue reveals)",
          "isSupernatural": "boolean"
        }
      ] // YOU MUST GENERATE 3 TO 5 CLUES FOR EVERY SINGLE ROOM.
    }
  ],
  "murderer": "string (MUST EXACTLY MATCH one of the suspect names)",
  "motive": "string",
  "method": "string",
  "opportunity": "string",
  "hiddenEvents": [
    {
      "trigger": "string",
      "eventDescription": "string (potential mid-game events)"
    }
  ]
}

DO NOT include any markdown formatting, markdown blocks, or plain text outside the JSON. Return ONLY the JSON object.`;

  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const endpoint = `${ollamaUrl.replace(/\/$/, '')}/api/generate`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: prompt,
        stream: false,
        format: 'json'
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    try {
      let cleanResponse = data.response.trim();
      // Remove markdown formatting if Llama includes it accidentally
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
      }
      const mystery = JSON.parse(cleanResponse);
      
      // Merge AI generated room data with static DEFAULT_ROOMS config
      mystery.rooms = mergeRooms(mystery.rooms);
      
      return mystery;
    } catch (parseError) {
      console.error('Failed to parse JSON from Ollama. Raw response:', data.response);
      throw parseError;
    }
  } catch (error) {
    console.error('Error generating mystery from Llama 3.2:', error);
    // Return a fallback mystery if generation fails
    return getFallbackMystery(playerCount);
  }
}

function mergeRooms(aiRooms) {
  const mergedRooms = [];

  for (const defaultRoom of DEFAULT_ROOMS) {
    const aiRoom = Array.isArray(aiRooms) ? aiRooms.find(r => r && r.id === defaultRoom.id) : null;
    
    mergedRooms.push({
      id: defaultRoom.id,
      name: aiRoom?.name || defaultRoom.name,
      description: aiRoom?.description || defaultRoom.description,
      position: defaultRoom.position,
      connections: defaultRoom.connections,
      clues: Array.isArray(aiRoom?.clues) ? aiRoom.clues : []
    });
  }

  return mergedRooms;
}

function getFallbackMystery(playerCount) {
  // Simple fallback in case Ollama is unreachable
  return {
    victim: { name: "Lord Alistair Blackwood", backstory: "Wealthy aristocrat with many enemies." },
    location: { name: "Blackwood Manor", description: "A dark, looming estate rumoured to be haunted." },
    suspects: Array.from({ length: playerCount }).map((_, i) => ({
      name: `Guest ${i + 1}`,
      age: 30 + i,
      occupation: "Socialite",
      physicalDescription: "Suspiciously well-dressed.",
      publicBackground: "An old friend of the victim.",
      privateObjective: "Hide your massive debts.",
      hiddenInformation: "You heard a scream at midnight.",
      secretRelationship: "You were blackmailing the victim."
    })),
    timeline: [{ time: "23:00", event: "The lights went out." }],
    initialClues: [{ name: "Shattered Glass", description: "Found near the body." }],
    rooms: [
      { id: 'hallway', name: 'Hallway', description: 'A dark, echoing entrance hallway.' },
      { id: 'garage', name: 'Garage', description: 'Oil stains and rusty tools.' },
      { id: 'basement', name: 'Basement', description: 'Cold stone and forgotten barrels.' },
      { id: 'library', name: 'Library', description: 'Towering shelves of decaying books.' },
      { id: 'kitchen', name: 'Kitchen', description: 'Smells of rotting meat and iron.' },
      { id: 'study', name: 'Study', description: 'A messy desk covered in frantic writings.' },
      { id: 'dining_room', name: 'Dining Room', description: 'A long table set for a feast that never happened.' },
      { id: 'room_1', name: 'Master Bedroom', description: 'An ornate bed with torn velvet curtains.' },
      { id: 'bathroom', name: 'Bathroom', description: 'A cracked mirror and a rusted tub.' },
      { id: 'conservatory', name: 'Conservatory', description: 'Overgrown dead plants.' },
      { id: 'room_2', name: 'Billiard Room', description: 'A dusty pool table.' },
      { id: 'observatory', name: 'Observatory', description: 'A large brass telescope pointed at the stars.' },
      { id: 'room_3', name: 'Guest Bedroom', description: 'An unsettlingly neat bed.' }
    ].map(room => ({
      ...room,
      clues: getFallbackCluesForRoom(room.id)
    })),
    murderer: "Guest 1",
    motive: "Money.",
    method: "Poison.",
    opportunity: "Was alone with the victim's drink.",
    hiddenEvents: [{ trigger: "Investigate study", eventDescription: "A painting falls off the wall." }]
  };
}

function getFallbackCluesForRoom(roomId) {
  const cluesByRoom = {
    hallway: [
      { name: "Flickering Chandelier", description: "The chain appears rusted through, almost as if deliberately cut.", isSupernatural: false },
      { name: "Muddy Footprints", description: "Someone walked through here recently, tracking in soil.", isSupernatural: false },
      { name: "Cold Draft", description: "An unnatural breeze chills you to the bone.", isSupernatural: true }
    ],
    garage: [
      { name: "Bloody Wrench", description: "Hidden under a rag, covered in dried blood.", isSupernatural: false },
      { name: "Missing Keys", description: "The keys to the old estate car are gone.", isSupernatural: false },
      { name: "Phantom Engine", description: "You swear you can hear an engine idling, but the car is cold.", isSupernatural: true }
    ],
    basement: [
      { name: "Ripped Fabric", description: "A piece of a fancy suit caught on a barrel.", isSupernatural: false },
      { name: "Shattered Lantern", description: "Someone dropped this in a hurry.", isSupernatural: false },
      { name: "Whispering Shadows", description: "The darkness seems to speak your name.", isSupernatural: true }
    ],
    library: [
      { name: "Tattered Diary Entry", description: "Spooky ramblings mentioning shadows that move on their own.", isSupernatural: true },
      { name: "Missing Book", description: "A gap in the shelf where a book on poisons used to be.", isSupernatural: false },
      { name: "Burnt Letter", description: "Only the words 'meet me tonight' are legible.", isSupernatural: false }
    ],
    study: [
      { name: "Unsent Blackmail Letter", description: "A threatening note written by Guest 1 targeting the victim's debts.", isSupernatural: false },
      { name: "Hidden Safe", description: "The safe is wide open and empty.", isSupernatural: false },
      { name: "Bleeding Ink", description: "The ink well seems to be filled with fresh blood.", isSupernatural: true }
    ],
    kitchen: [
      { name: "Empty Vials of Cyanide", description: "Hidden behind the rotting wooden drawers.", isSupernatural: false },
      { name: "Half-Eaten Meal", description: "Someone left in a rush.", isSupernatural: false },
      { name: "Rattling Knives", description: "The knives in the block seem to vibrate on their own.", isSupernatural: true }
    ],
    dining_room: [
      { name: "Tipped Wine Glass", description: "A white residue is visible on the rim, smelling faintly of almonds.", isSupernatural: false },
      { name: "Torn Place Card", description: "Guest 2's name was crossed out violently.", isSupernatural: false },
      { name: "Cold Breath", description: "You see your breath, though the room is warm.", isSupernatural: true }
    ],
    room_1: [
      { name: "Smashed Pocket Watch", description: "Stopped exactly at midnight.", isSupernatural: false },
      { name: "Strange Pillbox", description: "Contains unmarked white tablets.", isSupernatural: false },
      { name: "Crying Portrait", description: "The painting seems to be shedding tears.", isSupernatural: true }
    ],
    bathroom: [
      { name: "Bloody Towel", description: "Hastily stuffed behind the toilet.", isSupernatural: false },
      { name: "Scratched Mirror", description: "The words 'I KNOW' are scratched into the glass.", isSupernatural: false }
    ],
    conservatory: [
      { name: "Poisonous Plant", description: "A rare, toxic flower has been recently harvested.", isSupernatural: false },
      { name: "Footprints in Dirt", description: "Leading towards the window.", isSupernatural: false }
    ],
    room_2: [
      { name: "Broken Cue Stick", description: "Snapped in half, possibly used as a weapon.", isSupernatural: false },
      { name: "Chalk Dust", description: "A trail of chalk dust leads to the door.", isSupernatural: false }
    ],
    observatory: [
      { name: "Smashed Lens", description: "The main telescope lens has been shattered.", isSupernatural: false },
      { name: "Star Chart", description: "Strange calculations predicting a death tonight.", isSupernatural: true }
    ],
    room_3: [
      { name: "Packed Suitcase", description: "Someone was planning to leave abruptly.", isSupernatural: false },
      { name: "Hidden Gun", description: "A revolver with one bullet missing found under the pillow.", isSupernatural: false }
    ]
  };

  return cluesByRoom[roomId] || [];
}
