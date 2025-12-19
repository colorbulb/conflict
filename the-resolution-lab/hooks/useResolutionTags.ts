import { useEffect, useState } from 'react';
import { FEELING_TAGS, NEED_TAGS, CATEGORY_TAGS } from '../constants';
import { getResolutionTags } from '../services/tagService';

export function useResolutionTags() {
  const [feelings, setFeelings] = useState<string[]>(FEELING_TAGS);
  const [needs, setNeeds] = useState<string[]>(NEED_TAGS);
  const [categories, setCategories] = useState<string[]>(CATEGORY_TAGS);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [remoteFeelings, remoteNeeds, remoteCategories] = await Promise.all([
        getResolutionTags('feelings'),
        getResolutionTags('needs'),
        getResolutionTags('categories')
      ]);

      if (cancelled) return;

      if (remoteFeelings && remoteFeelings.length) setFeelings(remoteFeelings);
      if (remoteNeeds && remoteNeeds.length) setNeeds(remoteNeeds);
      if (remoteCategories && remoteCategories.length) setCategories(remoteCategories);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { feelings, needs, categories };
}


