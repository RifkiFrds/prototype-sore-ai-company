import { SessionStore } from '../state/session.store';
import { ApiService } from './api.service';

export class SessionService {
  /**
   * Retrieves the active session ID for a user.
   */
  public static getSession(userId: string): string | undefined {
    return SessionStore.getSession(userId);
  }

  /**
   * Caches a session ID for a user.
   */
  public static setSession(userId: string, sessionId: string): void {
    SessionStore.setSession(userId, sessionId);
  }

  /**
   * Clears the active session for a user.
   */
  public static clearSession(userId: string): void {
    SessionStore.clearSession(userId);
  }

  /**
   * Retrieves the active session ID or creates a new one if it doesn't exist.
   */
  public static async getOrCreateSession(userId: string, username: string): Promise<string> {
    const existingSessionId = this.getSession(userId);
    if (existingSessionId) {
      return existingSessionId;
    }

    // Create a new session on the backend
    const title = `Session - ${username} (${new Date().toLocaleTimeString()})`;
    const session = await ApiService.createSession(title);
    
    this.setSession(userId, session.id);
    return session.id;
  }
}
