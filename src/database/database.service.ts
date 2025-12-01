import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool;

  constructor(private dataSource: DataSource) {}
  
  async onModuleInit() {
    // Test connexion
    await this.testConnection();

    // Setup DB (équivalent de ton setupDatabase)
    await this.setupDatabase();

    // Initialisation des tables
    // await this.initTable();

    // Démarrer le service
    await this.start();
  }

  async testConnection() {
    try {
      const res = await this.pool.query('SELECT NOW()');
      console.log('Connexion PostgreSQL OK:', res.rows[0]);
    } catch (err) {
      console.error('Erreur de connexion à PostgreSQL:', err);
      throw err; // important si critique
    }
  }

  async listTables() {
    const result = await this.pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
    );
    console.log('Tables dans la base de données:', result.rows.map(r => r.table_name));
  }

  async setupDatabase() {
  try {
    // Ici tu mets ta logique de création/migration
    console.log('Configuration de la base de données terminée.');
  } catch (err) {
    console.error('Erreur lors de la configuration de la base de données:', err);
  } finally {
    console.log('Processus de configuration de la base de données terminé.');
  }
}

  async start() {
    try {
      await this.pool.connect();
      console.log('Connexion à la base de données PostgreSQL réussie.');
    } catch (err) {
      console.error('Erreur de connexion à PostgreSQL:', err);
    }

    // Lister les tables
    await this.listTables();
  }

  async initTable() { //Initialisation des tables avec les entités TypeORM
    try {
      await this.dataSource.synchronize();
      console.log('Tables initialisées avec succès via TypeORM.');
    } catch (err) {
      console.error('Erreur lors de l’initialisation des tables:', err);
    }
   
  } 


//   async initTable() {
//   try {
//     await this.pool.connect();

//     //Creation des tables
//     await this.pool.query(`
//         CREATE TABLE IF NOT EXISTS users (
//           id_user UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//           email VARCHAR(255) NOT NULL UNIQUE,
//           password_hash BYTEA NOT NULL,
//           salt BYTEA NOT NULL
//         );
//       `);

//     await this.pool.query(`
//         CREATE TABLE IF NOT EXISTS notes (
//           id_note UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//           title VARCHAR(255) NOT NULL,
//           content BYTEA NOT NULL,
//           id_user UUID NOT NULL,
//           FOREIGN KEY(id_user) REFERENCES users(id_user) ON DELETE CASCADE
//         );
//       `);

//     await this.pool.query(`
//         CREATE TABLE IF NOT EXISTS credit_cards (
//           id_card UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//           card_name VARCHAR(255) NOT NULL,
//           card_number BYTEA NOT NULL,
//           expiry_date BYTEA NOT NULL,
//           cvv BYTEA NOT NULL,
//           id_user UUID NOT NULL,
//           FOREIGN KEY(id_user) REFERENCES users(id_user) ON DELETE CASCADE
//         );
//       `);

//     await this.pool.query(`
//         CREATE TABLE IF NOT EXISTS passwords (
//           id_password UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//           name VARCHAR(255) NOT NULL,
//           username VARCHAR(255) NOT NULL,
//           secret BYTEA NOT NULL,
//           id_user UUID NOT NULL,
//           FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
//         );
//       `);

//     // Activer RLS
//     await this.pool.query(`
//         ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;
//         ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
//         ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
//       `);

//     // Politiques
//     await this.pool.query(`
//         DROP POLICY IF EXISTS passwords_policy ON passwords;
//         CREATE POLICY passwords_policy ON passwords
//         FOR ALL USING (id_user = current_setting('app.current_user')::uuid);

//         DROP POLICY IF EXISTS notes_policy ON notes;
//         CREATE POLICY notes_policy ON notes
//         FOR ALL USING (id_user = current_setting('app.current_user')::uuid);

//         DROP POLICY IF EXISTS credit_cards_policy ON credit_cards;
//         CREATE POLICY credit_cards_policy ON credit_cards
//         FOR ALL USING (id_user = current_setting('app.current_user')::uuid);
//       `);

//     console.log(' Base de données initialisée avec succès');
//   } catch (err) {
//     console.error('Erreur lors de l’initialisation de la base:', err);
//   } finally {
//     await this.pool.end();
//   }
// }

}