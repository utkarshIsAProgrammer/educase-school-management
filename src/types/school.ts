import { RowDataPacket } from 'mysql2/promise';

export interface School extends RowDataPacket {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface SchoolWithDistance extends School {
  distance: number;
}
