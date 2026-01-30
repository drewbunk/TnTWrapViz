export const VEHICLE_TYPES = [
  'Sports Car', 'Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Supercar', 'Coupe', 'Hatchback'
];

export const MANUFACTURERS = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Buick', 'Cadillac', 
  'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 
  'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati', 
  'Mazda', 'McLaren', 'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Pagani', 'Porsche', 'Ram', 
  'Rolls-Royce', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

export const MODELS_BY_MANUFACTURER: Record<string, string[]> = {
  'Acura': ['NSX', 'Integra', 'TLX', 'MDX', 'RDX'],
  'Audi': ['R8', 'RS6', 'RS7', 'e-tron GT', 'Q8', 'A4', 'A5'],
  'BMW': ['M2', 'M3', 'M4', 'M5', 'M8', 'i8', 'X5 M', 'X7', 'Z4'],
  'Cadillac': ['CT5-V Blackwing', 'Escalade', 'LYRIQ', 'CTS-V'],
  'Chevrolet': ['Corvette Z06', 'Corvette C8', 'Camaro', 'Silverado', 'Tahoe', 'Suburban'],
  'Dodge': ['Challenger SRT', 'Charger SRT', 'Durango Hellcat', 'Viper'],
  'Ferrari': ['SF90', 'F8 Tributo', '296 GTB', '812 Superfast', '488 Pista', 'Roma'],
  'Ford': ['Mustang Dark Horse', 'Mustang GT', 'F-150 Raptor', 'Bronco', 'GT', 'Explorer'],
  'GMC': ['Hummer EV Pickup', 'Hummer EV SUV', 'Sierra 1500', 'Yukon Denali', 'Canyon'],
  'Honda': ['Civic Type R', 'NSX', 'Accord', 'CR-V'],
  'Hyundai': ['Ioniq 5 N', 'Ioniq 6', 'Elantra N', 'Palisade'],
  'Jeep': ['Wrangler Rubicon', 'Grand Cherokee Trackhawk', 'Gladiator'],
  'Lamborghini': ['Revuelto', 'Aventador', 'Huracan', 'Urus', 'Countach'],
  'Land Rover': ['Defender', 'Range Rover Sport', 'Range Rover Velar'],
  'Lexus': ['LC 500', 'LFA', 'IS 500', 'RX', 'LX 600'],
  'McLaren': ['750S', '720S', 'Artura', 'P1', 'Senna', 'GT'],
  'Mercedes-Benz': ['AMG GT', 'G-Wagon (G63)', 'SL 63', 'S-Class', 'EQS', 'C63 AMG'],
  'Nissan': ['GT-R (R35)', 'Z', '370Z', 'Titan', 'Altima'],
  'Porsche': ['911 Turbo S', '911 GT3 RS', 'Taycan', '718 Cayman', 'Panamera', 'Cayenne'],
  'Ram': ['1500 TRX', '2500 Power Wagon'],
  'Subaru': ['WRX STI', 'BRZ', 'Outback'],
  'Tesla': ['Model S Plaid', 'Model X', 'Model 3 Performance', 'Model Y', 'Cybertruck'],
  'Toyota': ['GR Supra', 'GR Corolla', 'Tacoma TRD Pro', 'Tundra', 'Land Cruiser'],
  'Volkswagen': ['Golf R', 'GTI', 'ID.4', 'Tiguan']
};

export const DESIGN_STYLES = [
  'Solid Color (Plain Wrap)',
  'Modern Minimalist',
  'Aggressive Racing',
  'Elegant Luxury',
  'Bold Geometric',
  'Organic Flowing',
  'Retro Classic',
  'Futuristic Tech',
  'Graffiti Street Art',
  'Camouflage',
  'Chrome & Metallic',
  'Matte Carbon Fiber'
];

export const DESIGN_THEMES = [
  'Racing/Performance', 'Luxury/Premium', 'Military/Tactical', 'Nature/Organic',
  'Cyberpunk/Futuristic', 'Retro/Vintage', 'Abstract Art', 'Brand/Logo',
  'Camouflage', 'Flames/Fire', 'Geometric Patterns', 'Custom Theme'
];

export interface ThreeMColor {
  name: string;
  code: string;
  hex: string;
  category: 'Gloss' | 'Satin' | 'Matte' | 'Color Flip' | 'Texture' | 'Chrome';
}

