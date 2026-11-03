import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  RotateCcw,
  KeyRound,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  GraduationCap,
  School,
  Share2,
  LogOut,
  Phone,
  ChevronDown,
  ChevronUp,
  Shield,
  Copy,
  Check
} from 'lucide-react';
import { Student, AdminConfig } from '../types';
import { deleteStudent } from '../services/studentService';
import { exportStudentsToExcel, exportStudentsToPdf, printSingleStudentBiodata } from '../utils/exportUtils';
import { ChangePasswordModal } from './ChangePasswordModal';
import { ResetDataModal } from './ResetDataModal';
import { StudentEditModal } from './StudentEditModal';

interface AdminDashboardProps {
  students: Student[];
  adminConfig: AdminConfig;
  onLogout: () => void;
  onSwitchToStudentView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  adminConfig,
  onLogout,
  onSwitchToStudentView,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Statistics
  const totalStudents = students.length;
  const completedCount = students.filter((s) => s.isCompleted).length;
  const pendingCount = totalStudents - completedCount;
  const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;

  // Siblings stats
  let totalSiblings = 0;
  let siblingsInSchool = 0;
  let siblingsGraduated = 0;
  students.forEach((s) => {
    (s.saudara || []).forEach((sib) => {
      if (sib.nama && sib.nama.trim() !== '') {
        totalSiblings += 1;
        if (sib.statusPendidikan === 'Masih Sekolah') siblingsInSchool += 1;
        if (sib.statusPendidikan === 'Sudah Tamat Sekolah') siblingsGraduated += 1;
      }
    });
  });

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.alamat.toLowerCase().includes(search.toLowerCase()) ||
      s.tempatLahir.toLowerCase().includes(search.toLowerCase()) ||
      s.noHp.includes(search) ||
      s.namaWali.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'completed') return s.isCompleted;
    if (statusFilter === 'pending') return !s.isCompleted;
    return true;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  const handleCopyClassFormLink = () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(cleanUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-wide uppercase">
              Dashboard Administrator
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              Firebase Terhubung
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Laporan Biodata Siswa Kelas XII DKV
          </h1>
          <p className="text-sm text-slate-500">
            Tahun Ajaran 2026/2027 • Unduh laporan Excel/PDF, kelola entri, dan ganti password administrator.
          </p>
        </div>

        {/* Top Control Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportStudentsToExcel(students)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Unduh Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => exportStudentsToPdf(students)}
            className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Unduh PDF (.pdf)</span>
          </button>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border border-slate-200"
            title="Ganti Password Admin"
          >
            <KeyRound className="w-4 h-4 text-blue-700" />
            <span className="hidden sm:inline">Ganti Password</span>
          </button>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border border-red-200"
            title="Reset Data Siswa"
          >
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition flex items-center gap-1 border border-slate-200"
            title="Keluar Admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Siswa</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalStudents}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Siswa terdaftar di kelas</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Biodata Lengkap</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{completedCount}</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">{completionRate}% kelengkapan data</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Belum Lengkap</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Perlu konfirmasi siswa</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Saudara Masih Sekolah</span>
            <School className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{siblingsInSchool}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Tingkat SD, SMP, SMA, Kuliah</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Saudara Sudah Tamat</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700">{siblingsGraduated}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Alumni / sudah lulus</p>
        </div>
      </div>

      {/* Table Toolbar & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, alamat, tempat lahir, no HP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">Semua Status ({totalStudents})</option>
              <option value="completed">Sudah Lengkap ({completedCount})</option>
              <option value="pending">Belum Lengkap ({pendingCount})</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyClassFormLink}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            title="Salin link formulir siswa untuk dibagikan ke WhatsApp grup kelas"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link Formulir Siswa'}</span>
          </button>

          <button
            onClick={() => {
              setSelectedStudentForEdit(null);
              setIsEditModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Main Table Matching Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800 text-white font-semibold">
                <th className="py-3 px-3 w-12 text-center border-r border-slate-700">NO</th>
                <th className="py-3 px-4 min-w-[180px] border-r border-slate-700">NAMA SISWA</th>
                <th className="py-3 px-4 min-w-[140px] border-r border-slate-700">TEMPAT & TGL LAHIR</th>
                <th className="py-3 px-4 min-w-[180px] border-r border-slate-700">ALAMAT</th>
                <th className="py-3 px-3 min-w-[130px] border-r border-slate-700">NO HP / WA SISWA</th>
                <th className="py-3 px-4 min-w-[160px] border-r border-slate-700">NAMA & HP WALI</th>
                <th className="py-3 px-3 text-center border-r border-slate-700">JML SDR</th>
                <th className="py-3 px-4 min-w-[240px] border-r border-slate-700">
                  RINCIAN SAUDARA (STATUS PENDIDIKAN)
                </th>
                <th className="py-3 px-3 text-center min-w-[120px]">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada siswa yang sesuai dengan filter atau pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const isExpanded = expandedStudentId === s.id;
                  const activeSiblings = (s.saudara || []).filter((sib) => sib.nama && sib.nama.trim() !== '');

                  return (
                    <React.Fragment key={s.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-700 border-r border-slate-100">
                          {s.no}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100">
                          <div className="font-bold text-slate-900">{s.nama}</div>
                          <div className="mt-0.5">
                            {s.isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Lengkap</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Belum Lengkap</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100 text-slate-600">
                          <div className="font-medium text-slate-800">{s.tempatLahir || '-'}</div>
                          <div className="text-[11px] text-slate-500">{s.tanggalLahir || '-'}</div>
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100 text-slate-600 max-w-[220px]">
                          <p className="line-clamp-2">{s.alamat || '-'}</p>
                        </td>
                        <td className="py-3 px-3 border-r border-slate-100 text-slate-700">
                          {s.noHp ? (
                            <a
                              href={`https://wa.me/${s.noHp.replace(/^0/, '62').replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 font-medium hover:underline inline-flex items-center gap-1"
                              title="Hubungi via WhatsApp"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{s.noHp}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100 text-slate-700">
                          <div className="font-medium text-slate-900">{s.namaWali || '-'}</div>
                          {s.noHpWali && (
                            <div className="text-[11px] text-slate-500">WA: {s.noHpWali}</div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-100 font-bold text-slate-800">
                          {s.jumlahSaudara || 0}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100">
                          {activeSiblings.length === 0 ? (
                            <span className="text-slate-400 text-[11px]">Belum ada rincian saudara</span>
                          ) : (
                            <div className="space-y-1">
                              {activeSiblings.slice(0, isExpanded ? 5 : 2).map((sib, i) => (
                                <div key={i} className="flex items-center justify-between gap-1 text-[11px]">
                                  <span className="font-medium text-slate-800 truncate max-w-[120px]">
                                    {sib.no}. {sib.nama}
                                  </span>
                                  {sib.statusPendidikan === 'Masih Sekolah' && (
                                    <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">
                                      Sekolah
                                    </span>
                                  )}
                                  {sib.statusPendidikan === 'Sudah Tamat Sekolah' && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                                      Tamat
                                    </span>
                                  )}
                                </div>
                              ))}
                              {activeSiblings.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => setExpandedStudentId(isExpanded ? null : s.id)}
                                  className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-3 h-3" />
                                      <span>Tutup Rincian</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3 h-3" />
                                      <span>Lihat {activeSiblings.length - 2} saudara lagi</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => printSingleStudentBiodata(s)}
                              title="Cetak Biodata Siswa (.pdf)"
                              className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentForEdit(s);
                                setIsEditModalOpen(true);
                              }}
                              title="Edit Data Siswa"
                              className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(s.id)}
                              title="Hapus Siswa"
                              className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable row for full sibling details if selected */}
                      {isExpanded && activeSiblings.length > 0 && (
                        <tr className="bg-blue-50/40">
                          <td colSpan={9} className="p-4 border-b border-blue-100">
                            <div className="text-xs font-bold text-blue-900 mb-2">
                              Rincian Lengkap Saudara Siswa: {s.nama}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {activeSiblings.map((sib) => (
                                <div
                                  key={sib.no}
                                  className="p-2.5 bg-white border border-blue-200 rounded-xl text-xs"
                                >
                                  <div className="font-semibold text-slate-800">
                                    Saudara ke-{sib.no}: {sib.nama}
                                  </div>
                                  <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1.5">
                                    <span className="font-medium">Status:</span>
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                        sib.statusPendidikan === 'Masih Sekolah'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-emerald-100 text-emerald-800'
                                      }`}
                                    >
                                      {sib.statusPendidikan || '-'}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-600 mt-0.5">
                                    <span className="font-medium">Tempat Pendidikan:</span>{' '}
                                    {sib.tempatPendidikan || '-'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Konfirmasi Hapus</h3>
            <p className="text-sm text-slate-600">
              Apakah Anda yakin ingin menghapus data siswa ini secara permanen dari Firebase?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border rounded-xl text-sm font-medium text-slate-700"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        adminConfig={adminConfig}
      />

      <ResetDataModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />

      <StudentEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudentForEdit}
        nextRollNo={students.length > 0 ? Math.max(...students.map((s) => s.no)) + 1 : 1}
      />
    </div>
  );
};
