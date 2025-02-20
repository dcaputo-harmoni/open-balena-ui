import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { useRecordContext } from 'react-admin';

export function getSemver(record) {
  const major = record['semver major'] ?? '0';
  const minor = record['semver minor'] ?? '0';
  const patch = record['semver patch'] ?? '0';
  const prerelease = record['semver prerelease'] ?? '';
  const build = record['semver build'] ?? '';
  const revision = record['semver revision'] ?? '0';

  let versionLabel = [major, minor, patch].join('.');
  if (prerelease) {
    versionLabel += '-' + prerelease;
  } else if (build) {
    versionLabel += '+' + build;
  }
  if (revision !== '0') {
    versionLabel += `+rev${revision}`;
  }

  return versionLabel;
}

const SemVerChip = ({ record, showBlankOnNull = false, ...rest }) => {
  if (!record) {
    record = useRecordContext();
  }

  if (!record) {
    return showBlankOnNull ? null : <Chip label='Unknown' color='error' />;
  }

  const semver = getSemver(record);
  const commit = record['commit'] ?? 'unknown commit';

  return (
    <Tooltip title={commit} placement='top' arrow={true}>
      <Chip label={semver} size='small' {...rest} />
    </Tooltip>
  );
};

export default SemVerChip;
