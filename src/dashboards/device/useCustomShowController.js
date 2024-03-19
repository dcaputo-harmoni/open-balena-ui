import { useResourceDefinition, useTranslate, useGetOne } from 'react-admin';
import { useResourceContext, useGetResourceLabel } from 'ra-core';
import { useParams } from 'react-router-dom';

export const useCustomShowController = (props) => {
  const { id: propId, location } = useParams();
  const { hasCreate, hasEdit, hasList, hasShow } = useResourceDefinition();

  const resource = useResourceContext(props);
  const translate = useTranslate();

  let id = propId;
  if (id === '0' && location && location.search) {
    const searchParams = new URLSearchParams(location.search);
    const uuid = searchParams.get('uuid');
    if (uuid) {
      id = uuid;
    }
  }

  const { data: record, error, isLoading, refetch } = useGetOne(resource, id);

  const getResourceLabel = useGetResourceLabel();
  const defaultTitle = translate('ra.page.show', {
    name: getResourceLabel(resource, 1),
    id,
    record,
  });

  if (isLoading) {
    return { isLoading };
  }
  if (error) {
    return { error };
  }

  if (!record) {
    return null;
  }

  return {
    record,
    error,
    isLoading,
    defaultTitle,
    resource,
    refetch,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
  };
};
