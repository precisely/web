/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

export interface Report {
  id: string;
  title: string;
  slug: string;
  raw_content: string;
  parsed_content: string;
  top_level: boolean;
  genes: string[];
}

export interface UserData {
  gene: string;
  opaque_id: string;
  sample_id: string;
  quality: string;
}

export interface ListItem<DataType> {
  attrs: DataType;
}

export interface ReportList {
  Items: ListItem<Report>[];
  userData?: {Items: ListItem<UserData>[]};
}
