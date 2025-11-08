'use strict';
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class CurriculumManager {
  constructor() {
    this.curriculaDir = path.join(__dirname, '../data/curricula');
    this.progressDir = path.join(__dirname, '../data/progress');
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.curriculaDir)) {
      fs.mkdirSync(this.curriculaDir, { recursive: true });
    }
    if (!fs.existsSync(this.progressDir)) {
      fs.mkdirSync(this.progressDir, { recursive: true });
    }
  }

  getCurriculumPath(guildId, professorId) {
    return path.join(this.curriculaDir, `${guildId}_${professorId}.json`);
  }

  getProgressPath(guildId, professorId) {
    return path.join(this.progressDir, `${guildId}_${professorId}.json`);
  }

  saveCurriculum(guildId, professorId, curriculum) {
    try {
      const filePath = this.getCurriculumPath(guildId, professorId);
      const data = {
        guildId,
        professorId,
        createdAt: new Date().toISOString(),
        curriculum
      };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      
      // Initialize progress to week 1
      this.saveProgress(guildId, professorId, 1);
      
      logger.info(`Saved curriculum for ${professorId} in guild ${guildId}`);
      return true;
    } catch (err) {
      logger.error('Error saving curriculum:', err);
      return false;
    }
  }

  getCurriculum(guildId, professorId) {
    try {
      const filePath = this.getCurriculumPath(guildId, professorId);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      logger.error('Error reading curriculum:', err);
      return null;
    }
  }

  deleteCurriculum(guildId, professorId) {
    try {
      const curriculumPath = this.getCurriculumPath(guildId, professorId);
      const progressPath = this.getProgressPath(guildId, professorId);
      
      if (fs.existsSync(curriculumPath)) {
        fs.unlinkSync(curriculumPath);
      }
      if (fs.existsSync(progressPath)) {
        fs.unlinkSync(progressPath);
      }
      
      logger.info(`Deleted curriculum for ${professorId} in guild ${guildId}`);
      return true;
    } catch (err) {
      logger.error('Error deleting curriculum:', err);
      return false;
    }
  }

  saveProgress(guildId, professorId, currentWeek) {
    try {
      const filePath = this.getProgressPath(guildId, professorId);
      const data = {
        guildId,
        professorId,
        currentWeek,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (err) {
      logger.error('Error saving progress:', err);
      return false;
    }
  }

  getProgress(guildId, professorId) {
    try {
      const filePath = this.getProgressPath(guildId, professorId);
      if (!fs.existsSync(filePath)) {
        return { currentWeek: 1 };
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      logger.error('Error reading progress:', err);
      return { currentWeek: 1 };
    }
  }

  advanceWeek(guildId, professorId) {
    const progress = this.getProgress(guildId, professorId);
    const curriculum = this.getCurriculum(guildId, professorId);
    
    if (!curriculum) {
      return false;
    }

    const totalWeeks = curriculum.curriculum.weeks?.length || 15;
    const nextWeek = Math.min(progress.currentWeek + 1, totalWeeks);
    
    return this.saveProgress(guildId, professorId, nextWeek);
  }

  resetProgress(guildId, professorId) {
    return this.saveProgress(guildId, professorId, 1);
  }
}

const curriculumManager = new CurriculumManager();
module.exports = curriculumManager;
