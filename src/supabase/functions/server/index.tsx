import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Supabase client helper
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
};

// Health check endpoint
app.get("/make-server-13ce44c0/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-13ce44c0/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: "Email, password y nombre son requeridos" }, 400);
    }

    const supabase = getSupabaseClient();
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.error("Error creating user:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Error al registrar usuario" }, 500);
  }
});

// Movies endpoints removed - using local catalog in frontend
// These endpoints are disabled because the KV store table does not exist

// Image storage endpoints
const BUCKET_NAME = "make-13ce44c0-images";

// Initialize storage bucket
const initStorage = async () => {
  const supabase = getSupabaseClient();
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
  
  if (!bucketExists) {
    console.log('Creating storage bucket:', BUCKET_NAME);
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: false,
      fileSizeLimit: 5242880 // 5MB limit
    });
    if (error) {
      console.error('Error creating bucket:', error);
    } else {
      console.log('Bucket created successfully');
    }
  }
};

// Initialize storage on startup
initStorage();

// Upload image endpoint
app.post("/make-server-13ce44c0/images/upload", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No se proporcionó archivo' }, 400);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'El archivo debe ser una imagen' }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${user.id}/${timestamp}.${extension}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, uint8Array, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return c.json({ error: 'Error al subir imagen' }, 500);
    }

    // Get signed URL (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filename, 31536000);

    if (urlError) {
      console.error('Error creating signed URL:', urlError);
      return c.json({ error: 'Error al generar URL' }, 500);
    }

    return c.json({ 
      success: true,
      filename,
      url: urlData.signedUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Error al procesar la solicitud' }, 500);
  }
});

// Get signed URL for existing image
app.post("/make-server-13ce44c0/images/get-url", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const { filename } = await c.req.json();
    
    if (!filename) {
      return c.json({ error: 'Filename requerido' }, 400);
    }

    const { data: urlData, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filename, 31536000);

    if (urlError) {
      console.error('Error creating signed URL:', urlError);
      return c.json({ error: 'Error al generar URL' }, 500);
    }

    return c.json({ 
      success: true,
      url: urlData.signedUrl
    });
  } catch (error) {
    console.error('Get URL error:', error);
    return c.json({ error: 'Error al procesar la solicitud' }, 500);
  }
});

Deno.serve(app.fetch);