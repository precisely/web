import * as Joi from 'joi';

import dynogels, { defineModel, ModelInstance } from 'src/db/dynamo/dynogels';

const { uuid } = dynogels.types;

// SurveyVersion model definition

export interface SurveyVersionAttributes {
  surveyId: string;
  versionId: string;
  questions?: object;
}

interface SurveyVersionMethods {}

interface SurveyVersionStaticMethods {}

export interface SurveyVersion extends ModelInstance<SurveyVersionAttributes, SurveyVersionMethods> {}

export const SurveyVersion = defineModel<SurveyVersionAttributes, SurveyVersionMethods, SurveyVersionStaticMethods>('surveyVersion', {
  hashKey: 'surveyId',
  rangeKey: 'versionId',
  timestamps: true,
  schema: {
    surveyId: Joi.string().required(),
    versionId: Joi.string().required(),
    questions: Joi.object().required()
  },
  indexes: []
});


// Survey model definition

export interface SurveyAttributes {
  id: string;
  title: string;
  ownerId: string;
  currentPublishedVersionId?: string;
  draftVersionId?: string;
  publishedVersionIds?: string[];
  isDeleted?: boolean;
}

interface SurveyMethods {}

interface SurveyStaticMethods {}

export interface Survey extends ModelInstance<SurveyAttributes, SurveyMethods> {}

export const Survey = defineModel<SurveyAttributes, SurveyMethods, SurveyStaticMethods>('survey', {
  hashKey: 'id',
  timestamps: true,
  schema: {
    id: uuid(),
    title: Joi.string().required(),
    ownerId: Joi.string().required(),
    currentPublishedVersionId: Joi.string().isoDate(),
    draftVersionId: Joi.string().isoDate(),
    publishedVersionIds: Joi.array().items(Joi.string()),
    isDeleted: Joi.boolean()
  },
  indexes: [{
    name: 'titleIndex',
    hashKey: 'title',
    type: 'global'
  }]
});


// helper model definitions

export type SurveyState = 'published' | 'draft' | 'all';
