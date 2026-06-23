import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { Car, Profile, Message, DbState } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// Ensure directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Set up local file storage database paths
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initialize Supabase Client if configured
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const isSupabaseActive = !!(supabaseUrl && supabaseKey);
const supabase = isSupabaseActive ? createClient(supabaseUrl, supabaseKey) : null;

console.log(`Database Connection Status: ${isSupabaseActive ? 'Supabase (Active)' : 'Local Fallback (Active)'}`);

// Seed initial data for local database
const defaultProfiles: Profile[] = [
  {
    id: 'admin-id-1',
    full_name: 'KSA Classic Admin',
    role: 'super_admin',
    email: 'helpooclassmate@gmail.com',
    created_at: new Date('2026-01-01').toISOString()
  },
  {
    id: 'subadmin-id-1',
    full_name: 'KSA Sub Admin',
    role: 'sub_admin',
    email: 'subadmin@ksaclassic.com',
    created_at: new Date('2026-02-01').toISOString()
  }
];

const defaultCars: Car[] = [
  {
    id: 'car-id-1',
    title: '1967 Chevrolet Corvette Stingray',
    make: 'Chevrolet',
    model: 'Corvette Stingray',
    year: 1967,
    price: 129000,
    mileage: 45000,
    location: 'Vancouver, BC',
    description: 'Stunning numbers-matching 1967 Stingray in Tuxedo Black. Features a 427/435hp V8 engine with a 4-speed manual transmission. Fully restored to absolute concours standards. A true classic collector\'s dream.',
    condition: 'new_arrival',
    type: 'classic',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'],
    contact_phone: '+1 604-555-0199',
    created_at: new Date().toISOString()
  },
  {
    id: 'car-id-2',
    title: '1973 Porsche 911 Carrera RS',
    make: 'Porsche',
    model: '911 Carrera RS',
    year: 1973,
    price: 345000,
    mileage: 82000,
    location: 'Vancouver, BC',
    description: 'An legendary lightweight masterpiece. Finished in Grand Prix White with Viper Green lettering. Matching numbers 2.7L flat-six engine. Meticulously maintained with full historical documentation.',
    condition: 'available',
    type: 'classic',
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200'],
    contact_phone: '+1 604-555-0199',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'car-id-3',
    title: '1965 Shelby Cobra 427 S/C',
    make: 'Shelby',
    model: 'Cobra 427 S/C',
    year: 1965,
    price: 185000,
    mileage: 12000,
    location: 'Vancouver, BC',
    description: 'Exquisite Shelby Cobra finished in iconic Guardsman Blue with Wimbledon White stripes. Powered by a thunderous 427ci V8 engine. Side pipes, chrome roll bar, and pristine leather interior. Fast, loud, and breathtaking.',
    condition: 'available',
    type: 'classic',
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200'],
    contact_phone: '+1 604-555-0199',
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'car-id-4',
    title: '1969 Ford Mustang Boss 429',
    make: 'Ford',
    model: 'Mustang Boss 429',
    year: 1969,
    price: 260000,
    mileage: 31000,
    location: 'Vancouver, BC',
    description: 'Ultra-rare, highly coveted Boss 429. Finished in Royal Maroon. Fully documented history, numbers-matching powertrain. This vehicle represents the absolute pinnacle of the classic American muscle era.',
    condition: 'sold',
    type: 'classic',
    images: ['https://images.unsplash.com/photo-1612466285769-ac9380c5780d?auto=format&fit=crop&q=80&w=1200'],
    contact_phone: '+1 604-555-0199',
    created_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 'car-id-5',
    title: '1971 Datsun 240Z Series I',
    make: 'Datsun',
    model: '240Z',
    year: 1971,
    price: 18500,
    mileage: 142000,
    location: 'Vancouver, BC',
    description: 'Exceptional Series I 240Z project candidate. Sourced from dry indoor storage. Minimal surface rust, complete matching-numbers L24 engine, and 4-speed manual gearbox. Perfect for a highly rewarding ground-up restoration or a custom performance restomod project.',
    condition: 'available',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200'],
    contact_phone: '+1 604-555-0199',
    created_at: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: 'car-id-6',
    title: '1968 Dodge Charger R/T 440',
    make: 'Dodge',
    model: 'Charger R/T',
    year: 1968,
    price: 34000,
    mileage: 115000,
    location: 'Vancouver, BC',
    description: 'Ultimate muscle project! Authentic 1968 Dodge Charger R/T project. Includes a period-correct 440 Big Block V8 (currently disassembled for machining) and 727 Torqueflite automatic transmission. Highly solid floor and frame rails, needs rear quarter panel work.',
    condition: 'new_arrival',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1200'],
    contact_phone: '+1 604-555-0199',
    created_at: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: 'car-id-7',
    title: '1979 Volkswagen Beetle Convertible',
    make: 'Volkswagen',
    model: 'Beetle Convertible',
    year: 1979,
    price: 6800,
    mileage: 180000,
    location: 'Vancouver, BC',
    description: 'A delightful, highly original classic Super Beetle convertible project. Runs and drives smoothly but requires a fresh coat of paint, new soft-top vinyl, and moderate interior upholstery work. Great entry-level vintage restoration project.',
    condition: 'available',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200'],
    contact_phone: '+1 604-555-0199',
    created_at: new Date(Date.now() - 518400000).toISOString()
  }
];

