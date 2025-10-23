#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const CHECKPOINTS_DIR = path.join(__dirname, '../checkpoints');

async function restoreCheckpoint(checkpointId) {
  try {
    if (!checkpointId) {
      console.error('Error: Checkpoint ID is required');
      console.log('Usage: npm run restore <checkpoint-id>');
      process.exit(1);
    }

    const filepath = path.join(CHECKPOINTS_DIR, `${checkpointId}.checkpoint.json`);
    
    // Check if checkpoint exists
    try {
      await fs.access(filepath);
    } catch {
      console.error(`Error: Checkpoint ${checkpointId} not found`);
      console.log('Use "npm run list-checkpoints" to see available checkpoints');
      process.exit(1);
    }

    // Read checkpoint data
    const content = await fs.readFile(filepath, 'utf8');
    const checkpoint = JSON.parse(content);
    
    console.log(`Restoring checkpoint: ${checkpointId}`);
    console.log(`Created: ${new Date(checkpoint.timestamp).toLocaleString()}`);
    console.log(`Type: ${checkpoint.type || 'unknown'}`);
    
    if (checkpoint.description) {
      console.log(`Description: ${checkpoint.description}`);
    }
    
    // Display checkpoint information
    console.log('\nCheckpoint Details:');
    console.log(JSON.stringify(checkpoint, null, 2));
    
    // For assessment checkpoints, show the assessment data
    if (checkpoint.type === 'assessment' && checkpoint.request && checkpoint.response) {
      console.log('\n--- Assessment Request ---');
      console.log(JSON.stringify(checkpoint.request.body, null, 2));
      
      console.log('\n--- Assessment Response ---');
      console.log(JSON.stringify(checkpoint.response.assessment, null, 2));
    }
    
    console.log(`\n✓ Checkpoint ${checkpointId} information displayed`);
    console.log('Note: This is a read-only restore. No files were modified.');
    
  } catch (error) {
    console.error('Error restoring checkpoint:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const checkpointId = process.argv[2];
  restoreCheckpoint(checkpointId);
}

module.exports = { restoreCheckpoint };
