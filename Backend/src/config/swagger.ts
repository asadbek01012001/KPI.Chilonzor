import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clean API',
      version: '1.0.0',
      description: 'Node.js TypeScript REST API with Clean Architecture',
    },
    servers: [
      { url: `/api/v1`, description: 'Current server' },
      { url: `http://localhost:${env.port}/api/v1`, description: 'Localhost' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        // ── Auth ──────────────────────────────────────────────
        RegisterDto: {
          type: 'object', required: ['name', 'email', 'password'],
          properties: {
            name:     { type: 'string', example: 'John Doe' },
            email:    { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        LoginDto: {
          type: 'object', required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken:  { type: 'string' },
            refreshToken: { type: 'string' },
            user: { $ref: '#/components/schemas/UserResponse' },
          },
        },
        // ── User ──────────────────────────────────────────────
        UserResponse: {
          type: 'object',
          properties: {
            id:         { type: 'string', format: 'uuid' },
            name:       { type: 'string' },
            email:      { type: 'string' },
            role:       { type: 'string', enum: ['admin', 'user'] },
            is_active:  { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        UpdateUserDto: {
          type: 'object',
          properties: {
            name:     { type: 'string' },
            email:    { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        // ── Region ────────────────────────────────────────────
        RegionResponse: {
          type: 'object',
          properties: {
            id:     { type: 'string', format: 'uuid' },
            name:   { type: 'string' },
            sector: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateRegionDto: {
          type: 'object', required: ['name', 'sector'],
          properties: {
            name:   { type: 'string', example: 'Ал-Хоразмий' },
            sector: { type: 'integer', example: 1 },
          },
        },
        UpdateRegionDto: {
          type: 'object',
          properties: {
            name:   { type: 'string' },
            sector: { type: 'integer' },
          },
        },
        // ── Direction ─────────────────────────────────────────
        DirectionResponse: {
          type: 'object',
          properties: {
            id:   { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateDirectionDto: {
          type: 'object', required: ['name'],
          properties: { name: { type: 'string', example: 'Ҳуқуқбузарликлар профилактикаси' } },
        },
        UpdateDirectionDto: {
          type: 'object',
          properties: { name: { type: 'string' } },
        },
        // ── Indicator ─────────────────────────────────────────
        IndicatorResponse: {
          type: 'object',
          properties: {
            id:           { type: 'string', format: 'uuid' },
            direction_id: { type: 'string', format: 'uuid' },
            parent_id:    { type: 'string', format: 'uuid', nullable: true },
            name:         { type: 'string' },
            score:        { type: 'number' },
            created_at:   { type: 'string', format: 'date-time' },
            updated_at:   { type: 'string', format: 'date-time' },
          },
        },
        CreateIndicatorDto: {
          type: 'object', required: ['direction_id', 'name'],
          properties: {
            direction_id: { type: 'string', format: 'uuid' },
            parent_id:    { type: 'string', format: 'uuid', nullable: true },
            name:         { type: 'string' },
            score:        { type: 'number', example: 0 },
          },
        },
        UpdateIndicatorDto: {
          type: 'object',
          properties: {
            direction_id: { type: 'string', format: 'uuid' },
            parent_id:    { type: 'string', format: 'uuid', nullable: true },
            name:         { type: 'string' },
            score:        { type: 'number' },
          },
        },
        // ── IndicatorValue ────────────────────────────────────
        IndicatorValueResponse: {
          type: 'object',
          properties: {
            id:           { type: 'string', format: 'uuid' },
            indicator_id: { type: 'string', format: 'uuid' },
            direction_id: { type: 'string', format: 'uuid' },
            region_id:    { type: 'string', format: 'uuid' },
            score:        { type: 'number' },
            value:        { type: 'number' },
            date:         { type: 'string', format: 'date' },
            created_at:   { type: 'string', format: 'date-time' },
            updated_at:   { type: 'string', format: 'date-time' },
          },
        },
        CreateIndicatorValueDto: {
          type: 'object', required: ['indicator_id', 'direction_id', 'region_id', 'date'],
          properties: {
            indicator_id: { type: 'string', format: 'uuid' },
            direction_id: { type: 'string', format: 'uuid' },
            region_id:    { type: 'string', format: 'uuid' },
            score:        { type: 'number', example: 0 },
            value:        { type: 'number', example: 0 },
            date:         { type: 'string', format: 'date', example: '2024-01-01' },
          },
        },
        UpdateIndicatorValueDto: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            value: { type: 'number' },
            date:  { type: 'string', format: 'date' },
          },
        },
        // ── Crime ─────────────────────────────────────────────
        CrimeResponse: {
          type: 'object',
          properties: {
            id:                    { type: 'string', format: 'uuid' },
            region_id:             { type: 'string', format: 'uuid' },
            total_crimes:          { type: 'integer' },
            minor_crimes:          { type: 'integer' },
            medium_crimes:         { type: 'integer' },
            serious_crimes:        { type: 'integer' },
            critical_crimes:       { type: 'integer' },
            total_crimes_score:    { type: 'number' },
            minor_crimes_score:    { type: 'number' },
            medium_crimes_score:   { type: 'number' },
            serious_crimes_score:  { type: 'number' },
            critical_crimes_score: { type: 'number' },
            date:                  { type: 'string', format: 'date' },
            created_at:            { type: 'string', format: 'date-time' },
            updated_at:            { type: 'string', format: 'date-time' },
          },
        },
        CreateCrimeDto: {
          type: 'object', required: ['region_id'],
          properties: {
            region_id:             { type: 'string', format: 'uuid' },
            total_crimes:          { type: 'integer', example: 0 },
            minor_crimes:          { type: 'integer', example: 0 },
            medium_crimes:         { type: 'integer', example: 0 },
            serious_crimes:        { type: 'integer', example: 0 },
            critical_crimes:       { type: 'integer', example: 0 },
            total_crimes_score:    { type: 'number', example: 0 },
            minor_crimes_score:    { type: 'number', example: 0 },
            medium_crimes_score:   { type: 'number', example: 0 },
            serious_crimes_score:  { type: 'number', example: 0 },
            critical_crimes_score: { type: 'number', example: 0 },
            date:                  { type: 'string', format: 'date', example: '2024-01-01' },
          },
        },
        UpdateCrimeDto: {
          type: 'object',
          properties: {
            total_crimes:          { type: 'integer' },
            minor_crimes:          { type: 'integer' },
            medium_crimes:         { type: 'integer' },
            serious_crimes:        { type: 'integer' },
            critical_crimes:       { type: 'integer' },
            total_crimes_score:    { type: 'number' },
            minor_crimes_score:    { type: 'number' },
            medium_crimes_score:   { type: 'number' },
            serious_crimes_score:  { type: 'number' },
            critical_crimes_score: { type: 'number' },
            date:                  { type: 'string', format: 'date' },
          },
        },
        // ── Emergency102 ──────────────────────────────────────
        Emergency102Response: {
          type: 'object',
          properties: {
            id:                  { type: 'string', format: 'uuid' },
            region_id:           { type: 'string', format: 'uuid' },
            total_calls_102:     { type: 'integer' },
            call_pi:             { type: 'integer' },
            iio_complaint:       { type: 'integer' },
            calls_102_score:     { type: 'number' },
            pi_call_score:       { type: 'number' },
            iio_complaint_score: { type: 'number' },
            date:                { type: 'string', format: 'date' },
            created_at:          { type: 'string', format: 'date-time' },
            updated_at:          { type: 'string', format: 'date-time' },
          },
        },
        CreateEmergency102Dto: {
          type: 'object', required: ['region_id'],
          properties: {
            region_id:           { type: 'string', format: 'uuid' },
            total_calls_102:     { type: 'integer', example: 0 },
            call_pi:             { type: 'integer', example: 0 },
            iio_complaint:       { type: 'integer', example: 0 },
            calls_102_score:     { type: 'number', example: 0 },
            pi_call_score:       { type: 'number', example: 0 },
            iio_complaint_score: { type: 'number', example: 0 },
            date:                { type: 'string', format: 'date', example: '2024-01-01' },
          },
        },
        UpdateEmergency102Dto: {
          type: 'object',
          properties: {
            total_calls_102:     { type: 'integer' },
            call_pi:             { type: 'integer' },
            iio_complaint:       { type: 'integer' },
            calls_102_score:     { type: 'number' },
            pi_call_score:       { type: 'number' },
            iio_complaint_score: { type: 'number' },
            date:                { type: 'string', format: 'date' },
          },
        },
        // ── Common ────────────────────────────────────────────
        PaginatedResponse: {
          type: 'object',
          properties: {
            data:  { type: 'array', items: {} },
            total: { type: 'integer' },
            page:  { type: 'integer' },
            limit: { type: 'integer' },
            pages: { type: 'integer' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors:  { type: 'array', items: { type: 'object' } },
          },
        },
        DirectionScore: {
          type: 'object',
          properties: {
            direction_id:   { type: 'string', format: 'uuid' },
            direction_name: { type: 'string' },
            score:          { type: 'number' },
            rank:           { type: 'integer' },
          },
        },
        CrimeSummary: {
          type: 'object',
          properties: {
            total_crimes:          { type: 'integer' },
            minor_crimes:          { type: 'integer' },
            medium_crimes:         { type: 'integer' },
            serious_crimes:        { type: 'integer' },
            critical_crimes:       { type: 'integer' },
            total_crimes_score:    { type: 'number' },
            minor_crimes_score:    { type: 'number' },
            medium_crimes_score:   { type: 'number' },
            serious_crimes_score:  { type: 'number' },
            critical_crimes_score: { type: 'number' },
          },
        },
        Emergency102Summary: {
          type: 'object',
          properties: {
            total_calls_102:     { type: 'integer' },
            call_pi:             { type: 'integer' },
            iio_complaint:       { type: 'integer' },
            calls_102_score:     { type: 'number' },
            pi_call_score:       { type: 'number' },
            iio_complaint_score: { type: 'number' },
          },
        },
        MahallaReport: {
          type: 'object',
          properties: {
            region_id:    { type: 'string', format: 'uuid' },
            region_name:  { type: 'string' },
            sector:       { type: 'integer' },
            overall_rank: { type: 'integer' },
            total_score:  { type: 'number' },
            average_rank: { type: 'number' },
            directions:   { type: 'array', items: { $ref: '#/components/schemas/DirectionScore' } },
            crimes:       { $ref: '#/components/schemas/CrimeSummary' },
            emergency102: { $ref: '#/components/schemas/Emergency102Summary' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