export const COLORS_3M_DB: ThreeMColor[] = [
  // GLOSS
  { name: 'White', code: 'G10', hex: '#FFFFFF', category: 'Gloss' },
  { name: 'Red Metallic', code: 'G203', hex: '#B22222', category: 'Gloss' },
  { name: 'Dragon Fire Red', code: 'G363', hex: '#D21F3C', category: 'Gloss' },
  { name: 'Hot Rod Red', code: 'G13', hex: '#E60000', category: 'Gloss' },
  { name: 'Liquid Copper', code: 'G344', hex: '#B87333', category: 'Gloss' },
  { name: 'Fiery Orange', code: 'G364', hex: '#FF4500', category: 'Gloss' },
  { name: 'Sunflower', code: 'G25', hex: '#FFDA29', category: 'Gloss' },
  { name: 'Green Envy', code: 'G336', hex: '#006B3C', category: 'Gloss' },
  { name: 'Atomic Teal', code: 'G356', hex: '#008080', category: 'Gloss' },
  { name: 'Sky Blue', code: 'G77', hex: '#87CEEB', category: 'Gloss' },
  { name: 'Cosmic Blue', code: 'G377', hex: '#1E315A', category: 'Gloss' },
  { name: 'Deep Blue Metallic', code: 'G217', hex: '#002366', category: 'Gloss' },
  { name: 'Blue Raspberry', code: 'G378', hex: '#007FFF', category: 'Gloss' },
  { name: 'Black Metallic', code: 'G212', hex: '#0C0C0C', category: 'Gloss' },
  { name: 'Black', code: 'G12', hex: '#000000', category: 'Gloss' },
  { name: 'Anthracite', code: 'G201', hex: '#383E42', category: 'Gloss' },
  
  // SATIN
  { name: 'Vampire Red', code: 'SP273', hex: '#4A0404', category: 'Satin' },
  { name: 'Smoldering Red', code: 'S363', hex: '#8B0000', category: 'Satin' },
  { name: 'Canyon Copper', code: 'S344', hex: '#A0522D', category: 'Satin' },
  { name: 'Key West', code: 'S57', hex: '#40E0D0', category: 'Satin' },
  { name: 'Perfect Blue', code: 'S347', hex: '#0047AB', category: 'Satin' },
  { name: 'Ocean Shimmer', code: 'S327', hex: '#1B4D3E', category: 'Satin' },
  { name: 'Thundercloud', code: 'S271', hex: '#4B5320', category: 'Satin' },
  { name: 'Battleship Gray', code: 'S51', hex: '#848482', category: 'Satin' },
  { name: 'Dark Gray', code: 'S261', hex: '#2F4F4F', category: 'Satin' },
  { name: 'Black', code: 'S12', hex: '#1A1A1A', category: 'Satin' },
  
  // MATTE
  { name: 'Matte Slate Blue Metallic', code: 'M217', hex: '#2C3E50', category: 'Matte' },
  { name: 'Matte Riviera Blue', code: 'M67', hex: '#1E90FF', category: 'Matte' },
  { name: 'Matte Deep Black', code: 'M22', hex: '#050505', category: 'Matte' },
  { name: 'Matte Pine Green Metallic', code: 'M206', hex: '#013220', category: 'Matte' },
  { name: 'Matte Military Green', code: 'M26', hex: '#4B5320', category: 'Matte' },
  { name: 'Matte Dark Gray', code: 'M261', hex: '#36454F', category: 'Matte' },
  { name: 'Matte Silver', code: 'M21', hex: '#C0C0C0', category: 'Matte' },
  
  // COLOR FLIPS
  { name: 'Gloss Flip Psychedelic', code: 'GP281', hex: 'linear-gradient(45deg, #ff00ff, #00ffff, #ffff00)', category: 'Color Flip' },
  { name: 'Satin Flip Glacial Frost', code: 'SP277', hex: 'linear-gradient(45deg, #e0ffff, #b0c4de, #f0f8ff)', category: 'Color Flip' },
  { name: 'Gloss Flip Deep Space', code: 'GP278', hex: 'linear-gradient(45deg, #00008b, #4b0082, #000000)', category: 'Color Flip' },
  { name: 'Gloss Flip Electric Wave', code: 'GP287', hex: 'linear-gradient(45deg, #0000ff, #00ced1, #1e90ff)', category: 'Color Flip' },
  { name: 'Satin Flip Volcanic Flare', code: 'SP236', hex: 'linear-gradient(45deg, #ff4500, #8b0000, #ffa500)', category: 'Color Flip' },
  
  // TEXTURES
  { name: 'Carbon Fiber Black', code: 'CFS12', hex: '#111111', category: 'Texture' },
  { name: 'Brushed Black Metallic', code: 'BR212', hex: '#222222', category: 'Texture' },
  { name: 'Brushed Aluminum', code: 'BR120', hex: '#D3D3D3', category: 'Texture' },
  { name: 'Shadow Black', code: 'SB12', hex: '#000000', category: 'Texture' },
  
  // CHROME
  { name: 'Gloss Silver Chrome', code: 'GC451', hex: '#E5E4E2', category: 'Chrome' }
];

export const WATERMARK_TEXT = "TREAD & TORQUE";
export const FREE_LIMIT = 5;