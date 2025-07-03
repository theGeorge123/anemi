import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CoffeeShop, MeetupInvite, User } from './types.js';

export class SupabaseMCPClient {
  private client: SupabaseClient;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  // Coffee Shop operations
  async getCoffeeShops(city?: string, priceRange?: string): Promise<CoffeeShop[]> {
    let query = this.client
      .from('CoffeeShop')
      .select('*')
      .is('deletedAt', null);

    if (city) {
      query = query.eq('city', city);
    }

    if (priceRange) {
      query = query.eq('priceRange', priceRange);
    }

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch coffee shops: ${error.message}`);
    }

    return data || [];
  }

  async getCoffeeShopById(id: string): Promise<CoffeeShop | null> {
    const { data, error } = await this.client
      .from('CoffeeShop')
      .select('*')
      .eq('id', id)
      .is('deletedAt', null)
      .single();

    if (error) {
      throw new Error(`Failed to fetch coffee shop: ${error.message}`);
    }

    return data;
  }

  async createCoffeeShop(coffeeShop: Partial<CoffeeShop>): Promise<CoffeeShop> {
    const { data, error } = await this.client
      .from('CoffeeShop')
      .insert(coffeeShop)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create coffee shop: ${error.message}`);
    }

    return data;
  }

  async updateCoffeeShop(id: string, updates: Partial<CoffeeShop>): Promise<CoffeeShop> {
    const { data, error } = await this.client
      .from('CoffeeShop')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update coffee shop: ${error.message}`);
    }

    return data;
  }

  async deleteCoffeeShop(id: string): Promise<void> {
    const { error } = await this.client
      .from('CoffeeShop')
      .update({ deletedAt: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete coffee shop: ${error.message}`);
    }
  }

  // Meetup Invite operations
  async getMeetupInvites(status?: string): Promise<MeetupInvite[]> {
    let query = this.client
      .from('MeetupInvite')
      .select('*')
      .is('deletedAt', null);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch meetup invites: ${error.message}`);
    }

    return data || [];
  }

  async getMeetupInviteByToken(token: string): Promise<MeetupInvite | null> {
    const { data, error } = await this.client
      .from('MeetupInvite')
      .select('*')
      .eq('token', token)
      .is('deletedAt', null)
      .single();

    if (error) {
      throw new Error(`Failed to fetch meetup invite: ${error.message}`);
    }

    return data;
  }

  async createMeetupInvite(invite: Partial<MeetupInvite>): Promise<MeetupInvite> {
    const { data, error } = await this.client
      .from('MeetupInvite')
      .insert(invite)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create meetup invite: ${error.message}`);
    }

    return data;
  }

  async updateMeetupInvite(id: string, updates: Partial<MeetupInvite>): Promise<MeetupInvite> {
    const { data, error } = await this.client
      .from('MeetupInvite')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update meetup invite: ${error.message}`);
    }

    return data;
  }

  async confirmMeetupInvite(token: string, inviteeName: string, inviteeEmail: string, chosenDate: string, chosenTime?: string): Promise<MeetupInvite> {
    const { data, error } = await this.client
      .from('MeetupInvite')
      .update({
        inviteeName,
        inviteeEmail,
        chosenDate,
        chosenTime,
        status: 'confirmed',
        confirmedAt: new Date().toISOString(),
      })
      .eq('token', token)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to confirm meetup invite: ${error.message}`);
    }

    return data;
  }

  // User operations
  async getUsers(): Promise<User[]> {
    const { data, error } = await this.client
      .from('User')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('User')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return data;
  }

  async createUser(user: Partial<User>): Promise<User> {
    const { data, error } = await this.client
      .from('User')
      .insert(user)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  }

  // Generic operations
  async executeSql(sql: string, params?: any[]): Promise<any> {
    const { data, error } = await this.client.rpc('exec_sql', {
      sql_query: sql,
      sql_params: params || [],
    });

    if (error) {
      throw new Error(`Failed to execute SQL: ${error.message}`);
    }

    return data;
  }

  async getTableInfo(tableName: string): Promise<any> {
    const { data, error } = await this.client
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');

    if (error) {
      throw new Error(`Failed to get table info: ${error.message}`);
    }

    return data;
  }

  async getTableCount(tableName: string): Promise<number> {
    const { count, error } = await this.client
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to get table count: ${error.message}`);
    }

    return count || 0;
  }
} 