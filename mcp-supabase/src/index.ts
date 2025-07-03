#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { SupabaseMCPClient } from './supabase-client.js';
import { config } from './config.js';
import { Logger, formatResponse, formatError } from './utils.js';

class SupabaseMCPServer {
  private server: Server;
  private supabaseClient: SupabaseMCPClient;

  constructor() {
    this.supabaseClient = new SupabaseMCPClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    this.server = new Server(
      {
        name: 'supabase-mcp-server',
        version: '1.0.0',
      }
    );

    this.setupToolHandlers();
    Logger.info('Supabase MCP Server initialized');
  }

  private setupToolHandlers() {
    // Coffee Shop Tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      Logger.debug('Listing available tools');
      return {
        tools: [
          {
            name: 'get_coffee_shops',
            description: 'Get coffee shops with optional filtering by city and price range',
            inputSchema: {
              type: 'object',
              properties: {
                city: { type: 'string', description: 'Filter by city (Amsterdam, Rotterdam)' },
                priceRange: { 
                  type: 'string', 
                  enum: ['BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY'],
                  description: 'Filter by price range'
                },
              },
            },
          },
          {
            name: 'get_coffee_shop_by_id',
            description: 'Get a specific coffee shop by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Coffee shop ID' },
              },
              required: ['id'],
            },
          },
          {
            name: 'create_coffee_shop',
            description: 'Create a new coffee shop',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                city: { type: 'string' },
                address: { type: 'string' },
                latitude: { type: 'number' },
                longitude: { type: 'number' },
                phone: { type: 'string' },
                website: { type: 'string' },
                rating: { type: 'number' },
                reviewCount: { type: 'number' },
                priceRange: { 
                  type: 'string', 
                  enum: ['BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY']
                },
                features: { type: 'array', items: { type: 'string' } },
                hours: { type: 'object' },
                photos: { type: 'array', items: { type: 'string' } },
                isVerified: { type: 'boolean' },
              },
              required: ['name', 'city', 'address', 'latitude', 'longitude', 'priceRange'],
            },
          },
          {
            name: 'update_coffee_shop',
            description: 'Update an existing coffee shop',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Coffee shop ID' },
                updates: { type: 'object', description: 'Fields to update' },
              },
              required: ['id', 'updates'],
            },
          },
          {
            name: 'delete_coffee_shop',
            description: 'Soft delete a coffee shop',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Coffee shop ID' },
              },
              required: ['id'],
            },
          },
          // Meetup Invite Tools
          {
            name: 'get_meetup_invites',
            description: 'Get meetup invites with optional status filtering',
            inputSchema: {
              type: 'object',
              properties: {
                status: { 
                  type: 'string', 
                  enum: ['pending', 'confirmed', 'expired'],
                  description: 'Filter by invite status'
                },
              },
            },
          },
          {
            name: 'get_meetup_invite_by_token',
            description: 'Get a specific meetup invite by token',
            inputSchema: {
              type: 'object',
              properties: {
                token: { type: 'string', description: 'Invite token' },
              },
              required: ['token'],
            },
          },
          {
            name: 'create_meetup_invite',
            description: 'Create a new meetup invite',
            inputSchema: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                organizerName: { type: 'string' },
                organizerEmail: { type: 'string' },
                cafeId: { type: 'string' },
                availableDates: { type: 'array', items: { type: 'string' } },
                availableTimes: { type: 'array', items: { type: 'string' } },
                status: { type: 'string', default: 'pending' },
                expiresAt: { type: 'string' },
              },
              required: ['token', 'organizerName', 'organizerEmail', 'cafeId', 'availableDates', 'expiresAt'],
            },
          },
          {
            name: 'confirm_meetup_invite',
            description: 'Confirm a meetup invite with invitee details and chosen date/time',
            inputSchema: {
              type: 'object',
              properties: {
                token: { type: 'string', description: 'Invite token' },
                inviteeName: { type: 'string', description: 'Invitee name' },
                inviteeEmail: { type: 'string', description: 'Invitee email' },
                chosenDate: { type: 'string', description: 'Chosen date (ISO string)' },
                chosenTime: { type: 'string', description: 'Chosen time (optional)' },
              },
              required: ['token', 'inviteeName', 'inviteeEmail', 'chosenDate'],
            },
          },
          // User Tools
          {
            name: 'get_users',
            description: 'Get all users',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_user_by_id',
            description: 'Get a specific user by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'User ID' },
              },
              required: ['id'],
            },
          },
          {
            name: 'create_user',
            description: 'Create a new user',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                image: { type: 'string' },
                password: { type: 'string' },
              },
              required: ['email'],
            },
          },
          // Database Tools
          {
            name: 'execute_sql',
            description: 'Execute raw SQL query',
            inputSchema: {
              type: 'object',
              properties: {
                sql: { type: 'string', description: 'SQL query to execute' },
                params: { type: 'array', description: 'Query parameters' },
              },
              required: ['sql'],
            },
          },
          {
            name: 'get_table_info',
            description: 'Get table schema information',
            inputSchema: {
              type: 'object',
              properties: {
                tableName: { type: 'string', description: 'Table name' },
              },
              required: ['tableName'],
            },
          },
          {
            name: 'get_table_count',
            description: 'Get row count for a table',
            inputSchema: {
              type: 'object',
              properties: {
                tableName: { type: 'string', description: 'Table name' },
              },
              required: ['tableName'],
            },
          },
        ] as Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      Logger.info(`Tool called: ${name}`, args);

      try {
        switch (name) {
          case 'get_coffee_shops':
            const coffeeShops = await this.supabaseClient.getCoffeeShops(
              args?.city as string | undefined, 
              args?.priceRange as string | undefined
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(coffeeShops), null, 2),
                },
              ],
            };

          case 'get_coffee_shop_by_id':
            const coffeeShop = await this.supabaseClient.getCoffeeShopById(args?.id as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(coffeeShop), null, 2),
                },
              ],
            };

          case 'create_coffee_shop':
            const newCoffeeShop = await this.supabaseClient.createCoffeeShop(args as any);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(newCoffeeShop), null, 2),
                },
              ],
            };

          case 'update_coffee_shop':
            const updatedCoffeeShop = await this.supabaseClient.updateCoffeeShop(
              args?.id as string, 
              args?.updates as any
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(updatedCoffeeShop), null, 2),
                },
              ],
            };

          case 'delete_coffee_shop':
            await this.supabaseClient.deleteCoffeeShop(args?.id as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse({ message: 'Coffee shop deleted successfully' }), null, 2),
                },
              ],
            };

          case 'get_meetup_invites':
            const meetupInvites = await this.supabaseClient.getMeetupInvites(args?.status as string | undefined);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(meetupInvites), null, 2),
                },
              ],
            };

          case 'get_meetup_invite_by_token':
            const meetupInvite = await this.supabaseClient.getMeetupInviteByToken(args?.token as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(meetupInvite), null, 2),
                },
              ],
            };

          case 'create_meetup_invite':
            const newMeetupInvite = await this.supabaseClient.createMeetupInvite(args as any);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(newMeetupInvite), null, 2),
                },
              ],
            };

          case 'confirm_meetup_invite':
            const confirmedInvite = await this.supabaseClient.confirmMeetupInvite(
              args?.token as string,
              args?.inviteeName as string,
              args?.inviteeEmail as string,
              args?.chosenDate as string,
              args?.chosenTime as string | undefined
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(confirmedInvite), null, 2),
                },
              ],
            };

          case 'get_users':
            const users = await this.supabaseClient.getUsers();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(users), null, 2),
                },
              ],
            };

          case 'get_user_by_id':
            const user = await this.supabaseClient.getUserById(args?.id as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(user), null, 2),
                },
              ],
            };

          case 'create_user':
            const newUser = await this.supabaseClient.createUser(args as any);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(newUser), null, 2),
                },
              ],
            };

          case 'execute_sql':
            const sqlResult = await this.supabaseClient.executeSql(
              args?.sql as string, 
              args?.params as any[] | undefined
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(sqlResult), null, 2),
                },
              ],
            };

          case 'get_table_info':
            const tableInfo = await this.supabaseClient.getTableInfo(args?.tableName as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse(tableInfo), null, 2),
                },
              ],
            };

          case 'get_table_count':
            const count = await this.supabaseClient.getTableCount(args?.tableName as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(formatResponse({ count }), null, 2),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        Logger.error(`Tool execution failed: ${name}`, error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(formatError(error instanceof Error ? error : new Error('Unknown error'), name), null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    Logger.info('Supabase MCP Server running on stdio');
  }
}

// Start the server
const server = new SupabaseMCPServer();
server.run().catch((error) => {
  Logger.error('Failed to start MCP server', error);
  process.exit(1);
}); 