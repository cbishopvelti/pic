import data from '../data/data';

// Where the property list comes from. Today it is the hard-coded data in
// src/data/data.js; to load it from a backend later, change only this file
// (for example, fetch the list and resolve it here). Each property is the
// calculator's inputs plus its `id`.
export const listProperties = async () =>
  Object.entries(data).map(([id, property]) => ({ id, ...property }));
