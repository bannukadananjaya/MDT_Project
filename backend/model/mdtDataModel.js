const mongoose = require('mongoose');

// Define a schema for the GeoJSON feature properties
const propertiesSchema = new mongoose.Schema({
  BaseStation: String,
  SiteID: String,
  SectorName: String,
  CellName: String,
  CellLabel: String,
  Selection: String,
  Clutter: String,
  Band: String,
  Label: String,
  Responsibility: String,
  vendor: String,
  globalCell: Number,
  tech: String,
  type: String,
  longitude: Number,
  latitude: Number,
  azimuth: Number,
  FinalAzimuth: Number,
  cellRadius: Number,
  beamwidth: Number,
  BW: Number,
  electrical: Number,
  mechanical: Number,
  antennaHeight: Number,
  LTECellTx: String,
  PhysicalC: Number,
  DLUserTh: Number,
  AvgDLUse: Number,
  AvgDLU1: Number,
  CQIAverage: Number,
  DLPRBUti: Number,
  DLTraffic: Number,
  RRCUserN: Number,
  AverageTA: Number,
  Overlapping: Boolean,
  RSRPMinus10: Boolean
});

// Define a schema for the GeoJSON feature geometry
const geometrySchema = new mongoose.Schema({
  type: String,
  coordinates: [[[Number]]]
});

// Define a schema for the GeoJSON feature
const featureSchema = new mongoose.Schema({
  type: String,
  properties: propertiesSchema,
  geometry: geometrySchema
});

// Define a schema for the FeatureCollection
const featureCollectionSchema = new mongoose.Schema({
  type: String,
  name: String,
  features: [featureSchema]
});

// Create a model for the FeatureCollection
module.exports = mongoose.model('FeatureCollection', featureCollectionSchema);

