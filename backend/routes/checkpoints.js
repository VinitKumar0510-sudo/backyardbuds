const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// GET /api/checkpoints - List available checkpoints
router.get('/', async (req, res) => {
  try {
    const checkpointsDir = path.join(__dirname, '../../checkpoints');
    
    // Ensure checkpoints directory exists
    try {
      await fs.access(checkpointsDir);
    } catch {
      await fs.mkdir(checkpointsDir, { recursive: true });
    }

    const files = await fs.readdir(checkpointsDir);
    const checkpointFiles = files.filter(file => file.endsWith('.checkpoint.json'));
    
    const checkpoints = await Promise.all(
      checkpointFiles.map(async (file) => {
        try {
          const filePath = path.join(checkpointsDir, file);
          const stats = await fs.stat(filePath);
          const content = await fs.readFile(filePath, 'utf8');
          const data = JSON.parse(content);
          
          return {
            id: file.replace('.checkpoint.json', ''),
            filename: file,
            timestamp: data.timestamp || stats.mtime.toISOString(),
            size: stats.size,
            assessmentCount: Array.isArray(data.assessments) ? data.assessments.length : 1
          };
        } catch (error) {
          console.error(`Error reading checkpoint ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out failed reads and sort by timestamp
    const validCheckpoints = checkpoints
      .filter(cp => cp !== null)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      checkpoints: validCheckpoints,
      metadata: {
        total: validCheckpoints.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error listing checkpoints:', error);
    res.status(500).json({
      error: 'Failed to list checkpoints',
      message: 'Unable to retrieve checkpoint files'
    });
  }
});

// GET /api/checkpoints/:id - Get specific checkpoint
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const checkpointPath = path.join(__dirname, '../../checkpoints', `${id}.checkpoint.json`);
    
    const content = await fs.readFile(checkpointPath, 'utf8');
    const checkpoint = JSON.parse(content);
    
    res.json({
      success: true,
      checkpoint: checkpoint,
      metadata: {
        id: id,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({
        error: 'Checkpoint not found',
        message: `No checkpoint found with ID: ${req.params.id}`
      });
    }
    
    console.error('Error retrieving checkpoint:', error);
    res.status(500).json({
      error: 'Failed to retrieve checkpoint',
      message: 'Unable to load checkpoint data'
    });
  }
});

// DELETE /api/checkpoints/:id - Delete specific checkpoint
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const checkpointPath = path.join(__dirname, '../../checkpoints', `${id}.checkpoint.json`);
    
    await fs.unlink(checkpointPath);
    
    res.json({
      success: true,
      message: `Checkpoint ${id} deleted successfully`,
      metadata: {
        id: id,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({
        error: 'Checkpoint not found',
        message: `No checkpoint found with ID: ${req.params.id}`
      });
    }
    
    console.error('Error deleting checkpoint:', error);
    res.status(500).json({
      error: 'Failed to delete checkpoint',
      message: 'Unable to delete checkpoint file'
    });
  }
});

module.exports = router;
