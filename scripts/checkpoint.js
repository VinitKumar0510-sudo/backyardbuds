#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const CHECKPOINTS_DIR = path.join(__dirname, '../checkpoints');

async function createCheckpoint() {
  try {
    // Ensure checkpoints directory exists
    try {
      await fs.access(CHECKPOINTS_DIR);
    } catch {
      await fs.mkdir(CHECKPOINTS_DIR, { recursive: true });
    }

    const checkpointId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Get current git status if available
    let gitInfo = {};
    try {
      const { execSync } = require('child_process');
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
      
      gitInfo = {
        branch,
        commit: commit.substring(0, 8),
        hasChanges: status.length > 0,
        status: status
      };
    } catch (error) {
      console.log('Git information not available');
    }

    const checkpointData = {
      id: checkpointId,
      timestamp: timestamp,
      type: 'manual',
      git: gitInfo,
      description: process.argv[2] || 'Manual checkpoint',
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        cwd: process.cwd()
      }
    };

    const filename = `${checkpointId}.checkpoint.json`;
    const filepath = path.join(CHECKPOINTS_DIR, filename);
    
    await fs.writeFile(filepath, JSON.stringify(checkpointData, null, 2));
    
    console.log(`✓ Checkpoint created: ${checkpointId}`);
    console.log(`  File: ${filename}`);
    console.log(`  Time: ${timestamp}`);
    if (gitInfo.branch) {
      console.log(`  Git: ${gitInfo.branch}@${gitInfo.commit}${gitInfo.hasChanges ? ' (dirty)' : ''}`);
    }
    
    return checkpointId;
    
  } catch (error) {
    console.error('Error creating checkpoint:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createCheckpoint();
}

module.exports = { createCheckpoint };
