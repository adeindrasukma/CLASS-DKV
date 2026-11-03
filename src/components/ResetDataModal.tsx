import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, X, Check, Trash2, ListRestart } from 'lucide-react';
import { resetData } from '../services/studentService';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetDataModal: React.FC<ResetDataModalProps> = ({ isOpen, onClose }) => {
  const [selectedMode, setSelectedMode] = useState<'reset_default' | 'clear_fields' | 'delete_all'>('reset_default');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const isConfirmed = confirmText.trim().toUpperCase() === 'RESET';

  const handleExecuteReset = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setError(null);

    try {
      await resetData(selectedMode);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setConfirmText('');
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Gagal mereset data siswa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <RotateCcw className="w-5 h-5 text-red-100" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Reset Data Sistem</h3>
              <p className="text-xs text-red-100">Tindakan ini memerlukan konfirmasi keamanan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center space-x-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Data berhasil direset sesuai pilihan Anda!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Pilih Jenis Tindakan Reset:
            </label>
            <div className="space-y-2.5">
              <label
                className={`flex items-start p-3.5 border-2 rounded-xl cursor-pointer transition ${
                  selectedMode === 'reset_default'
                    ? 'border-red-500 bg-red-50/40 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="resetMode"
                  value="reset_default"
                  checked={selectedMode === 'reset_default'}
                  onChange={() => setSelectedMode('reset_default')}
                  className="mt-1 mr-3 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="font-semibold text-sm flex items-center gap-1.5">
                    <ListRestart className="w-4 h-4 text-red-600" />
                    <span>Kembalikan ke 13 Siswa Asli (Sesuai Dokumen PDF)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Menghapus data saat ini dan mengembalikan daftar 13 nama siswa kelas XII DKV (Aura Candra Dewi s/d Trinetta Angelica) dalam keadaan kolom biodata belum terisi.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start p-3.5 border-2 rounded-xl cursor-pointer transition ${
                  selectedMode === 'clear_fields'
                    ? 'border-red-500 bg-red-50/40 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="resetMode"
                  value="clear_fields"
                  checked={selectedMode === 'clear_fields'}
                  onChange={() => setSelectedMode('clear_fields')}
                  className="mt-1 mr-3 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="font-semibold text-sm flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <span>Kosongkan Isian Biodata Siswa</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mempertahankan daftar nama siswa yang ada sekarang, tetapi mengosongkan seluruh kolom isian biodata, orang tua/wali, dan data saudara.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start p-3.5 border-2 rounded-xl cursor-pointer transition ${
                  selectedMode === 'delete_all'
                    ? 'border-red-500 bg-red-50/40 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="resetMode"
                  value="delete_all"
                  checked={selectedMode === 'delete_all'}
                  onChange={() => setSelectedMode('delete_all')}
                  className="mt-1 mr-3 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="font-semibold text-sm flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-red-700" />
                    <span>Hapus Seluruh Data Siswa (Tabel Kosong)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Menghapus seluruh entri siswa dari database tanpa sisa.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-900">Konfirmasi Penghapusan</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Ketik kata <span className="font-mono font-bold bg-amber-200 px-1.5 py-0.5 rounded text-amber-900">RESET</span> di bawah ini untuk membuka tombol eksekusi:
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Ketik RESET disini"
                  className="mt-2.5 w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-semibold tracking-wider text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExecuteReset}
              disabled={!isConfirmed || loading || success}
              className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs flex items-center space-x-2"
            >
              {loading ? (
                <span>Memproses Reset...</span>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Jalankan Reset Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
