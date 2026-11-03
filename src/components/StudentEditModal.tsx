import React, { useState, useEffect } from 'react';
import { X, Check, Save, User, Users, GraduationCap, School } from 'lucide-react';
import { Student, Sibling, EducationStatus } from '../types';
import { saveStudent, addNewStudent } from '../services/studentService';

interface StudentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null; // null if adding new
  nextRollNo: number;
}

export const StudentEditModal: React.FC<StudentEditModalProps> = ({
  isOpen,
  onClose,
  student,
  nextRollNo,
}) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'> & { id?: string }>({
    no: nextRollNo,
    nama: '',
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      const existing = student.saudara || [];
      const normalized: Sibling[] = [1, 2, 3, 4, 5].map((no) => {
        const found = existing.find((s) => s.no === no);
        return (
          found || {
            no,
            nama: '',
            statusPendidikan: '',
            tempatPendidikan: '',
          }
        );
      });
      setFormData({
        ...student,
        saudara: normalized,
      });
    } else {
      setFormData({
        no: nextRollNo,
        nama: '',
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
      });
    }
  }, [student, nextRollNo, isOpen]);

  if (!isOpen) return null;

  const handleSiblingChange = (index: number, field: keyof Sibling, value: any) => {
    const updated = [...formData.saudara];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      saudara: updated,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      setError('Nama siswa wajib diisi');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (student && student.id) {
        await saveStudent({ ...formData, id: student.id } as Student);
      } else {
        await addNewStudent(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <User className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {student ? `Edit Siswa: ${student.nama}` : 'Tambah Siswa Baru'}
              </h3>
              <p className="text-xs text-blue-200">
                Lengkapi atau perbarui entri biodata kelas XII DKV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Data Diri */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Data Pribadi</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">No Absen</label>
                <input
                  type="number"
                  required
                  value={formData.no}
                  onChange={(e) => setFormData({ ...formData, no: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border rounded-xl text-sm font-semibold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded-xl text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={formData.tempatLahir}
                  onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">No HP Siswa</label>
                <input
                  type="text"
                  value={formData.noHp}
                  onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat</label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Data Wali */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Data Orang Tua / Wali</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Wali</label>
                <input
                  type="text"
                  value={formData.namaWali}
                  onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">No HP/WA Wali</label>
                <input
                  type="text"
                  value={formData.noHpWali}
                  onChange={(e) => setFormData({ ...formData, noHpWali: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Data Saudara */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Data Saudara Kandung & Status Pendidikan</span>
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Jumlah:</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={formData.jumlahSaudara}
                  onChange={(e) => setFormData({ ...formData, jumlahSaudara: parseInt(e.target.value) || 0 })}
                  className="w-16 px-2 py-1 border rounded-lg text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((index) => {
                const sdr = formData.saudara[index] || {
                  no: index + 1,
                  nama: '',
                  statusPendidikan: '',
                  tempatPendidikan: '',
                };

                return (
                  <div key={index} className="p-3 bg-slate-50 border rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-700">Saudara ({index + 1})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder={`Nama saudara (${index + 1})`}
                        value={sdr.nama}
                        onChange={(e) => handleSiblingChange(index, 'nama', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border rounded-lg text-xs"
                      />
                      <select
                        value={sdr.statusPendidikan}
                        onChange={(e) => handleSiblingChange(index, 'statusPendidikan', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border rounded-lg text-xs font-medium"
                      >
                        <option value="">-- Pilih Status --</option>
                        <option value="Masih Sekolah">Masih Sekolah</option>
                        <option value="Sudah Tamat Sekolah">Sudah Tamat Sekolah</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Tempat pendidikan saat ini"
                        value={sdr.tempatPendidikan}
                        onChange={(e) => handleSiblingChange(index, 'tempatPendidikan', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 flex items-center gap-2"
            >
              {loading ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Data</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
