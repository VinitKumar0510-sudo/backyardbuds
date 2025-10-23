#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const CHECKPOINTS_DIR = path.join(__dirname, '../checkpoints');

async function listCheckpoints() {
  try {
    // Check if checkpoints directory exists
    try {
      await fs.access(CHECKPOINTS_DIR);
    } catch {
      console.log('No checkpoints directory found.');
      return;
    }

    const files = await fs.readdir(CHECKPOINTS_DIR);
    const checkpointFiles = files.filter(file => file.endsWith('.checkpoint.json'));
    
    if (checkpointFiles.length === 0) {
      console.log('No checkpoints found.');
      return;
    }

    console.log(`Found ${checkpointFiles.length} checkpoint(s):\n`);
    
    const checkpoints = [];
    for (const file of checkpointFiles) {
      try {
        const filepath = path.join(CHECKPOINTS_DIR, file);
        const content = await fs.readFile(filepath, 'utf8');
        const data = JSON.parse(content);
        const stats = await fs.stat(filepath);
        
        checkpoints.push({
          ...data,
          filename: file,
          size: stats.size
        });
      } catch (error) {
        console.error(`Error reading ${file}:`, error.message);
      }
    }

    // Sort by timestamp (newest first)
    checkpoints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Display checkpoints
    checkpoints.forEach((checkpoint, index) => {
      const date = new Date(checkpoint.timestamp).toLocaleString();
      const size = (checkpoint.size / 1024).toFixed(1);
      
      console.log(`${index + 1}. ${checkpoint.id}`);
      console.log(`   Date: ${date}`);
      console.log(`   Type: ${checkpoint.type || 'unknown'}`);
      console.log(`   Size: ${size} KB`);
      
      if (checkpoint.description) {
        console.log(`   Description: ${checkpoint.description}`);
      }
      
      if (checkpoint.git && checkpoint.git.branch) {
        const gitStatus = checkpoint.git.hasChanges ? ' (dirty)' : '';
        console.log(`   Git: ${checkpoint.git.branch}@${checkpoint.git.commit}${gitStatus}`);
      }
      
      console.log('');
    });
    
  } catch (error) {
    console.error('Error listing checkpoints:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  listCheckpoints();
}

module.exports = { listCheckpoints };
