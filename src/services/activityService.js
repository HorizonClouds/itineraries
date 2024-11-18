import ItineraryModel from '../db/models/itineraryModel.js';
import { NotFoundError, BadRequestError } from '../utils/customErrors.js';
import { v4 as uuidv4 } from 'uuid';

export const addActivity = async (itineraryId, activityData) => {
  // Buscar el itinerario por ID
  const itinerary = await ItineraryModel.findById(itineraryId);
  if (!itinerary) throw new NotFoundError('Itinerary not found');

  // Comprobar si el itinerario tiene un destino
  const destinationId = itinerary.destinationId;
  if (!destinationId) {
    throw new NotFoundError('Itinerary does not have an associated destination');
  }

  // Crear el nuevo objeto de actividad, asignando el destinationId del itinerario
  const newActivity = {
    ...activityData,
    itineraryId: itinerary._id?.toString(), // Usar el _id del itinerario, no convertir a int
    destinationId: destinationId.toString(), // Asociamos el destinationId del itinerario
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  newActivity.id = uuidv4();

  // itinerary.validateActivity(newActivity);
  // Agregar la actividad al itinerario
  itinerary.activities.push(newActivity);

  // Guardar el itinerario actualizado
  await itinerary.save();

  // Retornar la nueva actividad
  return newActivity;
};

export const deleteActivity = async (itineraryId, activityId) => {
  try {
    const itinerary = await ItineraryModel.findById(itineraryId);
    if (!itinerary) throw new NotFoundError('Itinerary not found');
    console.log('itinerary', itinerary);
    //remove activity if exists
    const activityIndex = itinerary.activities.findIndex((activity) => activity.id === activityId);
    if (activityIndex === -1) {
      console.log('Not found, activityIndex:', activityIndex);
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
  const itinerary = await ItineraryModel.findById(itineraryId);
  if (!itinerary) throw new NotFoundError('Itinerary not found');
  return itinerary.activities;
};

export default { addActivity, deleteActivity, getActivities };
