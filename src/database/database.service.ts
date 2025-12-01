import { Injectable, OnModuleInit } from '@nestjs/common';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    await this.testConnection();
    await this.setupDatabase();
    // Initialisation des tables si nécessaire
    // await this.initTable();
    await this.start();
  }

  async testConnection() {
    try {
      const res = await this.dataSource.query('SELECT NOW()') as Array<{ now: string }>;
      console.log('Connexion PostgreSQL OK:', res[0]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Erreur de connexion à PostgreSQL:', err.message);
      } else {
        console.error('Erreur de connexion à PostgreSQL:', err);
      }
      throw err;
    }
  }

  async listTables() {
    const result = await this.dataSource.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
    ) as Array<{ table_name: string }>;
    console.log(
      'Tables dans la base de données:',
      result.map((r) => r.table_name),
    );
  }

  async setupDatabase() {
    try {
      console.log('Configuration de la base de données terminée.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Erreur lors de la configuration de la base de données:', err.message);
      } else {
        console.error('Erreur lors de la configuration de la base de données:', err);
      }
    } finally {
      console.log('Processus de configuration de la base de données terminé.');
    }
  }

  async start() {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        console.log('Connexion à la base de données PostgreSQL réussie.');
      } else {
        console.log('Connexion à la base de données PostgreSQL déjà établie.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Erreur de connexion à PostgreSQL:', err.message);
      } else {
        console.error('Erreur de connexion à PostgreSQL:', err);
      }
    }

    await this.listTables();
  }

  async initTable() {
    try {
      await this.dataSource.synchronize();
      console.log('Tables initialisées avec succès via TypeORM.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Erreur lors de l’initialisation des tables:', err.message);
      } else {
        console.error('Erreur lors de l’initialisation des tables:', err);
      }
    }
  }
}
