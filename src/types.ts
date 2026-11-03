export type EducationStatus = 'Masih Sekolah' | 'Sudah Tamat Sekolah' | '';

export interface Sibling {
  no: number;
  nama: string;
  statusPendidikan: EducationStatus;
  tempatPendidikan: string;
}

export interface Student {
  id: string;
  no: number;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD format
  alamat: string;
  noHp: string;
  namaWali: string;
  noHpWali: string;
  jumlahSaudara: number;
  saudara: Sibling[];
  isCompleted: boolean;
  updatedAt?: string;
  createdAt?: string;
}

export interface AdminConfig {
  adminPasswordHash: string; // SHA-256 hash
  schoolName: string;
  className: string;
  academicYear: string;
  updatedAt?: string;
}

export const INITIAL_STUDENTS: Array<Omit<Student, 'id' | 'isCompleted' | 'updatedAt' | 'createdAt'>> = [
  {
    no: 1,
    nama: 'AURA CANDRA DEWI',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 2,
    nama: 'CELLY CAKRAWATI',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 3,
    nama: 'DAVID',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 4,
    nama: 'DELLYN',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 5,
    nama: 'DELVIN',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 6,
    nama: 'DINA SAFIRA RIAUNA ROMADHANI',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 7,
    nama: 'EVI JESSTINA',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 8,
    nama: 'EZRA',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 9,
    nama: 'MERLIN',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 10,
    nama: 'NABILA',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 11,
    nama: 'STEVEN',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 12,
    nama: 'TAURUS WINATA',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  },
  {
    no: 13,
    nama: 'TRINETTA ANGELICA',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    jumlahSaudara: 0,
    saudara: [
      { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
      { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
    ]
  }
];

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  adminPasswordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // sha256 of 'admin123'
  schoolName: 'SMK NEGERI (DKV)',
  className: 'XII DKV',
  academicYear: '2026/2027',
};
