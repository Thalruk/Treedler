export enum ResourceId {
  Water,
  Minerals,
  Energy,
}

export const ResourceName: Record<ResourceId, string> = {
  [ResourceId.Water]: 'Water',
  [ResourceId.Minerals]: 'Minerals',
  [ResourceId.Energy]: 'Energy',
};
