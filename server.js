#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { execSync, spawn } from 'child_process';

// Configuration
const SNIPPETS_DIR = process.env.APOSTROPHE_SNIPPETS_DIR || './apostrophe-snippets';
const SERVER_NAME = 'apostrophe-cms-snippets';
const SERVER_VERSION = '1.0.0';

class ApostropheCMSServer {
  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_apostrophe_snippet',
            description: 'Get ApostropheCMS code snippets by category or name',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'Snippet category (widgets, pieces, pages, modules, etc.)',
                },
                name: {
                  type: 'string',
                  description: 'Specific snippet name',
                },
              },
            },
          },
          {
            name: 'list_apostrophe_snippets',
            description: 'List available ApostropheCMS snippets by category',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'Optional category filter',
                },
              },
            },
          },
          {
            name: 'search_apostrophe_snippets',
            description: 'Search ApostropheCMS snippets by keyword',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'create_apostrophe_snippet',
            description: 'Create a new ApostropheCMS snippet with metadata',
            inputSchema: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  description: 'Type of snippet (widget, piece, page)',
                  enum: ['widget', 'piece', 'page']
                },
                title: {
                  type: 'string',
                  description: 'Title of the snippet'
                },
                description: {
                  type: 'string',
                  description: 'Description of the snippet'
                },
                code: {
                  type: 'string',
                  description: 'The actual code content of the snippet'
                },
                name: {
                  type: 'string',
                  description: 'Name of the snippet file (without extension)'
                }
              },
              required: ['type', 'title', 'description', 'code', 'name']
            },
          },
          {
            name: 'create_apostrophe_project',
            description: 'Create a new ApostropheCMS project from starter-kit-essentials',
            inputSchema: {
              type: 'object',
              properties: {
                projectPath: {
                  type: 'string',
                  description: 'Path where to create the project'
                }
              },
              required: ['projectPath']
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_apostrophe_snippet':
            return await this.getSnippet(args.category, args.name);
          case 'list_apostrophe_snippets':
            return await this.listSnippets(args.category);
          case 'search_apostrophe_snippets':
            return await this.searchSnippets(args.query);
          case 'create_apostrophe_snippet':
            return await this.createSnippet(args);
          case 'create_apostrophe_project':
            return await this.createProject(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async getSnippet(category, name) {
    if (!category && !name) {
      throw new Error('Either category or name must be provided');
    }

    const snippetPath = category 
      ? path.join(SNIPPETS_DIR, category, `${name || 'index'}.js`)
      : await this.findSnippetByName(name);

    try {
      const content = await fs.readFile(snippetPath, 'utf-8');
      const metadata = await this.getSnippetMetadata(snippetPath);
      
      return {
        content: [
          {
            type: 'text',
            text: `# ${metadata.title}\n\n${metadata.description}\n\n\`\`\`javascript\n${content}\n\`\`\``,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Snippet not found: ${snippetPath}`);
    }
  }

  async listSnippets(category) {
    const basePath = category ? path.join(SNIPPETS_DIR, category) : SNIPPETS_DIR;
    
    try {
      const items = await fs.readdir(basePath, { withFileTypes: true });
      const snippets = [];

      for (const item of items) {
        if (item.isDirectory() && !category) {
          // List categories
          snippets.push(`📁 ${item.name}/`);
        } else if (item.isFile() && item.name.endsWith('.js')) {
          const snippetPath = path.join(basePath, item.name);
          const metadata = await this.getSnippetMetadata(snippetPath);
          snippets.push(`📄 ${item.name} - ${metadata.description}`);
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `Available snippets${category ? ` in ${category}` : ''}:\n\n${snippets.join('\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Directory not found: ${basePath}`);
    }
  }

  async searchSnippets(query) {
    const results = [];
    await this.searchInDirectory(SNIPPETS_DIR, query.toLowerCase(), results);

    if (results.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No snippets found matching: ${query}`,
          },
        ],
      };
    }

    const formatted = results.map(result => 
      `📄 ${result.path} - ${result.description}\nMatch: ${result.match}`
    ).join('\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Search results for "${query}":\n\n${formatted}`,
        },
      ],
    };
  }

  async searchInDirectory(dir, query, results, relativePath = '') {
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relPath = path.join(relativePath, item.name);

        if (item.isDirectory()) {
          await this.searchInDirectory(fullPath, query, results, relPath);
        } else if (item.isFile() && item.name.endsWith('.js')) {
          const content = await fs.readFile(fullPath, 'utf-8');
          const metadata = await this.getSnippetMetadata(fullPath);
          
          if (
            item.name.toLowerCase().includes(query) ||
            content.toLowerCase().includes(query) ||
            metadata.description.toLowerCase().includes(query)
          ) {
            const lines = content.split('\n');
            const matchLine = lines.find(line => line.toLowerCase().includes(query)) || '';
            
            results.push({
              path: relPath,
              description: metadata.description,
              match: matchLine.trim().substring(0, 100) + (matchLine.length > 100 ? '...' : ''),
            });
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }

  async findSnippetByName(name) {
    // Search for snippet by name across all categories
    const searchPath = async (dir) => {
      try {
        const items = await fs.readdir(dir, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          
          if (item.isDirectory()) {
            const found = await searchPath(fullPath);
            if (found) return found;
          } else if (item.isFile() && item.name === `${name}.js`) {
            return fullPath;
          }
        }
      } catch (error) {
        // Directory doesn't exist or can't be read
      }
      return null;
    };

    const found = await searchPath(SNIPPETS_DIR);
    if (!found) {
      throw new Error(`Snippet '${name}' not found`);
    }
    return found;
  }

  async createSnippet({ type, title, description, code, name }) {
    const targetDir = path.join(SNIPPETS_DIR, `${type}s`);
    const snippetPath = path.join(targetDir, `${name}.js`);

    try {
      // Ensure the directory exists
      await fs.mkdir(targetDir, { recursive: true });

      // Check if file already exists
      try {
        await fs.access(snippetPath);
        throw new Error(`Snippet '${name}' already exists in ${type}s directory`);
      } catch (err) {
        // File doesn't exist, which is what we want
      }

      // Format the content with metadata
      const content = [
        `// @title ${title}`,
        `// @description ${description}`,
        '',
        code
      ].join('\n');

      // Write the file
      await fs.writeFile(snippetPath, content, 'utf-8');

      return {
        content: [
          {
            type: 'text',
            text: `Successfully created snippet: ${snippetPath}\n\n\`\`\`javascript\n${content}\n\`\`\``,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create snippet: ${error.message}`);
    }
  }

  async getSnippetMetadata(snippetPath) {
    try {
      const content = await fs.readFile(snippetPath, 'utf-8');
      const lines = content.split('\n');
      
      // Extract metadata from comments at the top of the file
      let title = path.basename(snippetPath, '.js');
      let description = 'ApostropheCMS code snippet';
      
      for (const line of lines) {
        if (line.startsWith('// @title')) {
          title = line.replace('// @title', '').trim();
        } else if (line.startsWith('// @description')) {
          description = line.replace('// @description', '').trim();
        } else if (!line.startsWith('//') && line.trim()) {
          break; // Stop at first non-comment line
        }
      }
      
      return { title, description };
    } catch (error) {
      return {
        title: path.basename(snippetPath, '.js'),
        description: 'ApostropheCMS code snippet'
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ApostropheCMS MCP server running on stdio');
  }

  async createProject({ projectPath }) {
    try {
      // Clone the starter kit
      execSync(`git clone https://github.com/apostrophecms/starter-kit-essentials ${projectPath}`, {
        stdio: 'inherit'
      });

      return {
        content: [
          {
            type: 'text',
            text: `ApostropheCMS project cloned successfully!

Next steps:
1. Open terminal and navigate to the project:
   cd ${projectPath}

2. Install dependencies:
   npm install

3. Create admin user (you'll be prompted for password):
   node app @apostrophecms/user:add admin admin

4. Start the development server:
   npm run dev

Once started, access the admin area at: http://localhost:3000/login
Username: admin`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create ApostropheCMS project: ${error.message}`);
    }
  }
}

const server = new ApostropheCMSServer();
server.run().catch(console.error);