const defaultMessages: Message[] = [
  {
    id: 'msg-id-1',
    car_id: 'car-id-1',
    buyer_name: 'John Doe',
    buyer_email: 'john.doe@example.com',
    buyer_phone: '604-555-9011',
    message: 'Hi, is this 1967 Corvette still available? I would like to schedule a private viewing this Saturday. I have my financing pre-arranged.',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'msg-id-2',
    car_id: 'car-id-3',
    buyer_name: 'Sarah Jenkins',
    buyer_email: 'sjenkins@example.com',
    buyer_phone: '778-555-4321',
    message: 'Absolutely gorgeous Shelby Cobra. Is the price firm, and can you provide the engine build details and restoration documentation? Thank you.',
    is_read: true,
    created_at: new Date(Date.now() - 7200000 * 2).toISOString()
  },
  {
    id: 'msg-mock-reply-test',
    car_id: 'car-id-1',
    buyer_name: 'Marcus Brody',
    buyer_email: 'mbrody@classicmuseum.org',
    buyer_phone: '236-555-1200',
    message: 'Hello, I am interested in negotiating a deal for the 1967 Corvette. We would love to feature this in our heritage display collection. Let me know if we can set up a custom viewing.',
    is_read: false,
    created_at: new Date().toISOString(),
    replies: [
      {
        id: 'rep-initial-mock',
        sender_name: 'System Auto-Response',
        sender_email: 'no-reply@ksaclassic.com',
        message: 'Thank you for your interest in KSA Classics. Our curators are reviewing your inquiry.',
        created_at: new Date(Date.now() - 1800000).toISOString()
      }
    ]
  }
];

function getLocalDb(): DbState {
  if (!fs.existsSync(DB_FILE)) {
    const initialState: DbState = {
      cars: defaultCars,
      profiles: defaultProfiles,
      messages: defaultMessages
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2));
    return initialState;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Check if the old db doesn't have the newly added project cars, and merge them
    const hasProjectCars = parsed.cars.some((c: any) => c.type === 'project');
    if (!hasProjectCars || parsed.cars.length < defaultCars.length) {
      const mergedCars = [...parsed.cars];
      defaultCars.forEach((dc) => {
        const exists = mergedCars.some((mc: any) => mc.id === dc.id);
        if (!exists) {
          mergedCars.push(dc);
        }
      });
      parsed.cars = mergedCars;
    }

    // Backfill 'type' if missing
    parsed.cars = parsed.cars.map((car: any) => {
      if (!car.type) {
        const match = defaultCars.find(dc => dc.id === car.id);
        car.type = match?.type || (car.title.toLowerCase().includes('project') ? 'project' : 'classic');
      }
      return car;
    });

    // Backfill mockup inquiry for testing reply feature
    if (!parsed.messages) {
      parsed.messages = [];
    }
    const mockReplyId = 'msg-mock-reply-test';
    if (!parsed.messages.some((m: any) => m.id === mockReplyId)) {
      parsed.messages.push({
        id: mockReplyId,
        car_id: 'car-id-1',
        buyer_name: 'Marcus Brody',
        buyer_email: 'mbrody@classicmuseum.org',
        buyer_phone: '236-555-1200',
        message: 'Hello, I am interested in negotiating a deal for the 1967 Corvette. We would love to feature this in our heritage display collection. Let me know if we can set up a custom viewing.',
        is_read: false,
        created_at: new Date().toISOString(),
        replies: [
          {
            id: 'rep-initial-mock',
            sender_name: 'System Auto-Response',
            sender_email: 'no-reply@ksaclassic.com',
            message: 'Thank you for your interest in KSA Classics. Our curators are reviewing your inquiry.',
            created_at: new Date(Date.now() - 1800000).toISOString()
          }
        ]
      });
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2));
    return parsed;
  } catch (err) {
    console.error('Error reading local DB, resetting to defaults:', err);
    const initialState: DbState = {
      cars: defaultCars,
      profiles: defaultProfiles,
      messages: defaultMessages
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2));
    return initialState;
  }
}

