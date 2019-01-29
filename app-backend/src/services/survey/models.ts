import * as Joi from 'joi';
import uuid = require('uuid');

import dynogels, {defineModel, ListenerNextFunction, ModelInstance} from 'src/db/dynamo/dynogels';


 // SurveyVersion model definition

export interface SurveyVersionAttributes {
  surveyId: string;
  versionId: string;
  questions: object;
}

interface SurveyVersionMethods {}

interface SurveyVersionStaticMethods {}

export interface SurveyVersion extends ModelInstance<SurveyVersionAttributes, SurveyVersionMethods> {}

export const SurveyVersion = defineModel<SurveyVersionAttributes, SurveyVersionMethods, SurveyVersionStaticMethods>('surveyVersion', {
  hashKey: 'surveyId',
  timestamps: true,
  schema: {
    surveyId: Joi.string().required(),
    versionId: Joi.string().required(),
    questions: Joi.object().required()
  },
  indexes: [{
    name: 'surveyVersionIndex',
    hashKey: 'surveyId',
    rangeKey: 'versionId',
    type: 'global'
  }]
});


 // Survey model definition

export interface SurveyAttributes {
  id: string;
  title: string;
  ownerId: string;
  currentPublishedVersionId?: string;
  draftVersionId?: string;
  /*
  FIXME: Should these just be methods?
  currentPublishedVersion?: SurveyVersion;
  // FIXME: These shouldn't be optional.
  draftVersion?: SurveyVersion;
  versions?: [SurveyVersion]
  */
}

interface SurveyMethods {}

interface SurveyStaticMethods {}

export interface Survey extends ModelInstance<SurveyAttributes, SurveyMethods> {}

export const Survey = defineModel<SurveyAttributes, SurveyMethods, SurveyStaticMethods>('survey', {
  hashKey: 'id',
  timestamps: true,
  schema: {
    id: Joi.string(), // FIXME: uuid()?
    title: Joi.string().required(),
    ownerId: Joi.string().required(),
    currentPublishedVersionId: Joi.string(), // FIXME: Add timestamp format validation string.
    draftVersionId: Joi.string(), // FIXME: Ditto.
    /* currentPublishedVersion: Joi.string(), // FIXME: Wrong type.
     * draftVersion: Joi.string(), // FIXME: Wrong type.
     * versions: Joi.array().items(Joi.string()) // FIXME: Wrong type.*/
  },
  indexes: [{
    name: 'titleIndex',
    hashKey: 'title',
    type: 'global'
  }]
});


 // helper model definitions

export type SurveyState = 'published' | 'draft' | 'all';
