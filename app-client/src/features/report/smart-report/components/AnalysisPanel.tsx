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

const unknownText = require('src/assets/image/unknown-text.png');
const downCaret = require('src/assets/icon/down-caret.png');

export const AnalysisPanel: React.StatelessComponent<any> = ({titlePrefix, personalize, children}: any) => {
  // TODO: handle userSampleStatus
  if (personalize) {
    const childrenWithTitlePrefix = React.Children.map(children, (child: any) => {
      if (React.isValidElement(child)) {
        return React.cloneElement<any>(child, { titlePrefix });
      } else {
        return child;
      }
    });
    return <>{childrenWithTitlePrefix}</>;
  } else {
    return (
      <Analysis type="unknown" title="Your Personalized Analysis">
        <div style={{textAlign: 'center'}}>
          <p><img style={{width:'100%', marginTop: '10px'}} src={unknownText}/></p>
          <p><img src={downCaret}/></p>
        </div>
      </Analysis>
    );
  }
};

interface AnalysisProps {
  titlePrefix?: string;
  title: string;
  type: string;
}

export const Analysis: React.StatelessComponent<AnalysisProps> = ({titlePrefix, title, type, children}) => {
  const color = AnalysisColors[type];
  const style = {color, borderColor: color, borderWidth: '0.5px', padding: '20px', borderStyle: 'solid' };
  const fullTitle = titlePrefix ? [titlePrefix, title].join(' ') : title;
  return (
    <div className="highlight" style={style}>
      <h1 style={{textAlign: 'center'}}>{fullTitle}</h1>
      {children}
    </div>
  );
};

