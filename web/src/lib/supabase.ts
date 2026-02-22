import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vqyqygnhencugzavuffh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxeXF5Z25oZW5jdWd6YXZ1ZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTU1MjcsImV4cCI6MjA4NzI3MTUyN30.OBcI69s4Fr2zN4pDQGx3WzOMO8gyeH5CdU8Mn1sWWeE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
