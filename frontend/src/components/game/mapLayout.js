// Centralized map layout definition for RoomExploration2D
// Map dimensions: 2400 x 4000

export const MAP_WIDTH = 2400;
export const MAP_HEIGHT = 4000;

export const WALL_THICKNESS = 40;
export const DOOR_SIZE = 100;

// Hardcoded map geometry to create a connected mansion layout
export const LAYOUT = {
  rooms: {
    hallway: {
      id: 'hallway',
      x: 1000, y: 200, width: 400, height: 3600,
      texture: 'stone_floor.png'
    },
    garage: {
      id: 'garage',
      x: 200, y: 200, width: 800, height: 600,
      texture: 'stone_floor.png'
    },
    basement: {
      id: 'basement',
      x: 1400, y: 200, width: 800, height: 600,
      texture: 'stone_floor.png'
    },
    library: {
      id: 'library',
      x: 200, y: 800, width: 800, height: 600,
      texture: 'wood_floor.png'
    },
    kitchen: {
      id: 'kitchen',
      x: 1400, y: 800, width: 800, height: 600,
      texture: 'stone_floor.png'
    },
    study: {
      id: 'study',
      x: 200, y: 1400, width: 800, height: 600,
      texture: 'wood_floor.png'
    },
    dining_room: {
      id: 'dining_room',
      x: 1400, y: 1400, width: 800, height: 600,
      texture: 'wood_floor.png'
    },
    room_1: {
      id: 'room_1',
      x: 200, y: 2000, width: 800, height: 600,
      texture: 'wood_floor.png'
    },
    bathroom: {
      id: 'bathroom',
      x: 1400, y: 2000, width: 800, height: 600,
      texture: 'stone_floor.png'
    },
    conservatory: {
      id: 'conservatory',
      x: 200, y: 2600, width: 800, height: 600,
      texture: 'stone_floor.png'
    },
    room_2: {
      id: 'room_2',
      x: 1400, y: 2600, width: 800, height: 600,
      texture: 'wood_floor.png'
    },
    observatory: {
      id: 'observatory',
      x: 200, y: 3200, width: 800, height: 600,
      texture: 'wood_floor.png'
    },
    room_3: {
      id: 'room_3',
      x: 1400, y: 3200, width: 800, height: 600,
      texture: 'wood_floor.png'
    }
  },
  
  // Doors are gaps in the walls where players can walk
  doors: [
    // Left side rooms
    { x: 1000 - WALL_THICKNESS/2, y: 500, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Garage
    { x: 1000 - WALL_THICKNESS/2, y: 1100, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Library
    { x: 1000 - WALL_THICKNESS/2, y: 1700, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Study
    { x: 1000 - WALL_THICKNESS/2, y: 2300, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Room 1
    { x: 1000 - WALL_THICKNESS/2, y: 2900, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Conservatory
    { x: 1000 - WALL_THICKNESS/2, y: 3500, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Observatory

    // Right side rooms
    { x: 1400 - WALL_THICKNESS/2, y: 500, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Basement
    { x: 1400 - WALL_THICKNESS/2, y: 1100, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Kitchen
    { x: 1400 - WALL_THICKNESS/2, y: 1700, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Dining
    { x: 1400 - WALL_THICKNESS/2, y: 2300, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Bathroom
    { x: 1400 - WALL_THICKNESS/2, y: 2900, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }, // Room 2
    { x: 1400 - WALL_THICKNESS/2, y: 3500, width: WALL_THICKNESS, height: DOOR_SIZE, horizontal: false }  // Room 3
  ],

  // Furniture acts as solid collision blocks within rooms
  furniture: [
    // Library Bookshelves
    { id: 'lib_shelf1', x: 220, y: 820, width: 600, height: 80, image: 'furniture_bookshelf.png', label: 'Bookshelf' },
    { id: 'lib_shelf2', x: 220, y: 1000, width: 400, height: 80, image: 'furniture_bookshelf.png', label: 'Bookshelf' },
    // Study Desk
    { id: 'study_desk', x: 400, y: 1600, width: 250, height: 120, image: 'furniture_desk.png', label: 'Mahogany Desk' },
    // Kitchen Stove & Counters
    { id: 'kit_stove', x: 2000, y: 820, width: 180, height: 100, image: 'furniture_stove.png', label: 'Iron Stove' },
    { id: 'kit_counter', x: 1500, y: 820, width: 400, height: 100, image: 'furniture_counter.png', label: 'Prep Counter' },
    // Dining Table
    { id: 'din_table', x: 1600, y: 1600, width: 400, height: 200, image: 'furniture_dining_table.png', label: 'Long Dining Table' }
  ],

  // Decorations are non-collidable images placed within rooms to add visual identity
  decorations: [
    // Hallway runner rug (spans multiple sections)
    { id: 'hallway_rug1', roomId: 'hallway', x: 1050, y: 300, width: 300, height: 500, image: 'hallway_decor.png' },
    { id: 'hallway_rug2', roomId: 'hallway', x: 1050, y: 1200, width: 300, height: 500, image: 'hallway_decor.png' },
    { id: 'hallway_rug3', roomId: 'hallway', x: 1050, y: 2100, width: 300, height: 500, image: 'hallway_decor.png' },
    { id: 'hallway_rug4', roomId: 'hallway', x: 1050, y: 3000, width: 300, height: 500, image: 'hallway_decor.png' },
    // Garage workbench
    { id: 'garage_tools', roomId: 'garage', x: 300, y: 300, width: 400, height: 300, image: 'garage_decor.png' },
    // Basement barrels
    { id: 'basement_barrels', roomId: 'basement', x: 1550, y: 300, width: 400, height: 300, image: 'basement_decor.png' },
    // Conservatory plants
    { id: 'conservatory_plants', roomId: 'conservatory', x: 300, y: 2750, width: 400, height: 300, image: 'conservatory_decor.png' },
    // Observatory telescope
    { id: 'observatory_telescope', roomId: 'observatory', x: 400, y: 3350, width: 350, height: 300, image: 'observatory_decor.png' },
    // Room 1 (bedroom bg as decor)
    { id: 'bedroom_bed', roomId: 'room_1', x: 350, y: 2100, width: 400, height: 350, image: 'bedroom_bg.png' },
    // Bathroom (reuse existing bathroom bg as decor)
    { id: 'bathroom_fixtures', roomId: 'bathroom', x: 1550, y: 2100, width: 400, height: 350, image: 'bathroom_bg.png' },
    // Room 2 (billiard room -> use dining bg for now)
    { id: 'billiard_table', roomId: 'room_2', x: 1550, y: 2750, width: 400, height: 300, image: 'dining_bg.png' },
    // Room 3 (master bedroom bg as decor)
    { id: 'master_bed', roomId: 'room_3', x: 1550, y: 3350, width: 400, height: 350, image: 'bedroom_bg.png' }
  ]
};

// Generate walls based on the room dimensions, subtracting doors
export function generateWalls() {
  const walls = [];

  const addWallSegment = (x, y, w, h) => {
    walls.push({ x, y, width: w, height: h });
  };

  const R = LAYOUT.rooms;
  const T = WALL_THICKNESS / 2;

  // Exterior walls for the whole building
  addWallSegment(200 - T, 200 - T, 2000 + T*2, WALL_THICKNESS); // Top wall
  addWallSegment(200 - T, 3800 - T, 2000 + T*2, WALL_THICKNESS); // Bottom wall
  addWallSegment(200 - T, 200 - T, WALL_THICKNESS, 3600 + T*2); // Left wall
  addWallSegment(2200 - T, 200 - T, WALL_THICKNESS, 3600 + T*2); // Right wall

  // Horizontal room dividers
  const dividersY = [800, 1400, 2000, 2600, 3200];
  dividersY.forEach(y => {
    addWallSegment(200, y - T, 800, WALL_THICKNESS); // Left divider
    addWallSegment(1400, y - T, 800, WALL_THICKNESS); // Right divider
  });

  // Hallway left wall (punched with doors)
  addWallSegment(1000 - T, 200, WALL_THICKNESS, 300); 
  addWallSegment(1000 - T, 600, WALL_THICKNESS, 500); 
  addWallSegment(1000 - T, 1200, WALL_THICKNESS, 500); 
  addWallSegment(1000 - T, 1800, WALL_THICKNESS, 500); 
  addWallSegment(1000 - T, 2400, WALL_THICKNESS, 500); 
  addWallSegment(1000 - T, 3000, WALL_THICKNESS, 500); 
  addWallSegment(1000 - T, 3600, WALL_THICKNESS, 200); 

  // Hallway right wall (punched with doors)
  addWallSegment(1400 - T, 200, WALL_THICKNESS, 300); 
  addWallSegment(1400 - T, 600, WALL_THICKNESS, 500); 
  addWallSegment(1400 - T, 1200, WALL_THICKNESS, 500); 
  addWallSegment(1400 - T, 1800, WALL_THICKNESS, 500); 
  addWallSegment(1400 - T, 2400, WALL_THICKNESS, 500); 
  addWallSegment(1400 - T, 3000, WALL_THICKNESS, 500); 
  addWallSegment(1400 - T, 3600, WALL_THICKNESS, 200); 

  return walls;
}
