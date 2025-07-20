
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://ylfwondgtntehzgckojw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZndvbmRndG50ZWh6Z2Nrb2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODYzNjcsImV4cCI6MjA2NzU2MjM2N30.vw6x6Rmz4q4EjezS1nxDj7orynNTGBXVTUkLqtFVI3E'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
