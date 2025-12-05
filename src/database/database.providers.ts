import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      // Vérification des variables d'environnement
      const host = process.env.PGHOST;
      const port = process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432;
      const username = process.env.PGUSER;
      const password = process.env.PGPASSWORD;
      const database = process.env.PGDATABASE;

      if (!host || !username || !password || !database) {
        throw new Error('PGHOST, PGUSER, PGPASSWORD and PGDATABASE must be defined in environment');
      }

      const dataSource = new DataSource({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        ssl: {
          rejectUnauthorized: false, // nécessaire pour Neon sur Cloud Run
        },
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
