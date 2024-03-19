import React from 'react';
import { useDataProvider, SelectInput } from 'react-admin';

export const SelectOperatingSystem = (props) => {
  const [loaded, setLoaded] = React.useState(null);
  const [availableOperatingSystems, setAvailableOperatingSystems] = React.useState([]);
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    if (loaded === null) {
      setLoaded(false);
      dataProvider
        .getList('application', {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'id', order: 'ASC' },
          filter: { 'is of-class': 'app', 'is host': 1, 'is for-device type': props.record['is of-device type'] },
        })
        .then((operatingSystems) => {
          var operatingSystemOpts = [];
          Promise.all(
            operatingSystems.data.map((operatingSystem) =>
              dataProvider
                .getList('release', {
                  pagination: { page: 1, perPage: 1000 },
                  sort: { field: 'id', order: 'ASC' },
                  filter: { 'belongs to-application': operatingSystem.id },
                })
                .then((operatingSystemReleases) => {
                  return Promise.all(
                    operatingSystemReleases.data.map((operatingSystemRelease) =>
                      dataProvider
                        .getList('release tag', {
                          pagination: { page: 1, perPage: 1000 },
                          sort: { field: 'id', order: 'ASC' },
                          filter: { 'release': operatingSystemRelease.id, 'tag key': 'version' },
                        })
                        .then((operatingSystemReleaseTag) => {
                          operatingSystemOpts.push({
                            name: operatingSystemReleaseTag.data[0].value,
                            id: operatingSystemRelease.id,
                          });
                        }),
                    ),
                  );
                }),
            ),
          ).then(() => {
            setAvailableOperatingSystems(operatingSystemOpts);
            setLoaded(true);
          });
        });
    }
  }, [props, dataProvider, loaded, setLoaded, availableOperatingSystems, setAvailableOperatingSystems]);

  if (!loaded) return null;

  return <SelectInput choices={availableOperatingSystems} {...props} />;
};

export default SelectOperatingSystem;
