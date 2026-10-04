export type ViolationType = 
  | 'NO_HELMET'
  | 'TRIPLE_RIDING'
  | 'MOBILE_USAGE'
  | 'WRONG_SIDE'
  | 'SIGNAL_VIOLATION';

export type ViolationStatus = 'VERIFIED' | 'PENDING_REVIEW' | 'DISMISSED';

export type DetectionSource = 
  | 'IMAGE_UPLOAD'
  | 'VIDEO_STREAM'
  | 'LIVE_CAMERA'
  | 'CCTV_NODE_01'
  | 'CCTV_NODE_02';

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectedVehicle {
  type: string;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  confidence: number;
}

export interface DetectedRider {
  index: number;
  box: [number, number, number, number];
  headBox?: [number, number, number, number];
  hasHelmet: boolean;
  helmetType?: 'full_face' | 'open_face' | 'half' | 'none';
  isUsingMobile?: boolean;
  confidence: number;
}

export interface DetectedLicensePlate {
  detected: boolean;
  text: string | null;
  box: [number, number, number, number] | null;
  confidence: number;
  ocrEngine?: string;
}

export interface DetectedViolationItem {
  type: ViolationType;
  title: string;
  description: string;
  confidence: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  legalCode: string;
  fineAmount: number;
}

export interface DetectionResult {
  engine?: string;
  vehicles: DetectedVehicle[];
  riders: DetectedRider[];
  riderCount: number;
  helmetDetected: boolean;
  licensePlate: DetectedLicensePlate;
  violations: DetectedViolationItem[];
  sceneSummary: string;
}

export interface ViolationRecord {
  id: string;
  violationType: ViolationType;
  violationTitle: string;
  vehicleNumber: string;
  confidence: number;
  date: string;
  time: string;
  timestamp: number;
  evidenceImage: string;
  source: DetectionSource;
  status: ViolationStatus;
  officerRemarks?: string;
  riderCount: number;
  helmetDetected: boolean;
  fineAmount: number;
  legalSection: string;
  location: string;
}

export interface DetectionPreset {
  id: string;
  title: string;
  tagline: string;
  violationType: ViolationType | 'COMPLIANT';
  vehicleNumber: string;
  imageDataUrl: string;
  expectedResult: DetectionResult;
}

export interface DailyReportData {
  date: string;
  totalViolations: number;
  noHelmetViolations: number;
  tripleRidingViolations: number;
  mobileUsageViolations: number;
  wrongSideViolations: number;
  totalFinesAssessed: number;
  complianceRate: string;
  verifiedCount: number;
  pendingCount: number;
}
