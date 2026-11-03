import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Shield,
  FileSpreadsheet,
  FileText,
  KeyRound,
  RotateCcw,
  Sparkles,
  Wifi,
  ExternalLink,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Student, AdminConfig, DEFAULT_ADMIN_CONFIG } from './types';
import { subscribeToStudents, subscribeToAdminConfig } from './services/studentService';
import { StudentForm } from './components/StudentForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(DEFAULT_ADMIN_CONFIG);
  const [activeTab, setActiveTab] = useState<'student_form' | 'admin_dashboard'>('student_form');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_logged_in') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Subscribe to students in Firestore
  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);

    const unsubscribeStudents = subscribeToStudents(
      (data) => {
        setStudents(data);
        setIsLoading(false);
        setFetchError(null);
      },
      (err) => {
        console.error('Error fetching students:', err);
        setFetchError('Sedang menyinkronkan izin basis data Firebase. Silakan klik Coba Lagi.');
        setIsLoading(false);
      }
    );

    const unsubscribeAdmin = subscribeToAdminConfig((cfg) => {
      setAdminConfig(cfg);
    });

    // Check Firebase Auth state for Google Sign-in
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('admin_logged_in', 'true');
      }
    });

    return () => {
      unsubscribeStudents();
      unsubscribeAdmin();
      unsubscribeAuth();
    };
  }, [refreshKey]);

  const handleOpenAdminTab = () => {
    if (isAdminAuthenticated) {
      setActiveTab('admin_dashboard');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('admin_logged_in', 'true');
    setActiveTab('admin_dashboard');
  };

  const handleAdminLogout = async () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('admin_logged_in');
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setActiveTab('student_form');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & School Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                  BIODATA KELAS XII DKV
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
                  2026/2027
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Desain Komunikasi Visual • Sistem Terpadu Firebase
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('student_form')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'student_form'
                    ? 'bg-white text-blue-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Form Siswa</span>
              </button>

              <button
                onClick={handleOpenAdminTab}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin_dashboard'
                    ? 'bg-white text-blue-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Akses Admin</span>
                {isAdminAuthenticated && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            {isAdminAuthenticated && activeTab === 'admin_dashboard' && (
              <button
                onClick={handleAdminLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-200"
                title="Keluar Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-500">
              Menghubungkan ke database Firebase...
            </p>
          </div>
        ) : fetchError ? (
          <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6 animate-spin-reverse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Sinkronisasi Database</h3>
              <p className="text-xs text-slate-500 mt-1">{fetchError}</p>
            </div>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Muat Ulang Data</span>
            </button>
          </div>
        ) : activeTab === 'admin_dashboard' && isAdminAuthenticated ? (
          <AdminDashboard
            students={students}
            adminConfig={adminConfig}
            onLogout={handleAdminLogout}
            onSwitchToStudentView={() => setActiveTab('student_form')}
          />
        ) : (
          <StudentForm
            students={students}
            onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
            isAdminLoggedIn={isAdminAuthenticated}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Firebase Firestore Online • Terhubung Lintas Perangkat</span>
          </div>
          <div>
            Sistem Pendataan Biodata Siswa Kelas XII DKV © 2026/2027 • Dilengkapi Fitur Excel, PDF, Reset & Ganti Password Admin
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        adminConfig={adminConfig}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
