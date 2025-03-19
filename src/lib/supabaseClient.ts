import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://pjkxzyvnfahlqzeviyxj.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqa3h6eXZuZmFobHF6ZXZpeXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTcyNDgsImV4cCI6MjA1NjM5MzI0OH0.1p5RXkXYbw-IvtYzsa8GPogKgomG82JYO5bjeGaL6QE'
);
