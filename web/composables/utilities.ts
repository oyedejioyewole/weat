import hoursToMilliseconds from "date-fns/hoursToMilliseconds";
import minutesToMilliseconds from "date-fns/minutesToMilliseconds";

export const useModal = (
  type: Options["modalTypes"],
  override?: { opened: boolean },
) => {
  const state = useStore();

  if (override) state.value.modal = { opened: override.opened, type };
  else state.value.modal = { opened: true, type };
};

export const useChangeAutoRefreshInterval = (interval: {
  hours?: number;
  minutes: number;
}) => {
  const settings = useSettings();

  if (interval.hours) {
    settings.value.features.autoRefresh.interval =
      hoursToMilliseconds(interval.hours) +
      minutesToMilliseconds(interval.minutes);
  } else {
    settings.value.features.autoRefresh.interval = minutesToMilliseconds(
      interval.minutes,
    );
  }
};
