const ResolutionService = require("../services/resolution.service");
const Response = require("../models/Response.model");

class ResolutionController {
  async create(req, res) {
    const result = await ResolutionService.createResolution(req.body);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(201, true, result.data));
  }

  async getAll(req, res) {
    const resolutions = await ResolutionService.getAll();
    return res.json(Response.set(resolutions));
  }

  async getById(req, res) {
    const result = await ResolutionService.getResolutionById(req.params.id);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(result.data));
  }

  async update(req, res) {
    const result = await ResolutionService.updateResolution(req.params.id, req.body);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(200, true, result.data));
  }

  async delete(req, res) {
    const result = await ResolutionService.deleteResolution(req.params.id);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(200, true, result.message));
  }
}

module.exports = new ResolutionController();
