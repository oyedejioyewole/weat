export const useModal = (
  type: Options["modalTypes"],
  override?: { opened: boolean },
) => {
  const state = useStore();

  if (override) state.value.modal = { opened: override.opened, type };
  else state.value.modal = { opened: true, type };
};
