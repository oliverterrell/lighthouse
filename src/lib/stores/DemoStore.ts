import { zustandFactory } from '@/lib/stores/zustandFactory';
import { CaseStrategy } from '@/lib/types';
import { saveStrategy } from '@/lib/strategyLoader';

const createDemoStore = (set: any, get: any) => {
  return {
    activeStrategy: null as CaseStrategy,
    activeProfileId: null as string,

    setActiveStrategy: (strategy: CaseStrategy, profileId: string) => set({ activeStrategy: strategy, activeProfileId: profileId }),

    updateDemographicField: (fieldName, value) => {
      const state = get();
      if (!state.activeStrategy || !state.activeProfileId) return;

      const updatedStrategy = {
        ...state.activeStrategy,
        demographic_information: {
          ...state.activeStrategy.demographic_information,
          fields: state.activeStrategy.demographic_information.fields.map((field: any) =>
            field.name === fieldName ? { ...field, value } : field
          ),
        },
      };

      saveStrategy(state.activeProfileId, updatedStrategy);

      set({ activeStrategy: updatedStrategy });
    },

    updateInstanceField: (criterionId, instanceId, fieldName, value) => {
      const state = get();
      if (!state.activeStrategy || !state.activeProfileId) return;

      const updatedStrategy = {
        ...state.activeStrategy,
        criteria: state.activeStrategy.criteria.map((criterion: any) =>
          criterion.id === criterionId
            ? {
                ...criterion,
                instances: criterion.instances.map((instance: any) =>
                  instance.id === instanceId
                    ? {
                        ...instance,
                        fields: instance.fields.map((field: any) => (field.name === fieldName ? { ...field, value } : field)),
                      }
                    : instance
                ),
              }
            : criterion
        ),
      };

      saveStrategy(state.activeProfileId, updatedStrategy);

      set({ activeStrategy: updatedStrategy });
    },

    addInstance: (criterionId, title: string) => {
      const state = get();
      if (!state.activeStrategy || !state.activeProfileId) return;

      const criterion = state.activeStrategy.criteria.find((c: any) => c.id === criterionId);
      if (!criterion || criterion.instances.length === 0) return;

      const templateFields = criterion.instances[0].fields.map((field: any) => ({
        ...field,
        value: Array.isArray(field.value) ? [] : '',
      }));

      const newInstance = {
        id: `${criterionId}-${Date.now()}`,
        title: title,
        fields: templateFields,
      };

      const updatedStrategy = {
        ...state.activeStrategy,
        criteria: state.activeStrategy.criteria.map((c: any) =>
          c.id === criterionId ? { ...c, instances: [...c.instances, newInstance] } : c
        ),
      };

      saveStrategy(state.activeProfileId, updatedStrategy);
      set({ activeStrategy: updatedStrategy });
    },

    deleteInstance: (criterionId, instanceId) => {
      const state = get();
      if (!state.activeStrategy || !state.activeProfileId) return;

      const updatedStrategy = {
        ...state.activeStrategy,
        criteria: state.activeStrategy.criteria.map((c: any) =>
          c.id === criterionId ? { ...c, instances: c.instances.filter((i: any) => i.id !== instanceId) } : c
        ),
      };

      saveStrategy(state.activeProfileId, updatedStrategy);
      set({ activeStrategy: updatedStrategy });
    },
  };
};

export type DemoStore = ReturnType<typeof createDemoStore>;
export const useDemoStore: (...args: (keyof DemoStore)[]) => DemoStore = zustandFactory<DemoStore>(createDemoStore);
