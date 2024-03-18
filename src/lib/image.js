import { useAuthProvider, useDataProvider } from 'react-admin';
import axios from 'axios';
import { deleteAllRelated } from './delete';

export function useDeleteImage() {
  const dataProvider = useDataProvider();
  const authProvider = useAuthProvider();

  return async (image) => {
    let relatedIndirectLookups = [
      {
        remoteResource: 'image environment variable',
        remoteField: 'release image',
        viaRemoteField: 'id',
        viaResource: 'image-is part of-release',
        viaLocalField: 'image',
        localField: 'id',
      },
      {
        remoteResource: 'image label',
        remoteField: 'release image',
        viaRemoteField: 'id',
        viaResource: 'image-is part of-release',
        viaLocalField: 'image',
        localField: 'id',
      },
    ];
    let relatedDirectLookups = [
      { remoteResource: 'image-is part of-release', remoteField: 'image', localField: 'id' },
      { remoteResource: 'image install', remoteField: 'installs-image', localField: 'id' },
    ];
    await deleteAllRelated(dataProvider, image, relatedIndirectLookups, relatedDirectLookups);
    const imageLocationHash = image['is stored at-image location'].split('v2/')[1];
    const session = authProvider.getSession();
    const response = await axios.post(
      `${process.env.REACT_APP_OPEN_BALENA_UI_URL}/deleteRegistryImage`,
      { imageLocationHash },
      { headers: { Authorization: `Bearer ${session.jwt}` } },
    );
    if (!response?.data?.success) {
      console.log(`Registry deletion failed: ${response?.data?.message}`);
    }
    await dataProvider.delete('image', { id: image['id'] });
    return Promise.resolve();
  };
}
