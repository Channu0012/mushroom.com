/**
 * Shared TypeScript types for the Mushroom Marketplace.
 * Used by both frontend and backend for type safety.
 */

// =============================================================================
// ENUMS (mirror Prisma enums)
// =============================================================================

export enum UserRole {
  GROWER = 'GROWER',
  B2B_BUYER = 'B2B_BUYER',
  CONSUMER = 'CONSUMER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  MORE_INFO_REQUIRED = 'MORE_INFO_REQUIRED',
}

export enum ListingStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  SOLD_OUT = 'SOLD_OUT',
  EXPIRED = 'EXPIRED',
  REMOVED = 'REMOVED',
}

export enum FulfillmentMethod {
  PICKUP = 'PICKUP',
  SELLER_DELIVERY = 'SELLER_DELIVERY',
  BOTH = 'BOTH',
  THIRD_PARTY_LOGISTICS = 'THIRD_PARTY_LOGISTICS',
}

export enum RequirementFrequency {
  ONE_TIME = 'ONE_TIME',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM',
}

export enum RequirementStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  FULFILLED = 'FULFILLED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COUNTERED = 'COUNTERED',
  EXPIRED = 'EXPIRED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
}

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  ON_HOLD = 'ON_HOLD',
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED',
  CLOSED = 'CLOSED',
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPS_ADMIN = 'OPS_ADMIN',
  VERIFICATION_ADMIN = 'VERIFICATION_ADMIN',
  SUPPORT_ADMIN = 'SUPPORT_ADMIN',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
}

// =============================================================================
// COMMON
// =============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// USER / AUTH TYPES
// =============================================================================

export interface UserPublic {
  id: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  city?: string;
  state?: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number; // seconds
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// =============================================================================
// LISTING TYPES
// =============================================================================

export interface ListingFilters extends PaginationQuery {
  mushroomTypeId?: string;
  mushroomTypeSlug?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  fulfillmentMethod?: FulfillmentMethod;
  verifiedOnly?: boolean;
  isB2b?: boolean;
  isB2c?: boolean;
  q?: string; // full text search
}

// =============================================================================
// REQUIREMENT TYPES
// =============================================================================

export interface RequirementFilters extends PaginationQuery {
  mushroomTypeId?: string;
  city?: string;
  state?: string;
  frequency?: RequirementFrequency;
  minQuantity?: number;
  maxBudget?: number;
  q?: string;
}

// =============================================================================
// ORDER TYPES
// =============================================================================

export interface OrderCalculation {
  quantityKg: number;
  unitPrice: number;
  subtotal: number;
  commissionRate: number;
  commissionAmount: number;
  taxes: number;
  totalAmount: number;
  currency: string;
}

// =============================================================================
// PAYMENT TYPES
// =============================================================================

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  orderId: string; // our internal order ID
}

export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string; // our internal order ID
}

// =============================================================================
// MARKETPLACE ANALYTICS TYPES
// =============================================================================

export interface MarketplaceMetrics {
  gmv: number;
  totalOrders: number;
  completedOrders: number;
  activeGrowers: number;
  activeBuyers: number;
  activeListings: number;
  activeRequirements: number;
  pendingVerifications: number;
  openDisputes: number;
  platformRevenue: number;
  averageOrderValue: number;
  repeatOrderRate: number;
}
