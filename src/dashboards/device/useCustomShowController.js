import { useCheckMinimumRequiredProps, useGetList, useTranslate } from 'react-admin';
import { useResourceContext, useGetResourceLabel } from 'ra-core';

export const useCustomShowController = (props) => {
  useCheckMinimumRequiredProps('Show', ['basePath', 'resource'], props);
  const { basePath, hasCreate, hasEdit, hasList, hasShow, id } = props;
  const resource = useResourceContext(props);
  const translate = useTranslate();
  let searchParams = {};
  if (id === '0') {
    const queryParams = props.location.search.split('?')[1].split('=');
    const uuidIdx = queryParams.indexOf('uuid') + 1;
    if (uuidIdx > 0) {
      searchParams.uuid = queryParams[uuidIdx];
    }
  } else {
    searchParams.id = id;
  }
  let {
    data: record,
    error,
    loading,
    loaded,
    refetch,
    ids,
  } = useGetList(resource, { page: 1, perPage: 1000 }, { field: 'id', order: 'ASC' }, searchParams);
  record = record[ids[0]];

  const getResourceLabel = useGetResourceLabel();
  const defaultTitle = translate('ra.page.show', { name: getResourceLabel(resource, 1), id, record });
  if (!record) return null;
  return {
    error,
    loading,
    loaded,
    defaultTitle,
    resource,
    basePath,
    record,
    refetch,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
  };
};
