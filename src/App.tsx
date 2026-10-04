/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavTab, Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DetectionStudioView } from './components/DetectionStudioView';
import { LiveCameraView } from './components/LiveCameraView';
import { ViolationsHistoryView } from './components/ViolationsHistoryView';
import { ReportsView } from './components/ReportsView';
import { EvidenceModal } from './components/EvidenceModal';
import { ChallanModal } from './components/ChallanModal';
import { LoginModal } from './components/LoginModal';
import { ViolationRecord } from './types';
import { fetchViolations, createViolationRecord } from './services/api';
import { Bell, ShieldAlert, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Modals state
  const [selectedEvidenceViolation, setSelectedEvidenceViolation] = useState<ViolationRecord | null>(null);
  const [selectedChallanViolation, setSelectedChallanViolation] = useState<ViolationRecord | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('Traffic Officer #402');
  const [alertBanner, setAlertBanner] = useState<{ message: string; record: ViolationRecord } | null>(null);

  // Check for /all-access route on initial load
  useEffect(() => {
    const isAllAccess = window.location.pathname.includes('/all-access') || window.location.search.includes('access=all');
    if (isAllAccess) {
      setUserRole('System Administrator');
    }
  }, []);

  // Fetch initial violations
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchViolations();
        setViolations(data);
      } catch (err) {
        console.error('Error loading initial violations:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update violation record
  const handleUpdateRecord = (updated: ViolationRecord) => {
    setViolations((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    if (selectedEvidenceViolation?.id === updated.id) {
      setSelectedEvidenceViolation(updated);
    }
  };

  // Delete violation record
  const handleDeleteRecord = (id: string) => {
    setViolations((prev) => prev.filter((v) => v.id !== id));
    if (selectedEvidenceViolation?.id === id) {
      setSelectedEvidenceViolation(null);
    }
  };

  // Add newly detected violation
  const handleViolationCreated = (newRecord: ViolationRecord) => {
    setViolations((prev) => [newRecord, ...prev]);
  };

  // Simulate incoming live alert
  const handleSimulateAlert = async () => {
    const mockPlates = ['MH12AB1234', 'DL01CZ8899', 'KA03XY4521', 'MH14CD5678'];
    const plate = mockPlates[Math.floor(Math.random() * mockPlates.length)];
    
    const newRecord = await createViolationRecord({
      violationType: 'NO_HELMET',
      violationTitle: 'Real-time Camera Detection: Bareheaded Rider',
      vehicleNumber: plate,
      confidence: 0.96,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 8),
      source: 'CCTV_NODE_01',
      location: 'Shivaji Chowk Junction (CCTV-01)',
      fineAmount: 1000,
      legalSection: 'Section 129 / 194D Motor Vehicles Act',
      riderCount: 1,
      helmetDetected: false,
    });

    setViolations((prev) => [newRecord, ...prev]);
    setAlertBanner({
      message: `ALERT: No Helmet Violation Flagged on ${plate} at Shivaji Chowk Junction`,
      record: newRecord,
    });

    // Auto dismiss banner after 8s
    setTimeout(() => {
      setAlertBanner(null);
    }, 8000);
  };

  const pendingCount = violations.filter((v) => v.status === 'PENDING_REVIEW').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingViolationsCount={pendingCount}
        userRole={userRole}
        onToggleRole={() => setShowLoginModal(true)}
        onSimulateAlert={handleSimulateAlert}
      />

      {/* Floating Simulated Alert Toast */}
      {alertBanner && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-bounce sm:animate-none">
          <div className="p-4 rounded-xl bg-red-950/95 border-2 border-red-600 shadow-2xl backdrop-blur-md flex items-start justify-between gap-3 text-red-200">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">
                  REAL-TIME TRAFFIC VIOLATION TRIGGER
                </span>
                <span className="text-xs text-red-200 block mt-0.5">
                  {alertBanner.message}
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedEvidenceViolation(alertBanner.record);
                      setAlertBanner(null);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded bg-red-600 hover:bg-red-500 text-white transition-colors"
                  >
                    Inspect Evidence
                  </button>
                  <button
                    onClick={() => {
                      setSelectedChallanViolation(alertBanner.record);
                      setAlertBanner(null);
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium rounded bg-red-900/60 hover:bg-red-900 text-red-200 transition-colors"
                  >
                    Issue e-Challan
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setAlertBanner(null)}
              className="text-red-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <span className="text-xs font-mono">Initializing RoadWatch AI Surveillance Engine...</span>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                violations={violations}
                onSelectViolation={setSelectedEvidenceViolation}
                onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
              />
            )}

            {currentTab === 'studio' && (
              <DetectionStudioView
                onViolationCreated={handleViolationCreated}
                onOpenChallan={setSelectedChallanViolation}
              />
            )}

            {currentTab === 'live' && (
              <LiveCameraView
                onViolationCreated={handleViolationCreated}
                onOpenChallan={setSelectedChallanViolation}
              />
            )}

            {currentTab === 'violations' && (
              <ViolationsHistoryView
                violations={violations}
                onSelectViolation={setSelectedEvidenceViolation}
                onOpenChallan={setSelectedChallanViolation}
                onUpdateRecord={handleUpdateRecord}
                onDeleteRecord={handleDeleteRecord}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                violations={violations}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <EvidenceModal
        violation={selectedEvidenceViolation}
        onClose={() => setSelectedEvidenceViolation(null)}
        onUpdateRecord={handleUpdateRecord}
        onOpenChallan={setSelectedChallanViolation}
      />

      <ChallanModal
        violation={selectedChallanViolation}
        onClose={() => setSelectedChallanViolation(null)}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={(role) => {
          setUserRole(role);
          setShowLoginModal(false);
        }}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 sm:px-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RoadWatch AI · Helmet and Road-Safety Violation Detection System</span>
          <span className="font-mono text-[11px]">
            Deep Learning Vision Inference · ISO 39001 Compliant · 2026
          </span>
        </div>
      </footer>

    </div>
  );
}
