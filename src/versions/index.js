import * as semver from 'semver';

const versions = {
  '0.139.0': {
    resources: {
      isPinnedOnRelease: 'should be running-release',
    },
    translations: {},
  },
};
versions['0.149.0'] = {
  resources: {
    ...versions['0.139.0'].resources,
  },
  fields: {
    ...versions['0.139.0'].fields,
    releaseIsFinalizedAtDate: 'is_finalized_at__date',
    releaseSemverMajor: 'semver_major',
    releaseSemverMinor: 'semver_minor',
    releaseSemverPatch: 'semver_patch',
    releaseRevision: 'revision',
    releaseIsFinal: 'is_final',
    releaseSemver: 'semver',
  },
};
versions['0.157.3'] = {
  resources: {
    ...versions['0.149.0'].resources,
  },
  fields: {
    ...versions['0.149.0'].fields,
    applicationIsOfClass: 'is of-class',
  },
};

versions['0.158.0'] = {
  resources: {
    ...versions['0.157.3'].resources,
  },
  fields: {
    ...versions['0.157.3'].fields,
    releaseKnownIssueList: 'known issue list',
  },
};

versions['0.170.0'] = {
  resources: {
    ...versions['0.158.0'].resources,
  },
  fields: {
    ...versions['0.158.0'].fields,
    releaseNote: 'note',
  },
};

versions['0.171.0'] = {
  resources: {
    ...versions['0.170.0'].resources,
  },
  fields: {
    ...versions['0.170.0'].fields,
    releaseInvalidationReason: 'invalidation reason',
  },
};

versions['0.185.0'] = {
  resources: {
    ...versions['0.171.0'].resources,
    deviceTypeAlias: 'device type alias',
  },
  fields: {
    ...versions['0.171.0'].fields,
  },
};

versions['25.2.8'] = {
  resources: {
    ...versions['0.185.0'].resources,
    isPinnedOnRelease: 'is pinned on-release',
  },
  fields: {
    ...versions['0.185.0'].fields,
  },
};

const resource = (resource, version) => {
  const targetVer = semver.maxSatisfying(Object.keys(versions), `<=${version.split('v')[1]}`);
  return versions[targetVer].resources[resource];
};

const field = (field, version) => {
  const targetVer = semver.maxSatisfying(Object.keys(versions), `<=${version.split('v')[1]}`);
  return versions[targetVer].fields[field];
};

const versionsExport = { resource, field };

export default versionsExport;
