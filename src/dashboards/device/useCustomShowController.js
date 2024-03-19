import { useGetResourceLabel, useResourceContext } from 'ra-core';
import { useRecordContext, useResourceDefinition, useTranslate } from 'react-admin';
import { useParams } from 'react-router-dom';

export const useCustomShowController = () => {
  const { id: propId, location } = useParams();
  const { hasCreate, hasEdit, hasList, hasShow } = useResourceDefinition();

  const resource = useResourceContext();
  const translate = useTranslate();

  let id = propId;

  if (id === '0' && location && location.search) {
    const searchParams = new URLSearchParams(location.search);
    const uuid = searchParams.get('uuid');

    if (uuid) {
      id = uuid;
    }
  }

  const record = useRecordContext();

  const getResourceLabel = useGetResourceLabel();
  const defaultTitle = translate('ra.page.show', {
    name: getResourceLabel(resource, 1),
    id,
    record,
  });

  if (!record) {
    return {};
  }

  return {
    record,
    defaultTitle,
    resource,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
  };
};
