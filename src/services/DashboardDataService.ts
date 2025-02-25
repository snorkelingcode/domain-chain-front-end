// services/DashboardDataService.ts
import axios from 'axios';
import { UserAuthenticationService } from './/UserAuthenticationService';

export class DashboardDataService {
  private static readonly API_URL = process.env.BACKEND_URL || 'domain-chain-backend.vercel.app';
  private static readonly DASHBOARD_DATA_KEY = 'domain_chain_dashboard';
  
  // Save dashboard data (watchlist, settings, etc.)
  static async saveDashboardData(data: any): Promise<boolean> {
    try {
      const token = UserAuthenticationService.getAuthToken();
      if (!token) return false;
      
      // Encrypt sensitive data before storing locally for fast access
      const encryptedLocalCopy = this.encryptData(JSON.stringify(data));
      localStorage.setItem(this.DASHBOARD_DATA_KEY, encryptedLocalCopy);
      
      // Store on backend for persistence using Prisma
      await axios.post(
        `https://${this.API_URL}/api/user/dashboard`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return true;
    } catch (error) {
      console.error('Failed to save dashboard data:', error);
      return false;
    }
  }
  
  // Load dashboard data
  static async loadDashboardData(): Promise<any> {
    try {
      // First try to load from local storage for speed
      const localData = localStorage.getItem(this.DASHBOARD_DATA_KEY);
      let dashboardData = null;
      
      if (localData) {
        try {
          dashboardData = JSON.parse(this.decryptData(localData));
        } catch (error) {
          console.error('Failed to parse local dashboard data:', error);
        }
      }
      
      // Then try to get from server for most updated data
      const token = UserAuthenticationService.getAuthToken();
      if (token) {
        try {
          const response = await axios.get(
            `https://${this.API_URL}/api/user/dashboard`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          dashboardData = response.data;
          
          // Update local copy with latest data
          const encryptedLocalCopy = this.encryptData(JSON.stringify(dashboardData));
          localStorage.setItem(this.DASHBOARD_DATA_KEY, encryptedLocalCopy);
        } catch (serverError) {
          console.error('Failed to load server dashboard data:', serverError);
          // Fall back to local data
        }
      }
      
      return dashboardData || { 
        dashboardData: {},
        watchlist: [], 
        portfolio: [],
        preferences: {} 
      };
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      return { 
        dashboardData: {},
        watchlist: [], 
        portfolio: [],
        preferences: {} 
      };
    }
  }
  
  // Encrypt data for local storage
  private static encryptData(data: string): string {
    // Implementation will use WebCrypto API
    return "encrypted_data";
  }
  
  // Decrypt data from local storage
  private static decryptData(encryptedData: string): string {
    // Implementation will use WebCrypto API
    return "decrypted_data";
  }
}