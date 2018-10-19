/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 * @Author: Aneil Mallavarapu
 * @Date: 2018-10-16 09:48:25
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-10-16 09:49:19
 */

import * as React from 'react';
import { AnalysisColors } from 'src/constants/styles';

export const AnalysisPanel: React.StatelessComponent<any> = ({titlePrefix, children}: any) => {
  // TODO: handle userSampleStatus
  const childrenWithTitlePrefix = React.Children.map(children, (child: any) => {
    if (React.isValidElement(child)) {
      return React.cloneElement<any>(child, { titlePrefix });
    } else {
      return child;
    }
  });
  return <>{childrenWithTitlePrefix}</>;
};

export const Analysis: React.StatelessComponent = ({titlePrefix, title, type, children}: any) => {
  const color = AnalysisColors[type];
  const style = {color, borderColor: color, borderWidth: '0.5px', padding: '20px', borderStyle: 'solid' };
  const fullTitle = titlePrefix ? [titlePrefix, title].join(' ') : title;
  return (
    <div className="highlight" style={style}>
      <h1 style={{textAlign: 'center'}}>{fullTitle}</h1>
      {...children}
    </div>
  );
};

