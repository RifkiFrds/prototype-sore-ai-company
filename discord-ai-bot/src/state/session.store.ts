export class SessionStore {
  private static store = new Map<string, string>();

  public static getSession(userId: string): string | undefined {
    return this.store.get(userId);
  }

  public static setSession(userId: string, sessionId: string): void {
    this.store.set(userId, sessionId);
  }

  public static clearSession(userId: string): void {
    this.store.delete(userId);
  }
}
