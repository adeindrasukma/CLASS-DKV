import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Calendar,
  Phone,
  Users,
  GraduationCap,
  School,
  CheckCircle2,
  AlertCircle,
  Save,
  Search,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { Student, Sibling, EducationStatus } from '../types';
import { saveStudent } from '../services/studentService';
import { printSingleStudentBiodata } from '../utils/exportUtils';

interface StudentFormProps {
  students: Student[];
  onOpenAdminLogin: () => void;
  isAdminLoggedIn?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  students,
  onOpenAdminLogin,
  isAdminLoggedIn = false,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [formData, setFormData] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check URL param on mount for direct link (e.g., ?student=id)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromParam = params.get('studentId');
    if (idFromParam && students.some((s) => s.id === idFromParam)) {
      setSelectedStudentId(idFromParam);
    } else if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students]);

  // Sync form data when selected student changes
  useEffect(() => {
    if (selectedStudentId) {
      const found = students.find((s) => s.id === selectedStudentId);
      if (found) {
        // Ensure 5 siblings initialized
        const existingSiblings = found.saudara || [];
        const normalizedSiblings: Sibling[] = [1, 2, 3, 4, 5].map((no) => {
          const match = existingSiblings.find((sib) => sib.no === no);
          return (
            match || {
              no,
              nama: '',
              statusPendidikan: '',
              tempatPendidikan: '',
            }
          );
        });

        setFormData({
          ...found,
          saudara: normalizedSiblings,
        });
        setSaveSuccess(false);
        setErrorMessage(null);
      }
    }
  }, [selectedStudentId, students]);

  const handleSiblingChange = (index: number, field: keyof Sibling, value: any) => {
    if (!formData) return;
    const updatedSiblings = [...formData.saudara];
    updatedSiblings[index] = {
      ...updatedSiblings[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      saudara: updatedSiblings,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (!formData.nama.trim()) {
      setErrorMessage('Nama siswa wajib diisi.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await saveStudent(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal menyimpan biodata ke database Firebase.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (!formData) return;
    const url = new URL(window.location.href);
    url.searchParams.set('studentId', formData.id);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filter students for search
  const filteredStudents = students.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.no.toString().includes(searchQuery)
  );

  // Calculate completion percentage for current student
  const calculateProgress = () => {
    if (!formData) return 0;
    const fields = [
      formData.nama,
      formData.tempatLahir,
      formData.tanggalLahir,
      formData.alamat,
      formData.noHp,
      formData.namaWali,
      formData.noHpWali,
    ];
    const filledCount = fields.filter((f) => f && f.toString().trim() !== '').length;
    return Math.round((filledCount / fields.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner & Quick Selector */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-800/50">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold tracking-wide border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Sistem Biodata Siswa Terintegrasi Firebase Realtime</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Formulir Biodata Siswa Kelas XII DKV
            </h1>
            <p className="text-blue-200 text-sm max-w-2xl">
              Tahun Ajaran 2026/2027 • Silakan pilih nama Anda pada daftar di bawah dan lengkapi data pribadi, data orang tua/wali, serta status pendidikan saudara kandung.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdminLogin}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-xs transition border border-white/20 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-blue-300" />
              <span>{isAdminLoggedIn ? 'Panel Admin' : 'Akses Admin'}</span>
            </button>
          </div>
        </div>

        {/* Student Selector Card Grid */}
        <div className="mt-8 pt-6 border-t border-blue-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Pilih Nama Siswa (Total: {students.length} Siswa):</span>
            </label>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama atau no absen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-blue-300/60 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredStudents.map((s) => {
              const isSelected = s.id === selectedStudentId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  type="button"
                  className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white text-blue-950 font-bold shadow-lg border-white ring-2 ring-blue-400'
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                        isSelected ? 'bg-blue-100 text-blue-900 font-bold' : 'bg-white/10 text-blue-200'
                      }`}
                    >
                      No. {s.no}
                    </span>
                    {s.isCompleted ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Lengkap</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-300 opacity-80">Belum Lengkap</span>
                    )}
                  </div>
                  <span className="truncate font-medium">{s.nama}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Student Form */}
      {formData && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Status Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                {formData.no}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{formData.nama}</h2>
                  {formData.isCompleted ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Biodata Lengkap
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                      Perlu Dilengkapi
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {formData.updatedAt
                    ? `Terakhir diperbarui: ${new Date(formData.updatedAt).toLocaleString('id-ID')}`
                    : 'Belum pernah disimpan'}
                </p>
              </div>
            </div>

            {/* Progress & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <span className="text-xs font-medium text-slate-500">Kelengkapan</span>
                <div className="w-28 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200 mt-1">
                  <div
                    className={`h-full transition-all duration-300 ${
                      progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-xl transition text-xs font-semibold flex items-center gap-1.5"
                title="Salin link form untuk siswa ini"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden md:inline">{copiedLink ? 'Link Tersalin!' : 'Bagikan Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => printSingleStudentBiodata(formData)}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition text-xs font-semibold flex items-center gap-1.5"
                title="Cetak formulir biodata siswa ini"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden md:inline">Cetak Biodata</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-md transition flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Biodata</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold">Berhasil Tersimpan ke Database Firebase!</p>
                <p className="text-xs text-emerald-700">Data biodata siswa telah tersinkronisasi secara realtime dan dapat diakses oleh admin.</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Data Diri Siswa */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-slate-900 text-base">Bagian 1: Data Pribadi Siswa</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Urut / Absen
                </label>
                <input
                  type="number"
                  value={formData.no}
                  onChange={(e) => setFormData({ ...formData, no: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value.toUpperCase() })}
                  placeholder="Nama lengkap sesuai akta / ijazah"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tempat Lahir</span>
                </label>
                <input
                  type="text"
                  value={formData.tempatLahir}
                  onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                  placeholder="Contoh: Jakarta, Medan, Surabaya"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tanggal Lahir</span>
                </label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alamat Tempat Tinggal Saat Ini</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota / Kabupaten"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>No. Handphone / WhatsApp Siswa</span>
                </label>
                <input
                  type="tel"
                  value={formData.noHp}
                  onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Data Orang Tua / Wali */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Users className="w-5 h-5 text-indigo-700" />
              <h3 className="font-bold text-slate-900 text-base">Bagian 2: Data Orang Tua / Wali</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={formData.namaWali}
                  onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                  placeholder="Nama ayah / ibu / wali murid"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>No. Handphone / WhatsApp Wali</span>
                </label>
                <input
                  type="tel"
                  value={formData.noHpWali}
                  onChange={(e) => setFormData({ ...formData, noHpWali: e.target.value })}
                  placeholder="Contoh: 081298765432"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Data Saudara Kandung */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Bagian 3: Data Saudara Kandung & Status Pendidikan</h3>
                  <p className="text-xs text-slate-500">
                    Sesuai format tabel lampiran dengan kolom nama, status pendidikan saat ini (Masih Sekolah / Sudah Tamat), dan tempat pendidikan.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <label className="text-xs font-semibold text-slate-700">Jumlah Saudara:</label>
                <select
                  value={formData.jumlahSaudara}
                  onChange={(e) => setFormData({ ...formData, jumlahSaudara: parseInt(e.target.value) || 0 })}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600"
                >
                  <option value={0}>0 (Anak Tunggal)</option>
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang</option>
                  <option value={5}>5 Orang atau lebih</option>
                </select>
              </div>
            </div>

            {/* Sibling rows (1 to 5) */}
            <div className="space-y-4">
              {[0, 1, 2, 3, 4].map((index) => {
                const sdr = formData.saudara[index] || {
                  no: index + 1,
                  nama: '',
                  statusPendidikan: '',
                  tempatPendidikan: '',
                };
                const isHighlight = index < (formData.jumlahSaudara || 0);

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all ${
                      isHighlight
                        ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                        : 'bg-slate-50/50 border-slate-200 opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-sm text-slate-800">
                          Saudara Ke-{index + 1}
                        </span>
                      </div>
                      {sdr.nama && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                          {sdr.statusPendidikan || 'Status belum dipilih'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Nama Saudara */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Nama Saudara ({index + 1})
                        </label>
                        <input
                          type="text"
                          value={sdr.nama}
                          onChange={(e) => handleSiblingChange(index, 'nama', e.target.value)}
                          placeholder={`Nama saudara ke-${index + 1}`}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 text-slate-800"
                        />
                      </div>

                      {/* Status Pendidikan Saat Ini (Requested feature) */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Status Pendidikan Saat Ini
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSiblingChange(index, 'statusPendidikan', 'Masih Sekolah')}
                            className={`px-2 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition ${
                              sdr.statusPendidikan === 'Masih Sekolah'
                                ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <School className="w-3.5 h-3.5" />
                            <span>Masih Sekolah</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSiblingChange(index, 'statusPendidikan', 'Sudah Tamat Sekolah')}
                            className={`px-2 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition ${
                              sdr.statusPendidikan === 'Sudah Tamat Sekolah'
                                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Sudah Tamat</span>
                          </button>
                        </div>
                      </div>

                      {/* Tempat Pendidikan Saudara Saat Ini */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Tempat Pendidikan Saat Ini / Terakhir ({index + 1})
                        </label>
                        <input
                          type="text"
                          value={sdr.tempatPendidikan}
                          onChange={(e) => handleSiblingChange(index, 'tempatPendidikan', e.target.value)}
                          placeholder="Nama sekolah / universitas / institusi"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              * Pastikan seluruh data diisi dengan benar sebelum menyimpan. Data akan tersimpan langsung ke database online.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Menyimpan ke Firebase...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan & Perbarui Biodata</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
