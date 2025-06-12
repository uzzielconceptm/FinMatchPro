import { Pool, Client } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
  return res;
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}

// User management functions
export interface UserProfile {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  company?: string;
  user_type: 'solo' | 'accountant';
  monthly_expenses?: string;
  current_tool?: string;
  plan_type?: 'monthly' | 'annual';
  client_count?: string;
  phone_number?: string;
  referral_source?: string;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export async function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  userType: 'solo' | 'accountant';
  monthlyExpenses?: string;
  currentTool?: string;
  planType?: 'monthly' | 'annual';
  clientCount?: string;
  phoneNumber?: string;
  referralSource?: string;
  marketingEmails?: boolean;
}): Promise<UserProfile> {
  const passwordHash = await bcrypt.hash(userData.password, 10);
  
  const result = await query(`
    INSERT INTO user_profiles (
      email, password_hash, first_name, last_name, company, user_type,
      monthly_expenses, current_tool, plan_type, client_count,
      phone_number, referral_source, marketing_emails
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `, [
    userData.email,
    passwordHash,
    userData.firstName,
    userData.lastName,
    userData.company || null,
    userData.userType,
    userData.monthlyExpenses || null,
    userData.currentTool || null,
    userData.planType || null,
    userData.clientCount || null,
    userData.phoneNumber || null,
    userData.referralSource || null,
    userData.marketingEmails || false
  ]);

  return result.rows[0];
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const result = await query('SELECT * FROM user_profiles WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function getUserById(id: string): Promise<UserProfile | null> {
  const result = await query('SELECT * FROM user_profiles WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Receipt management
export interface Receipt {
  id: string;
  user_id: string;
  vendor: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  description?: string;
  receipt_url?: string;
  bank_transaction_id?: string;
  matched: boolean;
  created_at: string;
  updated_at: string;
}

export async function createReceipt(receiptData: {
  userId: string;
  vendor: string;
  amount: number;
  currency?: string;
  date: string;
  category: string;
  description?: string;
  receiptUrl?: string;
}): Promise<Receipt> {
  const result = await query(`
    INSERT INTO receipts (user_id, vendor, amount, currency, date, category, description, receipt_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [
    receiptData.userId,
    receiptData.vendor,
    receiptData.amount,
    receiptData.currency || 'USD',
    receiptData.date,
    receiptData.category,
    receiptData.description || null,
    receiptData.receiptUrl || null
  ]);

  return result.rows[0];
}

export async function getUserReceipts(userId: string, limit = 50, offset = 0): Promise<Receipt[]> {
  const result = await query(`
    SELECT * FROM receipts 
    WHERE user_id = $1 
    ORDER BY date DESC, created_at DESC
    LIMIT $2 OFFSET $3
  `, [userId, limit, offset]);

  return result.rows;
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

export default pool;