function saveLocalDb(state: DbState) {
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
}

// Multer Local File Upload Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'car-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Helper to get authenticated user profile
const getAuthUser = (req: any): Profile | null => {
  const sessionToken = req.cookies.ksa_session;
  if (!sessionToken) return null;
  const db = getLocalDb();
  return db.profiles.find(p => p.id === sessionToken) || null;
};

// ================= API ENDPOINTS =================

// Connection Status Endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    status: isSupabaseActive ? 'supabase' : 'local_fallback',
    message: isSupabaseActive 
      ? 'Connected to your active Supabase backend.' 
      : 'Using premium local storage fallback (Supabase credentials not configured in .env).'
  });
});

// GET /api/cars (Public)
app.get('/api/cars', async (req, res) => {
  try {
    if (isSupabaseActive && supabase) {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return res.json(data);
      }
      console.warn('Supabase fetch failed, falling back to local database:', error);
    }
    const db = getLocalDb();
    const sortedCars = [...db.cars].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(sortedCars);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cars/:id (Public)
app.get('/api/cars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isSupabaseActive && supabase) {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        return res.json(data);
      }
    }
    const db = getLocalDb();
    const car = db.cars.find(c => c.id === id);
    if (!car) {
      return res.status(404).json({ error: 'Car listing not found' });
    }
    res.json(car);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cars (Admin only)
app.post('/api/cars', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized access. Please log in.' });
  }

  const { title, make, model, year, price, mileage, location, description, condition, type, images, contact_phone } = req.body;

  if (!title || !make || !model || !year || !price || !mileage) {
    return res.status(400).json({ error: 'Required fields: Title, Make, Model, Year, Price, Mileage' });
  }

  const newCar: Car = {
    id: 'car-' + Date.now() + '-' + Math.round(Math.random() * 1000),
    title,
    make,
    model,
    year: Number(year),
    price: Number(price),
    mileage: Number(mileage),
    location: location || 'Vancouver, BC',
    description: description || '',
    condition: condition || 'available',
    type: type || 'classic',
    images: images || [],
    contact_phone: contact_phone || '',
    created_at: new Date().toISOString(),
    created_by: admin.id
  };

  try {
    if (isSupabaseActive && supabase) {
      const { data, error } = await supabase
        .from('cars')
        .insert([{
          title: newCar.title,
          make: newCar.make,
          model: newCar.model,
          year: newCar.year,
          price: newCar.price,
          mileage: newCar.mileage,
          location: newCar.location,
          description: newCar.description,
          condition: newCar.condition,
          type: newCar.type,
          images: newCar.images,
          contact_phone: newCar.contact_phone,
          created_by: admin.id
        }])
        .select()
        .single();
      if (!error && data) {
        return res.status(201).json(data);
      }
      console.warn('Supabase insert failed, inserting locally:', error);
    }

    const db = getLocalDb();
    db.cars.push(newCar);
    saveLocalDb(db);
    res.status(201).json(newCar);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/cars/:id (Admin only)
app.put('/api/cars/:id', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  const { id } = req.params;
  const updates = req.body;

  try {
    if (isSupabaseActive && supabase) {
      const { data, error } = await supabase
        .from('cars')
        .update({
          title: updates.title,
          make: updates.make,
          model: updates.model,
          year: Number(updates.year),
          price: Number(updates.price),
          mileage: Number(updates.mileage),
          location: updates.location,
          description: updates.description,
          condition: updates.condition,
          type: updates.type,
          images: updates.images,
          contact_phone: updates.contact_phone
        })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return res.json(data);
      }
      console.warn('Supabase update failed, updating locally:', error);
    }

    const db = getLocalDb();
    const index = db.cars.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Car listing not found' });
    }

    db.cars[index] = {
      ...db.cars[index],
      ...updates,
      year: updates.year ? Number(updates.year) : db.cars[index].year,
      price: updates.price ? Number(updates.price) : db.cars[index].price,
      mileage: updates.mileage ? Number(updates.mileage) : db.cars[index].mileage,
    };

    saveLocalDb(db);
    res.json(db.cars[index]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cars/:id (Admin only)
app.delete('/api/cars/:id', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  const { id } = req.params;

  try {
    if (isSupabaseActive && supabase) {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
      if (!error) {
        // Also delete cascade local messages if they exist
        const db = getLocalDb();
        db.messages = db.messages.filter(m => m.car_id !== id);
        db.cars = db.cars.filter(c => c.id !== id);
        saveLocalDb(db);
        return res.json({ success: true });
      }
      console.warn('Supabase delete failed, deleting locally:', error);
    }

    const db = getLocalDb();
    const initialLength = db.cars.length;
    db.cars = db.cars.filter(c => c.id !== id);
    db.messages = db.messages.filter(m => m.car_id !== id);

    if (db.cars.length === initialLength) {
      return res.status(404).json({ error: 'Car listing not found' });
    }

    saveLocalDb(db);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/messages (Public - Send Message)
app.post('/api/messages', async (req, res) => {
  const { car_id, buyer_name, buyer_email, buyer_phone, message } = req.body;

  if (!car_id || !buyer_name || !message) {
    return res.status(400).json({ error: 'Required fields: car_id, buyer_name, message' });
  }

  const newMessage: Message = {
    id: 'msg-' + Date.now() + '-' + Math.round(Math.random() * 1000),
    car_id,
    buyer_name,
    buyer_email: buyer_email || '',
    buyer_phone: buyer_phone || '',
    message,
    is_read: false,
    created_at: new Date().toISOString()
  };

  try {
    if (isSupabaseActive && supabase) {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          car_id: newMessage.car_id,
          buyer_name: newMessage.buyer_name,
          buyer_email: newMessage.buyer_email,
          buyer_phone: newMessage.buyer_phone,
          message: newMessage.message,
          is_read: false
        }])
        .select()
        .single();
      if (!error && data) {
        return res.status(201).json(data);
      }
      console.warn('Supabase message insert failed, inserting locally:', error);
    }

    const db = getLocalDb();
    db.messages.push(newMessage);
    saveLocalDb(db);
    res.status(201).json(newMessage);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/messages (Admin only)
app.get('/api/messages', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  try {
    const db = getLocalDb();

    if (isSupabaseActive && supabase) {
      const { data: messagesData, error: mError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: carsData, error: cError } = await supabase
        .from('cars')
        .select('id, title');

      if (!mError && messagesData) {
        const carMap = new Map((carsData || []).map((c: any) => [c.id, c.title]));

        // Check if mock message is already present, if not, append/unshift it
        const hasMock = messagesData.some((m: any) => m.id === 'msg-mock-reply-test');
        if (!hasMock) {
          const mockMsg = db.messages.find(m => m.id === 'msg-mock-reply-test');
          if (mockMsg) {
            messagesData.unshift(mockMsg);
          }
        }

        const hydrated = messagesData.map((m: any) => {
          const localMsg = db.messages.find(lm => lm.id === m.id);
          const replies = m.replies || localMsg?.replies || [];
          return {
            ...m,
            replies,
            car_title: carMap.get(m.car_id) || 'Unknown Car'
          };
        });
        return res.json(hydrated);
      }
      console.warn('Supabase messages fetch failed, falling back to local database:', mError);
    }

    const hydratedMessages = db.messages.map(m => {
      const car = db.cars.find(c => c.id === m.car_id);
      return {
        ...m,
        car_title: car ? car.title : 'Unknown Car'
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json(hydratedMessages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/messages/mock (Admin only)
app.post('/api/messages/mock', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  const mockMessages = [
    {
      id: 'msg-mock-' + Date.now() + '-1',
      car_id: 'car-id-1',
      buyer_name: 'Arthur Pendelton',
      buyer_email: 'arthur.p@heritagecars.org',
      buyer_phone: '604-555-8291',
      message: 'Hello, I am inquiring on behalf of the Heritage Museum regarding the 1967 Chevrolet Corvette Stingray. Is the vehicle fully matching-numbers, and can we arrange an inspection?',
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'msg-mock-' + Date.now() + '-2',
      car_id: 'car-id-3',
      buyer_name: 'Eleanor Vance',
      buyer_email: 'eleanor.v@classicdrive.com',
      buyer_phone: '778-555-0129',
      message: 'Absolutely gorgeous Shelby Cobra! Is the price firm, and can you provide detail on the transmission and engine build?',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  try {
    const db = getLocalDb();
    if (isSupabaseActive && supabase) {
      const inserts = mockMessages.map(m => ({
        car_id: m.car_id,
        buyer_name: m.buyer_name,
        buyer_email: m.buyer_email,
        buyer_phone: m.buyer_phone,
        message: m.message,
        is_read: m.is_read
      }));
      const { error } = await supabase
        .from('messages')
        .insert(inserts);
      if (error) {
        console.warn('Supabase mock insert failed, inserting locally:', error);
      }
    }

    db.messages.push(...mockMessages);
    saveLocalDb(db);

    res.status(201).json({ success: true, count: mockMessages.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/messages/:id/read (Admin only)
app.patch('/api/messages/:id/read', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  const { id } = req.params;
  const { is_read } = req.body;

  try {
    if (isSupabaseActive && supabase) {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return res.json(data);
      }
      console.warn('Supabase update message failed, updating locally:', error);
    }

    const db = getLocalDb();
    const message = db.messages.find(m => m.id === id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.is_read = is_read;
    saveLocalDb(db);
    res.json(message);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/messages/:id/reply (Admin only)
app.post('/api/messages/:id/reply', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin access only.' });
  }

  const { id } = req.params;
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Reply message is required.' });
  }

  try {
    const db = getLocalDb();
    let targetMsg = db.messages.find(m => m.id === id);

    // Hybrid fallback: If message isn't in local DB but exists on Supabase (or we are replying to one),
    // we build a local container for it in db.json to track the replies.
    if (!targetMsg) {
      targetMsg = {
        id,
        car_id: 'car-id-1',
        buyer_name: 'Inquirer',
        buyer_email: '',
        buyer_phone: '',
        message: '',
        is_read: true,
        created_at: new Date().toISOString(),
        replies: []
      };
      db.messages.push(targetMsg);
    }

    if (!targetMsg.replies) {
      targetMsg.replies = [];
    }

    const newReply = {
      id: 'rep-' + Date.now() + '-' + Math.round(Math.random() * 1000),
      sender_name: admin.full_name,
      sender_email: admin.email,
      message,
      created_at: new Date().toISOString()
    };

    targetMsg.replies.push(newReply);
    targetMsg.is_read = true; // Auto mark as read

    saveLocalDb(db);

    // If Supabase is active, try to fetch the hydrated parent message from Supabase to return it nicely
    if (isSupabaseActive && supabase) {
      try {
        const { data: sMsg } = await supabase
          .from('messages')
          .select('*')
          .eq('id', id)
          .single();
        if (sMsg) {
          return res.status(201).json({
            ...sMsg,
            replies: targetMsg.replies
          });
        }
      } catch (sErr) {
        console.warn('Could not fetch parent message from Supabase, returning local representation:', sErr);
      }
    }

    res.status(201).json(targetMsg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/messages/:id (Admin only)
app.delete('/api/messages/:id', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  const { id } = req.params;

  try {
    if (isSupabaseActive && supabase) {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      if (!error) {
        const db = getLocalDb();
        db.messages = db.messages.filter(m => m.id !== id);
        saveLocalDb(db);
        return res.json({ success: true });
      }
      console.warn('Supabase delete message failed, deleting locally:', error);
    }

    const db = getLocalDb();
    const initialLength = db.messages.length;
    db.messages = db.messages.filter(m => m.id !== id);

    if (db.messages.length === initialLength) {
      return res.status(404).json({ error: 'Message not found' });
    }

    saveLocalDb(db);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profiles (Admin / Super Admin only)
app.get('/api/profiles', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  try {
    if (isSupabaseActive && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (!error && data) {
        return res.json(data);
      }
    }
    const db = getLocalDb();
    res.json(db.profiles);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/profiles/invite (Super Admin Only)
app.post('/api/profiles/invite', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin || admin.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden. Super Admin access only.' });
  }

  const { email, full_name, passcode } = req.body;
  if (!email || !full_name) {
    return res.status(400).json({ error: 'Email and Full Name are required.' });
  }

  const newProfile: Profile = {
    id: 'subadmin-' + Date.now(),
    full_name,
    role: 'sub_admin',
    email,
    passcode: passcode || undefined,
    created_at: new Date().toISOString()
  };

  try {
    if (isSupabaseActive && supabase) {
      // In Supabase we could call inviteUserByEmail or create a row in profiles
      const { data, error } = await supabase
          .from('profiles')
          .insert([{
            id: newProfile.id,
            full_name: newProfile.full_name,
            role: 'sub_admin',
            email: newProfile.email,
            passcode: newProfile.passcode
          }])
          .select()
          .single();
      if (!error && data) {
        return res.status(201).json(data);
      }
      console.warn('Supabase profile creation failed, falling back to local:', error);
    }

    const db = getLocalDb();
    if (db.profiles.some(p => p.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    db.profiles.push(newProfile);
    saveLocalDb(db);
    res.status(201).json(newProfile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/profiles/:id (Super Admin Only)
app.delete('/api/profiles/:id', async (req, res) => {
  const admin = getAuthUser(req);
  if (!admin || admin.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden. Super Admin access only.' });
  }

  const { id } = req.params;

  // Cannot delete self or the main super_admin
  const db = getLocalDb();
  const target = db.profiles.find(p => p.id === id);
  if (target && target.email === 'helpooclassmate@gmail.com') {
    return res.status(400).json({ error: 'Super admin user cannot be deleted.' });
  }

  try {
    if (isSupabaseActive && supabase) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      if (!error) {
        db.profiles = db.profiles.filter(p => p.id !== id);
        saveLocalDb(db);
        return res.json({ success: true });
      }
      console.warn('Supabase profile deletion failed, deleting locally:', error);
    }

    const initialLength = db.profiles.length;
    db.profiles = db.profiles.filter(p => p.id !== id);

    if (db.profiles.length === initialLength) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    saveLocalDb(db);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // For local fallback, password 'admin123' works for any existing profile email
    // Or if Supabase is active, we can authenticate via Supabase Auth
    if (isSupabaseActive && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (!error && data.user) {
        // Authenticated successfully in Supabase!
        // Now query profiles
        const { data: profile, error: pError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!pError && profile) {
          res.cookie('ksa_session', profile.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
          });
          return res.json(profile);
        }
      }
      console.warn('Supabase authentication failed/unavailable, trying local fallback credentials...');
    }

    const db = getLocalDb();
    const profile = db.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

    if (!profile) {
      return res.status(401).json({ error: 'Invalid credentials. User profile not found.' });
    }

    // Check passcode. If profile has a custom passcode, verify against it.
    // Otherwise fallback to 'admin123'.
    const expectedPassword = profile.passcode || 'admin123';
    if (password !== expectedPassword) {
      return res.status(401).json({
        error: profile.passcode
          ? 'Invalid password. Please use the passcode assigned to your profile.'
          : 'Invalid password. Hint: Use admin123 to log in.'
      });
    }

    res.cookie('ksa_session', profile.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    });

    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  const profile = getAuthUser(req);
  if (!profile) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(profile);
});

// PUT /api/auth/profile
app.put('/api/auth/profile', async (req, res) => {
  const profile = getAuthUser(req);
  if (!profile) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { email, full_name, passcode } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const db = getLocalDb();
    const targetIdx = db.profiles.findIndex(p => p.id === profile.id);
    if (targetIdx === -1) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    // Update in local DB
    db.profiles[targetIdx].email = email;
    if (full_name) {
      db.profiles[targetIdx].full_name = full_name;
    }
    if (passcode) {
      db.profiles[targetIdx].passcode = passcode;
    }

    // Update if Supabase is active
    if (isSupabaseActive && supabase) {
      const updateData: any = { email };
      if (full_name) updateData.full_name = full_name;
      if (passcode) updateData.passcode = passcode;
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);
      if (error) {
        console.error('Supabase profile update failed:', error);
      }
    }

    saveLocalDb(db);
    res.json(db.profiles[targetIdx]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('ksa_session');
  res.json({ success: true });
});

// POST /api/upload (Supports multiple files up to 10)
app.post('/api/upload', upload.array('files', 10), async (req: any, res) => {
  const admin = getAuthUser(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized upload' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const urls = req.files.map((file: any) => {
      // Return absolute local url path
      return `/uploads/${file.filename}`;
    });

    res.json({ urls });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ================= VITE OR STATIC SERVING =================

// Serve uploaded assets
app.use('/uploads', express.static(UPLOADS_DIR));

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

