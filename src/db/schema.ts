import Dexie, { Table } from 'dexie';
import type { FrameRecord } from '../types/frame';
import type { GpsPointRecord } from '../types/gps';
import type { SessionRecord } from '../types/session';

export class RoadSurveyDb extends Dexie {
  sessions!: Table<SessionRecord, string>;
  frames!: Table<FrameRecord, string>;
  gpsPoints!: Table<GpsPointRecord, string>;

  constructor() {
    super('roadSurveyDb');
    this.version(1).stores({
      sessions: 'id, status, startedAt, endedAt',
      frames: 'id, sessionId, capturedAt, frameIndex',
      gpsPoints: 'id, sessionId, timestamp'
    });
  }
}

export const db = new RoadSurveyDb();
