import ItineraryModel from '../db/models/itineraryModel.js';
import { NotFoundError, BadRequestError, ValidationError } from '../utils/customErrors.js';

export const addActivity = async (itineraryId, activityData) => {
  // Buscar el itinerario por ID
  let itinerary;
  try {
    itinerary = await ItineraryModel.findById(itineraryId);
  } catch (error) {
    throw new NotFoundError('Itinerary not found');
  }


  // Crear el nuevo objeto de actividad
  const newActivity = {
    ...activityData,
    itineraryId: itinerary._id?.toString(), // Usar el _id del itinerario, no convertir a int
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // itinerary.validateActivity(newActivity);
  // Agregar la actividad al itinerario
  itinerary.activities.push(newActivity);
  let resultItinerary;
  try {
    await itinerary.validate();
    // Guardar el itinerario actualizado
    resultItinerary = await itinerary.save();
  } catch (error) {
    throw new ValidationError('Error validating itinerary', error);
  }

  // Retornar la nueva actividad
  return resultItinerary.activities[resultItinerary.activities.length - 1];
};

export const deleteActivity = async (activityId) => {
  let itinerary;
  try {
    itinerary = await ItineraryModel.findOne({ 'activities._id': activityId });
    if (!itinerary) throw new NotFoundError('Activity not found');
  } catch (error) {
    throw new NotFoundError('Activity not found');
  }

  try {
    const activityIndex = itinerary.activities.findIndex((activity) => activity._id.toString() === activityId);
    if (activityIndex === -1) {
      throw new NotFoundError('Activity not found');
    }
    itinerary.activities.splice(activityIndex, 1);
    await itinerary.save();
    return itinerary.activities;
  } catch (error) {
    throw new BadRequestError('Error deleting activity', error);
  }
};

export const getActivities = async (itineraryId) => {
  let itinerary;
  try {
    itinerary = await ItineraryModel.findById(itineraryId);
    if (!itinerary) throw new NotFoundError('Itinerary not found');
  } catch (error) {
    throw new NotFoundError('Itinerary not found');
  }
  return itinerary.activities;
};

export default { addActivity, deleteActivity, getActivities };
