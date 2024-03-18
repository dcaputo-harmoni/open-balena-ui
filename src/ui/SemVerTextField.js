import React from 'react';
import Typography from '@mui/material/Typography';
import { useRecordContext, useTranslate } from 'react-admin';
import Tooltip from '@mui/material/Tooltip';
import { getSemver } from './SemVerChip';
import { getStringLength } from '../lib/common';

const SemVerTextField = ({ record, emptyText = 'Unknown', emptyCommitText = 'unknown commit' }) => {
  const translate = useTranslate();
  if (!record) {
    record = useRecordContext();
  }

  if (!record) {
    return getStringLength(emptyText) > 0 ? (
      <Typography component='span' variant='body2'>
        {translate(emptyText)}
      </Typography>
    ) : null;
  }

  const semver = getSemver(record);
  const commit = record['commit'] ?? translate(emptyCommitText);

  return (
    <Tooltip title={commit}>
      <Typography component='span' variant='body2'>
        {semver}
      </Typography>
    </Tooltip>
  );
};

export default SemVerTextField;
