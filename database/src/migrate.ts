import { Pool, Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface Migration {
  id: string;
  name: string;
  sql: string;
  applied_at?: Date;
}

class DatabaseMigrator {
  private pool: Pool;
  private migrationsPath: string;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'people_power_journey',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.migrationsPath = path.join(__dirname, 'migrations');
  }

  async initialize(): Promise<void> {
    try {
      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      // Create migrations table if it doesn't exist
      await this.createMigrationsTable();
      
      console.log('✅ Database connection established');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  private async createMigrationsTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_migrations_applied_at ON migrations(applied_at);
    `;

    await this.pool.query(sql);
  }

  async loadMigrations(): Promise<Migration[]> {
    const migrations: Migration[] = [];
    
    // Load main schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      migrations.push({
        id: '001_initial_schema',
        name: 'Initial Database Schema',
        sql: schemaSql
      });
    }

    // Load additional migration files
    if (fs.existsSync(this.migrationsPath)) {
      const migrationFiles = fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();

      for (const file of migrationFiles) {
        const filePath = path.join(this.migrationsPath, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        const migrationId = file.replace('.sql', '');
        
        migrations.push({
          id: migrationId,
          name: this.getMigrationNameFromId(migrationId),
          sql
        });
      }
    }

    return migrations;
  }

  private getMigrationNameFromId(id: string): string {
    return id
      .replace(/_/g, ' ')
      .replace(/^\d+_/, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async getAppliedMigrations(): Promise<Set<string>> {
    const result = await this.pool.query('SELECT id FROM migrations');
    return new Set(result.rows.map(row => row.id));
  }

  async applyMigration(migration: Migration): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Apply migration
      await client.query(migration.sql);
      
      // Record migration
      await client.query(
        'INSERT INTO migrations (id, name) VALUES ($1, $2)',
        [migration.id, migration.name]
      );
      
      await client.query('COMMIT');
      
      console.log(`✅ Applied migration: ${migration.name}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Failed to apply migration ${migration.name}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async rollbackMigration(migration: Migration): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Remove migration record
      await client.query('DELETE FROM migrations WHERE id = $1', [migration.id]);
      
      await client.query('COMMIT');
      
      console.log(`✅ Rolled back migration: ${migration.name}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Failed to rollback migration ${migration.name}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async migrate(): Promise<void> {
    console.log('🔄 Starting database migration...');
    
    await this.initialize();
    
    const migrations = await this.loadMigrations();
    const appliedMigrations = await this.getAppliedMigrations();
    
    const pendingMigrations = migrations.filter(m => !appliedMigrations.has(m.id));
    
    if (pendingMigrations.length === 0) {
      console.log('✅ Database is up to date');
      return;
    }
    
    console.log(`📝 Found ${pendingMigrations.length} pending migrations`);
    
    for (const migration of pendingMigrations) {
      await this.applyMigration(migration);
    }
    
    console.log('🎉 Migration completed successfully');
  }

  async rollback(targetId?: string): Promise<void> {
    console.log('🔄 Starting database rollback...');
    
    await this.initialize();
    
    const migrations = await this.loadMigrations();
    const appliedMigrations = await this.getAppliedMigrations();
    
    let migrationsToRollback = migrations
      .filter(m => appliedMigrations.has(m.id))
      .reverse();
    
    if (targetId) {
      const targetIndex = migrationsToRollback.findIndex(m => m.id === targetId);
      if (targetIndex === -1) {
        throw new Error(`Migration ${targetId} not found or not applied`);
      }
      migrationsToRollback = migrationsToRollback.slice(0, targetIndex + 1);
    }
    
    if (migrationsToRollback.length === 0) {
      console.log('✅ No migrations to rollback');
      return;
    }
    
    console.log(`📝 Rolling back ${migrationsToRollback.length} migrations`);
    
    for (const migration of migrationsToRollback) {
      await this.rollbackMigration(migration);
    }
    
    console.log('🎉 Rollback completed successfully');
  }

  async status(): Promise<void> {
    console.log('📊 Migration status:');
    
    await this.initialize();
    
    const migrations = await this.loadMigrations();
    const appliedMigrations = await this.getAppliedMigrations();
    
    console.log('\n📋 All migrations:');
    for (const migration of migrations) {
      const status = appliedMigrations.has(migration.id) ? '✅ Applied' : '⏳ Pending';
      const timestamp = appliedMigrations.has(migration.id) 
        ? await this.getMigrationTimestamp(migration.id)
        : '';
      
      console.log(`  ${status} ${migration.id.padEnd(25)} ${migration.name.padEnd(40)} ${timestamp}`);
    }
  }

  private async getMigrationTimestamp(id: string): Promise<string> {
    const result = await this.pool.query(
      'SELECT applied_at FROM migrations WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) return '';
    
    return new Date(result.rows[0].applied_at).toLocaleString();
  }

  async createBackup(): Promise<string> {
    console.log('💾 Creating database backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup_${timestamp}.sql`;
    
    const { exec } = require('child_process');
    const pgDumpCommand = `pg_dump -h ${process.env.DB_HOST || 'localhost'} -p ${process.env.DB_PORT || '5432'} -U ${process.env.DB_USER || 'postgres'} -d ${process.env.DB_NAME || 'people_power_journey'} > ${backupFile}`;
    
    return new Promise((resolve, reject) => {
      exec(pgDumpCommand, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error('❌ Backup failed:', error);
          reject(error);
          return;
        }
        
        console.log(`✅ Backup created: ${backupFile}`);
        resolve(backupFile);
      });
    });
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log('🔌 Database connection closed');
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const targetId = process.argv[3];
  
  const migrator = new DatabaseMigrator();
  
  try {
    switch (command) {
      case 'migrate':
        await migrator.migrate();
        break;
        
      case 'rollback':
        await migrator.rollback(targetId);
        break;
        
      case 'status':
        await migrator.status();
        break;
        
      case 'backup':
        await migrator.createBackup();
        break;
        
      case 'init':
        await migrator.initialize();
        console.log('✅ Database initialized');
        break;
        
      default:
        console.log(`
📚 Database Migration CLI

Usage: npm run db:migrate <command> [options]

Commands:
  migrate              Apply all pending migrations
  rollback [id]        Rollback to specific migration (or last if no id)
  status               Show migration status
  backup               Create database backup
  init                 Initialize database connection

Examples:
  npm run db:migrate migrate
  npm run db:migrate rollback 002_add_indexes
  npm run db:migrate status
  npm run db:migrate backup
        `);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migrator.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default DatabaseMigrator;
