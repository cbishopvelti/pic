import { useEffect, useState } from 'react';
import { listProperties } from './source';

// Loads the property list, whatever the source, and reports progress.
const useProperties = () => {
  const [state, setState] = useState({ properties: [], loading: true, error: null });

  useEffect(() => {
    let live = true;
    listProperties()
      .then((properties) => live && setState({ properties, loading: false, error: null }))
      .catch((error) => live && setState({ properties: [], loading: false, error }));
    return () => { live = false; };
  }, []);

  return state;
};

export default useProperties;
