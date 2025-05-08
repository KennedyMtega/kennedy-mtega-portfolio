const { supabase } = require('./supabase')
const fs = require('fs')
const path = require('path')

async function runSQL() {
  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20240320000003_fix_column_names.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Split into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    console.log('Running SQL statements...')

    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      
      if (error) {
        console.error('Error executing statement:', error)
        console.error('Statement:', statement)
      } else {
        console.log('Successfully executed statement:', statement.substring(0, 50) + '...')
      }
    }

    console.log('Finished running SQL statements')

  } catch (error) {
    console.error('Error running SQL:', error)
  }
}

// Run the SQL
runSQL() 