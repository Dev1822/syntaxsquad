export async function generateMysteryData(players) {
  const playerCount = players.length;
  
  const prompt = `You are a master mystery writer generating a structured murder mystery game.
Generate a complete mystery in JSON format.

REQUIREMENTS:
- There must be EXACTLY ${playerCount} suspects (these correspond to the players).
- The murderer must be chosen randomly among the suspects (it must make narrative sense).
- HORROR TWIST: Weave in a supernatural red herring (e.g., rumors of a ghost, cursed manor). Clues may initially point toward paranormal activity, but the true solution MUST be logical (human-committed). The horror comes from atmosphere and misdirection.

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
      return JSON.parse(data.response);
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
    murderer: "Guest 1",
    motive: "Money.",
    method: "Poison.",
    opportunity: "Was alone with the victim's drink.",
    hiddenEvents: [{ trigger: "Investigate study", eventDescription: "A painting falls off the wall." }]
  };
}
