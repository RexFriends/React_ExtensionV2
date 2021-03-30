import React from 'react';
import { Tooltip } from '@material-ui/core';

function TextOverflow({ text, overflowLength = 45, ...spanProps }) {
  return text ? (
    text.length < overflowLength ? (
      <span {...spanProps}>{text}</span>
    ) : (
      <Tooltip title={text} disableFocusListener disableTouchListener arrow>
        <span {...spanProps}>{`${text.substring(0, overflowLength)}...`}</span>
      </Tooltip>
    )
  ) : (
    <span {...spanProps} />
  );
}

export default TextOverflow;
