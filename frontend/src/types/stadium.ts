// src/types/stadium.ts

// 1. User
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "volunteer" | "admin";
  createdAt: string;
}

// 2. Volunteer
export interface Volunteer extends User {
  assignedTasks: string[];
  isAvailable: boolean;
  currentLocation?: string;
  contactNumber?: string;
}

// 3. Crowd Data
export interface GateFlow {
  gateId: string;
  gateName: string;
  currentFlowRate: number; // people per minute
  capacityLimit: number;
  status: "clear" | "normal" | "congested" | "restricted";
}

export interface CrowdTelemetry {
  timestamp: string;
  totalAttendance: number;
  overallDensityIndex: number; // scale 0-100
  status: "clear" | "normal" | "congested" | "emergency";
  gates: GateFlow[];
}

// 4. Parking
export interface ParkingSpace {
  lotId: string;
  name: string;
  totalSpaces: number;
  availableSpaces: number;
  fillPercentage: number;
  status: "open" | "full" | "closed";
  accessibleSpacesCount: number;
}

// 5. Queue
export interface AlternativeStand {
  poiId: string;
  poiName: string;
  waitMinutes: number;
  distanceMeters: number;
}

export interface QueueMetric {
  poiId: string;
  poiName: string;
  poiType: "gate" | "concession" | "restroom";
  currentWaitMinutes: number;
  predictedWait15Min: number;
  predictedWait30Min: number;
  trend: "rising" | "stable" | "falling";
  queueLength: number;
  alternatives: AlternativeStand[];
}

// 6. Emergency
export interface EmergencyIncident {
  id: string;
  type: "medical" | "security" | "fire" | "structural";
  locationDescription: string;
  status: "active" | "resolved";
  contactPhone?: string;
  timestamp: string;
  resolvedAt?: string;
}

// 7. Transport
export interface TransitAlternative {
  routeNumber: string;
  destination: string;
  type: "subway" | "bus" | "shuttle" | "train";
  nextDepartureMinutes: number;
  status: "on-time" | "delayed" | "crowded";
}

// 8. AI Chat
export interface ChatMessage {
  id?: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// 9. Waste
export interface WasteBin {
  binId: string;
  type: "recycling" | "compost" | "landfill";
  fillPercentage: number;
  locationDescription: string;
}

// 10. Accessibility
export interface WheelchairEscortRequest {
  requestId: string;
  userLocation: string;
  userPhone: string;
  status: "requested" | "dispatched" | "completed";
  assignedVolunteerId?: string;
  specialNotes?: string;
  createdAt: string;
}

export interface AccessibilityFacility {
  id: string;
  facilityName: string;
  type: "elevator" | "ramp" | "sensory-room";
  status: "operational" | "maintenance";
  alternativeInstructions?: string;
}

// 11. Reports
export interface OperationsReport {
  reportId: string;
  title: string;
  type: "crowd" | "queue" | "carbon" | "emergency";
  generatedAt: string;
  downloadUrl: string;
  fileSizeKb: number;
}

// 12. Weather
export interface WeatherTelemetry {
  temperatureCelsius: number;
  condition: string; // e.g. "Sunny", "Storming"
  humidityPercentage: number;
  windKmh: number;
  uvIndex: number;
  isSevereWarningActive: boolean;
  severeWarningDescription?: string;
}
