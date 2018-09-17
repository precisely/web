/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

export interface ReportData {
  id: string;
  title: string;
  slug: string;
  content: string;
  personalization: any[];
  publishedContent: string;
  publishedElements: any[];
  updatedAt: string;
  createdAt: string;
  publishedAt: string;
}
