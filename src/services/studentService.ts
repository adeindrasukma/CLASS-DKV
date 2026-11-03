import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Student, INITIAL_STUDENTS, AdminConfig, DEFAULT_ADMIN_CONFIG } from '../types';
import { hashPassword } from '../utils/authUtils';

const STUDENTS_COLLECTION = 'students';
const SETTINGS_COLLECTION = 'settings';
const ADMIN_CONFIG_DOC = 'admin_config';

export function subscribeToStudents(
  onData: (students: Student[]) => void,
  onError?: (error: Error) => void
) {
  const colRef = collection(db, STUDENTS_COLLECTION);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Auto-seed initial 13 students on very first run
        try {
          await seedInitialStudents();
          return;
        } catch (e) {
          console.error('Failed to auto-seed students:', e);
        }
      }

      const students: Student[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          no: data.no ?? 0,
          nama: data.nama ?? '',
          tempatLahir: data.tempatLahir ?? '',
          tanggalLahir: data.tanggalLahir ?? '',
          alamat: data.alamat ?? '',
          noHp: data.noHp ?? '',
          namaWali: data.namaWali ?? '',
          noHpWali: data.noHpWali ?? '',
          jumlahSaudara: data.jumlahSaudara ?? 0,
          saudara: data.saudara ?? [
            { no: 1, nama: '', statusPendidikan: '', tempatPendidikan: '' },
            { no: 2, nama: '', statusPendidikan: '', tempatPendidikan: '' },
            { no: 3, nama: '', statusPendidikan: '', tempatPendidikan: '' },
            { no: 4, nama: '', statusPendidikan: '', tempatPendidikan: '' },
            { no: 5, nama: '', statusPendidikan: '', tempatPendidikan: '' },
          ],
          isCompleted: Boolean(data.isCompleted),
          updatedAt: data.updatedAt,
          createdAt: data.createdAt,
        };
      });

      // Sort by roll number 'no' ascending
      students.sort((a, b) => a.no - b.no);
      onData(students);
    },
    (err) => {
      if (onError) {
        onError(err);
      }
      handleFirestoreError(err, OperationType.GET, STUDENTS_COLLECTION);
    }
  );
}

export async function seedInitialStudents(): Promise<void> {
  const batch = writeBatch(db);
  for (const item of INITIAL_STUDENTS) {
    const docRef = doc(db, STUDENTS_COLLECTION, `student_${item.no.toString().padStart(2, '0')}`);
    const studentData: Omit<Student, 'id'> = {
      ...item,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    batch.set(docRef, studentData);
  }

  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, STUDENTS_COLLECTION);
  }
}

export function checkIsCompleted(student: Partial<Student>): boolean {
  return Boolean(
    student.nama?.trim() &&
    student.tempatLahir?.trim() &&
    student.tanggalLahir?.trim() &&
    student.alamat?.trim() &&
    student.noHp?.trim() &&
    student.namaWali?.trim()
  );
}

export async function saveStudent(student: Student): Promise<void> {
  const isCompleted = checkIsCompleted(student);
  const dataToSave = {
    no: Number(student.no),
    nama: student.nama.trim(),
    tempatLahir: student.tempatLahir?.trim() || '',
    tanggalLahir: student.tanggalLahir?.trim() || '',
    alamat: student.alamat?.trim() || '',
    noHp: student.noHp?.trim() || '',
    namaWali: student.namaWali?.trim() || '',
    noHpWali: student.noHpWali?.trim() || '',
    jumlahSaudara: Number(student.jumlahSaudara) || 0,
    saudara: student.saudara || [],
    isCompleted,
    updatedAt: new Date().toISOString(),
  };

  const path = `${STUDENTS_COLLECTION}/${student.id}`;
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function addNewStudent(studentData: Omit<Student, 'id'>): Promise<string> {
  const isCompleted = checkIsCompleted(studentData);
  const newId = `student_${Date.now()}`;
  const path = `${STUDENTS_COLLECTION}/${newId}`;
  
  const payload = {
    ...studentData,
    no: Number(studentData.no),
    isCompleted,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, STUDENTS_COLLECTION, newId);
    await setDoc(docRef, payload);
    return newId;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function deleteStudent(id: string): Promise<void> {
  const path = `${STUDENTS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, STUDENTS_COLLECTION, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function resetData(mode: 'reset_default' | 'clear_fields' | 'delete_all'): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
    const batch = writeBatch(db);

    if (mode === 'delete_all') {
      snapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
      return;
    }

    if (mode === 'clear_fields') {
      // Keep existing students but clear their filled data
      snapshot.forEach((docSnap) => {
        const currentData = docSnap.data();
        batch.update(docSnap.ref, {
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
          ],
          isCompleted: false,
          updatedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      return;
    }

    if (mode === 'reset_default') {
      // Delete all existing and re-seed 13 students
      snapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
      await seedInitialStudents();
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, STUDENTS_COLLECTION);
  }
}

// Admin configuration
export function subscribeToAdminConfig(
  onData: (config: AdminConfig) => void,
  onError?: (err: Error) => void
) {
  const docRef = doc(db, SETTINGS_COLLECTION, ADMIN_CONFIG_DOC);
  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await setDoc(docRef, {
            ...DEFAULT_ADMIN_CONFIG,
            updatedAt: new Date().toISOString(),
          });
          onData(DEFAULT_ADMIN_CONFIG);
        } catch (e) {
          console.error('Error initializing admin config:', e);
        }
        return;
      }
      onData(snapshot.data() as AdminConfig);
    },
    (err) => {
      if (onError) {
        onError(err);
      }
      handleFirestoreError(err, OperationType.GET, `${SETTINGS_COLLECTION}/${ADMIN_CONFIG_DOC}`);
    }
  );
}

export async function changeAdminPassword(newPassword: string): Promise<void> {
  const hash = await hashPassword(newPassword);
  const docRef = doc(db, SETTINGS_COLLECTION, ADMIN_CONFIG_DOC);
  const path = `${SETTINGS_COLLECTION}/${ADMIN_CONFIG_DOC}`;
  try {
    await updateDoc(docRef, {
      adminPasswordHash: hash,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    // If not existing yet, create
    try {
      await setDoc(docRef, {
        ...DEFAULT_ADMIN_CONFIG,
        adminPasswordHash: hash,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}
