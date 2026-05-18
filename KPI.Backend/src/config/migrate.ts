import { db, connectDB } from './database';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

const migrate = async (): Promise<void> => {
  await connectDB();

  await db.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- ── Users ──────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS users (
      id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
      name          VARCHAR(100)  NOT NULL,
      email         VARCHAR(255)  UNIQUE,
      password_hash VARCHAR(255)  NOT NULL,
      role          VARCHAR(20)   NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
      is_active     BOOLEAN       NOT NULL DEFAULT true,
      refresh_token VARCHAR(500),
      created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );
    -- Eski jadval bo'lsa kolonlarni qo'shamiz
    ALTER TABLE users ADD COLUMN IF NOT EXISTS name          VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email         VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS role          VARCHAR(20)  DEFAULT 'user';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active     BOOLEAN      DEFAULT true;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token  VARCHAR(500);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at  TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at     TIMESTAMPTZ  DEFAULT NOW();
    ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ  DEFAULT NOW();
    CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email ON users(email);

    -- ── Regions ────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS regions (
      id         UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
      name       TEXT     NOT NULL,
      sector     INTEGER  NOT NULL DEFAULT 1,
      index      INTEGER  NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE regions ADD COLUMN IF NOT EXISTS index  INTEGER DEFAULT 0;
    ALTER TABLE regions ADD COLUMN IF NOT EXISTS sector INTEGER DEFAULT 1;

    -- ── Directions ─────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS directions (
      id         UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
      name       TEXT  NOT NULL,
      index      INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE directions ADD COLUMN IF NOT EXISTS index INTEGER DEFAULT 0;

    -- ── Indicators ─────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS indicators (
      id              UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
      direction_id    UUID    NOT NULL REFERENCES directions(id) ON DELETE CASCADE,
      parent_id       UUID    REFERENCES indicators(id) ON DELETE SET NULL,
      name            TEXT    NOT NULL,
      score           FLOAT   NOT NULL DEFAULT 0,
      index           INTEGER NOT NULL DEFAULT 0,
      is_active       BOOLEAN NOT NULL DEFAULT true,
      is_subtraction  BOOLEAN NOT NULL DEFAULT false,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    -- Eski jadval bo'lsa kolonlarni qo'shamiz
    ALTER TABLE indicators ADD COLUMN IF NOT EXISTS index          INTEGER DEFAULT 0;
    ALTER TABLE indicators ADD COLUMN IF NOT EXISTS is_active      BOOLEAN DEFAULT true;
    ALTER TABLE indicators ADD COLUMN IF NOT EXISTS is_subtraction BOOLEAN DEFAULT false;

    -- ── IndicatorValues ────────────────────────────────────
    CREATE TABLE IF NOT EXISTS indicator_values (
      id           UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
      indicator_id UUID  NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
      direction_id UUID  NOT NULL REFERENCES directions(id) ON DELETE CASCADE,
      region_id    UUID  NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
      score        FLOAT NOT NULL DEFAULT 0,
      value        FLOAT NOT NULL DEFAULT 0,
      date         DATE  NOT NULL,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- ── Crimes ─────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS crimes (
      id                    UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
      region_id             UUID    NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
      total_crimes          INTEGER NOT NULL DEFAULT 0,
      minor_crimes          INTEGER NOT NULL DEFAULT 0,
      medium_crimes         INTEGER NOT NULL DEFAULT 0,
      serious_crimes        INTEGER NOT NULL DEFAULT 0,
      critical_crimes       INTEGER NOT NULL DEFAULT 0,
      total_crimes_score    FLOAT   NOT NULL DEFAULT 0,
      minor_crimes_score    FLOAT   NOT NULL DEFAULT 0,
      medium_crimes_score   FLOAT   NOT NULL DEFAULT 0,
      serious_crimes_score  FLOAT   NOT NULL DEFAULT 0,
      critical_crimes_score FLOAT   NOT NULL DEFAULT 0,
      date                  DATE    NOT NULL DEFAULT CURRENT_DATE,
      created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- ── Emergency102 ───────────────────────────────────────
    CREATE TABLE IF NOT EXISTS emergency102 (
      id                   UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
      region_id            UUID    NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
      total_calls_102      INTEGER NOT NULL DEFAULT 0,
      call_pi              INTEGER NOT NULL DEFAULT 0,
      iio_complaint        INTEGER NOT NULL DEFAULT 0,
      calls_102_score      FLOAT   NOT NULL DEFAULT 0,
      pi_call_score        FLOAT   NOT NULL DEFAULT 0,
      iio_complaint_score  FLOAT   NOT NULL DEFAULT 0,
      date                 DATE    NOT NULL DEFAULT CURRENT_DATE,
      created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- ── Indexes ────────────────────────────────────────────
    CREATE INDEX IF NOT EXISTS idx_users_email              ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role               ON users(role);
    CREATE INDEX IF NOT EXISTS idx_regions_sector           ON regions(sector);
    CREATE INDEX IF NOT EXISTS idx_indicators_direction     ON indicators(direction_id);
    CREATE INDEX IF NOT EXISTS idx_indicators_parent        ON indicators(parent_id);
    CREATE INDEX IF NOT EXISTS idx_indicator_values_region  ON indicator_values(region_id);
    CREATE INDEX IF NOT EXISTS idx_indicator_values_date    ON indicator_values(date);

    -- Upsert uchun: bir indicator + region + date da faqat bitta yozuv bo'ladi
    ALTER TABLE indicator_values
      DROP CONSTRAINT IF EXISTS uq_indicator_values_indicator_region_date;
    ALTER TABLE indicator_values
      ADD CONSTRAINT uq_indicator_values_indicator_region_date
      UNIQUE (indicator_id, region_id, date);
    CREATE INDEX IF NOT EXISTS idx_crimes_region            ON crimes(region_id);
    CREATE INDEX IF NOT EXISTS idx_crimes_date              ON crimes(date);
    CREATE INDEX IF NOT EXISTS idx_emergency102_region      ON emergency102(region_id);
    CREATE INDEX IF NOT EXISTS idx_emergency102_date        ON emergency102(date);

    -- Bulk upsert uchun unique constraint
    ALTER TABLE crimes
      DROP CONSTRAINT IF EXISTS uq_crimes_region_date;
    ALTER TABLE crimes
      ADD CONSTRAINT uq_crimes_region_date UNIQUE (region_id, date);

    ALTER TABLE emergency102
      DROP CONSTRAINT IF EXISTS uq_emergency102_region_date;
    ALTER TABLE emergency102
      ADD CONSTRAINT uq_emergency102_region_date UNIQUE (region_id, date);

    -- ── updated_at trigger ─────────────────────────────────
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_users_updated_at            ON users;
    DROP TRIGGER IF EXISTS trg_regions_updated_at          ON regions;
    DROP TRIGGER IF EXISTS trg_directions_updated_at       ON directions;
    DROP TRIGGER IF EXISTS trg_indicators_updated_at       ON indicators;
    DROP TRIGGER IF EXISTS trg_indicator_values_updated_at ON indicator_values;
    DROP TRIGGER IF EXISTS trg_crimes_updated_at           ON crimes;
    DROP TRIGGER IF EXISTS trg_emergency102_updated_at     ON emergency102;

    CREATE TRIGGER trg_users_updated_at
      BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    CREATE TRIGGER trg_regions_updated_at
      BEFORE UPDATE ON regions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    CREATE TRIGGER trg_directions_updated_at
      BEFORE UPDATE ON directions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    CREATE TRIGGER trg_indicators_updated_at
      BEFORE UPDATE ON indicators FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    CREATE TRIGGER trg_indicator_values_updated_at
      BEFORE UPDATE ON indicator_values FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    CREATE TRIGGER trg_crimes_updated_at
      BEFORE UPDATE ON crimes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    CREATE TRIGGER trg_emergency102_updated_at
      BEFORE UPDATE ON emergency102 FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  `);

  // ── Seed admin user (agar mavjud bo'lmasa) ─────────────────
  const existing = await db.query(`SELECT id FROM users WHERE email = 'admin@kpi.uz' LIMIT 1`);
  if (!existing.rows.length) {
    const hash = await bcrypt.hash('Admin@123', 10);
    await db.query(
      `INSERT INTO users (name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5)`,
      ['Admin', 'admin@kpi.uz', hash, 'admin', true],
    );
    logger.info('Seed admin created → email: admin@kpi.uz  password: Admin@123');
  }

  logger.info('Migration completed successfully');
  process.exit(0);
};

migrate().catch((err) => {
  logger.error('Migration failed', err);
  process.exit(1);
});
