import { db, connectDB } from './database';
import { logger } from '../utils/logger';

/**
 * daily_region_scores — kunlik hisoblangan natijalar jadvali
 * Trigger orqali avtomatik yangilanadi:
 *   - indicator_values INSERT/UPDATE/DELETE
 *   - indicators.score UPDATE
 *   - crimes INSERT/UPDATE/DELETE
 *   - emergency102 INSERT/UPDATE/DELETE
 */
const migrate = async (): Promise<void> => {
  await connectDB();

  // ── 1. Jadval yaratish ────────────────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS daily_direction_scores (
      id           UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
      date         DATE    NOT NULL,
      region_id    UUID    NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
      direction_id UUID    NOT NULL REFERENCES directions(id) ON DELETE CASCADE,
      score        FLOAT   NOT NULL DEFAULT 0,
      rank         INTEGER NOT NULL DEFAULT 0,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (date, region_id, direction_id)
    );

    CREATE TABLE IF NOT EXISTS daily_region_scores (
      id                  UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
      date                DATE    NOT NULL,
      region_id           UUID    NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
      kpi_total           FLOAT   NOT NULL DEFAULT 0,
      crimes_score        FLOAT   NOT NULL DEFAULT 0,
      em102_score         FLOAT   NOT NULL DEFAULT 0,
      crimes_penalty_pct  FLOAT   NOT NULL DEFAULT 0,
      em102_penalty_pct   FLOAT   NOT NULL DEFAULT 0,
      total_score         FLOAT   NOT NULL DEFAULT 0,
      average_rank        FLOAT   NOT NULL DEFAULT 0,
      overall_rank        INTEGER NOT NULL DEFAULT 0,
      created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (date, region_id)
    );

    CREATE INDEX IF NOT EXISTS idx_dds_date_region   ON daily_direction_scores(date, region_id);
    CREATE INDEX IF NOT EXISTS idx_dds_date_dir      ON daily_direction_scores(date, direction_id);
    CREATE INDEX IF NOT EXISTS idx_drs_date          ON daily_region_scores(date);
    CREATE INDEX IF NOT EXISTS idx_drs_date_region   ON daily_region_scores(date, region_id);
    CREATE INDEX IF NOT EXISTS idx_drs_overall_rank  ON daily_region_scores(date, overall_rank);
  `);

  // ── 2. Asosiy hisoblash funksiyasi ────────────────────────────────────────
  await db.query(`
    CREATE OR REPLACE FUNCTION recalc_daily_scores(p_date DATE, p_region_id UUID, p_direction_id UUID DEFAULT NULL)
    RETURNS void LANGUAGE plpgsql AS $$
    DECLARE
      v_region   RECORD;
      v_dir      RECORD;
      v_dir_score FLOAT;
      v_kpi_total FLOAT := 0;
      v_avg_rank  FLOAT := 0;
      v_crimes_pen FLOAT := 0;
      v_em_pen     FLOAT := 0;
      v_total      FLOAT := 0;
      v_dir_count  INT := 0;
      v_rank_sum   INT := 0;
    BEGIN
      -- ── Direction score hisoblash ─────────────────────────────────────────
      IF p_direction_id IS NOT NULL THEN
        -- Faqat shu direction
        SELECT COALESCE(SUM(
          CASE WHEN i.is_subtraction = true THEN
            i.score * GREATEST(0,
              iv.value - COALESCE((
                SELECT SUM(iv2.value)
                FROM indicator_values iv2
                JOIN indicators i2 ON i2.id = iv2.indicator_id AND i2.is_active = true
                WHERE i2.parent_id = i.id
                  AND iv2.region_id = iv.region_id
                  AND iv2.date = iv.date
              ), 0)
            )
          ELSE i.score * iv.value END
        ), 0) INTO v_dir_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true
        WHERE iv.direction_id = p_direction_id
          AND iv.region_id    = p_region_id
          AND iv.date         = p_date;

        INSERT INTO daily_direction_scores (date, region_id, direction_id, score)
        VALUES (p_date, p_region_id, p_direction_id, v_dir_score)
        ON CONFLICT (date, region_id, direction_id)
        DO UPDATE SET score = EXCLUDED.score, updated_at = NOW();

      ELSE
        -- Barcha directionlar uchun
        FOR v_dir IN SELECT id FROM directions LOOP
          SELECT COALESCE(SUM(
            CASE WHEN i.is_subtraction = true THEN
              i.score * GREATEST(0,
                iv.value - COALESCE((
                  SELECT SUM(iv2.value)
                  FROM indicator_values iv2
                  JOIN indicators i2 ON i2.id = iv2.indicator_id AND i2.is_active = true
                  WHERE i2.parent_id = i.id
                    AND iv2.region_id = iv.region_id
                    AND iv2.date = iv.date
                ), 0)
              )
            ELSE i.score * iv.value END
          ), 0) INTO v_dir_score
          FROM indicator_values iv
          JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true
          WHERE iv.direction_id = v_dir.id
            AND iv.region_id    = p_region_id
            AND iv.date         = p_date;

          INSERT INTO daily_direction_scores (date, region_id, direction_id, score)
          VALUES (p_date, p_region_id, v_dir.id, v_dir_score)
          ON CONFLICT (date, region_id, direction_id)
          DO UPDATE SET score = EXCLUDED.score, updated_at = NOW();
        END LOOP;
      END IF;

      -- ── kpi_total = barcha directionlar yig'indisi ────────────────────────
      SELECT COALESCE(SUM(score), 0)
        INTO v_kpi_total
        FROM daily_direction_scores
        WHERE date = p_date AND region_id = p_region_id;

      -- ── crimes jarima ─────────────────────────────────────────────────────
      SELECT COALESCE(
        SUM(c.minor_crimes   * c.minor_crimes_score
          + c.medium_crimes  * c.medium_crimes_score
          + c.serious_crimes * c.serious_crimes_score
          + c.critical_crimes * c.critical_crimes_score), 0)
      INTO v_crimes_pen
      FROM crimes c
      WHERE c.region_id = p_region_id AND c.date = p_date;

      -- ── 102 jarima ────────────────────────────────────────────────────────
      SELECT COALESCE(
        SUM(e.total_calls_102) * MAX(e.calls_102_score)
        + SUM(e.call_pi)       * MAX(e.pi_call_score)
        + SUM(e.iio_complaint) * MAX(e.iio_complaint_score), 0)
      INTO v_em_pen
      FROM emergency102 e
      WHERE e.region_id = p_region_id AND e.date = p_date;

      -- ── final ball ────────────────────────────────────────────────────────
      v_total := v_kpi_total
        - v_kpi_total * v_crimes_pen / 100.0
        - v_kpi_total * v_em_pen     / 100.0;

      -- ── average_rank (direction rank o'rtacha) ────────────────────────────
      -- Har direction uchun rank hisoblab, o'rtachasini olamiz
      SELECT COUNT(*), COALESCE(SUM(
        (SELECT COUNT(*) + 1 FROM daily_direction_scores dds2
         WHERE dds2.date = dds.date AND dds2.direction_id = dds.direction_id
           AND dds2.score > dds.score)
      ), 0)
      INTO v_dir_count, v_rank_sum
      FROM daily_direction_scores dds
      WHERE dds.date = p_date AND dds.region_id = p_region_id;

      IF v_dir_count > 0 THEN
        v_avg_rank := v_rank_sum::FLOAT / v_dir_count;
      END IF;

      -- ── daily_region_scores upsert ────────────────────────────────────────
      INSERT INTO daily_region_scores
        (date, region_id, kpi_total, crimes_score, em102_score,
         crimes_penalty_pct, em102_penalty_pct, total_score, average_rank)
      VALUES
        (p_date, p_region_id, v_kpi_total, v_crimes_pen, v_em_pen,
         v_crimes_pen, v_em_pen, v_total, v_avg_rank)
      ON CONFLICT (date, region_id)
      DO UPDATE SET
        kpi_total          = EXCLUDED.kpi_total,
        crimes_score       = EXCLUDED.crimes_score,
        em102_score        = EXCLUDED.em102_score,
        crimes_penalty_pct = EXCLUDED.crimes_penalty_pct,
        em102_penalty_pct  = EXCLUDED.em102_penalty_pct,
        total_score        = EXCLUDED.total_score,
        average_rank       = EXCLUDED.average_rank,
        updated_at         = NOW();

      -- ── overall_rank qayta hisoblash (o'sha kun uchun barcha regionlar) ───
      UPDATE daily_region_scores drs
      SET overall_rank = ranked.rk
      FROM (
        SELECT region_id,
          RANK() OVER (ORDER BY total_score DESC) AS rk
        FROM daily_region_scores
        WHERE date = p_date
      ) ranked
      WHERE drs.date = p_date AND drs.region_id = ranked.region_id;

      -- direction_rank ham yangilanadi
      UPDATE daily_direction_scores dds
      SET rank = ranked.rk
      FROM (
        SELECT region_id, direction_id,
          RANK() OVER (PARTITION BY direction_id ORDER BY score DESC) AS rk
        FROM daily_direction_scores
        WHERE date = p_date
      ) ranked
      WHERE dds.date = p_date
        AND dds.region_id    = ranked.region_id
        AND dds.direction_id = ranked.direction_id;

    END;
    $$;
  `);

  // ── 3. Trigger funksiyalari ───────────────────────────────────────────────
  await db.query(`
    -- indicator_values trigger
    CREATE OR REPLACE FUNCTION trg_iv_recalc()
    RETURNS TRIGGER LANGUAGE plpgsql AS $$
    DECLARE v_date DATE; v_region UUID; v_dir UUID;
    BEGIN
      IF TG_OP = 'DELETE' THEN
        v_date := OLD.date; v_region := OLD.region_id; v_dir := OLD.direction_id;
      ELSE
        v_date := NEW.date; v_region := NEW.region_id; v_dir := NEW.direction_id;
      END IF;
      PERFORM recalc_daily_scores(v_date, v_region, v_dir);
      RETURN NULL;
    END;
    $$;

    DROP TRIGGER IF EXISTS trg_indicator_values_daily ON indicator_values;
    CREATE TRIGGER trg_indicator_values_daily
      AFTER INSERT OR UPDATE OR DELETE ON indicator_values
      FOR EACH ROW EXECUTE FUNCTION trg_iv_recalc();

    -- indicators.score UPDATE trigger
    CREATE OR REPLACE FUNCTION trg_indicator_score_recalc()
    RETURNS TRIGGER LANGUAGE plpgsql AS $$
    DECLARE v_rec RECORD;
    BEGIN
      IF OLD.score IS DISTINCT FROM NEW.score OR OLD.is_subtraction IS DISTINCT FROM NEW.is_subtraction THEN
        FOR v_rec IN
          SELECT DISTINCT iv.date, iv.region_id, iv.direction_id
          FROM indicator_values iv
          WHERE iv.indicator_id = NEW.id
        LOOP
          PERFORM recalc_daily_scores(v_rec.date, v_rec.region_id, v_rec.direction_id);
        END LOOP;
      END IF;
      RETURN NEW;
    END;
    $$;

    DROP TRIGGER IF EXISTS trg_indicators_daily ON indicators;
    CREATE TRIGGER trg_indicators_daily
      AFTER UPDATE ON indicators
      FOR EACH ROW EXECUTE FUNCTION trg_indicator_score_recalc();

    -- crimes trigger
    CREATE OR REPLACE FUNCTION trg_crimes_recalc()
    RETURNS TRIGGER LANGUAGE plpgsql AS $$
    DECLARE v_date DATE; v_region UUID;
    BEGIN
      IF TG_OP = 'DELETE' THEN
        v_date := OLD.date; v_region := OLD.region_id;
      ELSE
        v_date := NEW.date; v_region := NEW.region_id;
      END IF;
      PERFORM recalc_daily_scores(v_date, v_region, NULL);
      RETURN NULL;
    END;
    $$;

    DROP TRIGGER IF EXISTS trg_crimes_daily ON crimes;
    CREATE TRIGGER trg_crimes_daily
      AFTER INSERT OR UPDATE OR DELETE ON crimes
      FOR EACH ROW EXECUTE FUNCTION trg_crimes_recalc();

    -- emergency102 trigger
    CREATE OR REPLACE FUNCTION trg_em102_recalc()
    RETURNS TRIGGER LANGUAGE plpgsql AS $$
    DECLARE v_date DATE; v_region UUID;
    BEGIN
      IF TG_OP = 'DELETE' THEN
        v_date := OLD.date; v_region := OLD.region_id;
      ELSE
        v_date := NEW.date; v_region := NEW.region_id;
      END IF;
      PERFORM recalc_daily_scores(v_date, v_region, NULL);
      RETURN NULL;
    END;
    $$;

    DROP TRIGGER IF EXISTS trg_em102_daily ON emergency102;
    CREATE TRIGGER trg_em102_daily
      AFTER INSERT OR UPDATE OR DELETE ON emergency102
      FOR EACH ROW EXECUTE FUNCTION trg_em102_recalc();
  `);

  // ── 4. Backfill — mavjud ma'lumotlarni hisoblash ──────────────────────────
  logger.info('Backfill: mavjud ma\'lumotlar hisoblanmoqda...');

  await db.query(`
    DO $$
    DECLARE
      v_rec RECORD;
      v_total INT := 0;
    BEGIN
      FOR v_rec IN
        SELECT DISTINCT iv.date, iv.region_id
        FROM indicator_values iv
        ORDER BY iv.date, iv.region_id
      LOOP
        PERFORM recalc_daily_scores(v_rec.date, v_rec.region_id, NULL);
        v_total := v_total + 1;
      END LOOP;

      -- crimes va 102 dan kelgan sanalar ham
      FOR v_rec IN
        SELECT DISTINCT date, region_id FROM crimes
        UNION
        SELECT DISTINCT date, region_id FROM emergency102
        ORDER BY date, region_id
      LOOP
        PERFORM recalc_daily_scores(v_rec.date, v_rec.region_id, NULL);
        v_total := v_total + 1;
      END LOOP;

      RAISE NOTICE 'Backfill tugadi: % ta region-sana juft', v_total;
    END;
    $$;
  `);

  logger.info('Daily scores migration completed');
  process.exit(0);
};

migrate().catch(err => {
  logger.error('Migration failed', err);
  process.exit(1);
});
