export type RawTrainInfo = {
  timestamp: string;
  line_code: string;
  station_code: string;
  train_id: string;
  destination_code: string;
  train_event_type: string;
  train_movement: string;
  status: string | null;
  platform_code: string | null;
  next_station_code: string;
  previous_station_code: string;
  bound_code: string;
};

export function getTrainById(
  dataArr: RawTrainInfo[],
  id: string
): RawTrainInfo | null {
  for (let i = 0; i < dataArr.length; i++) {
    const train = dataArr[i];
    if (train.train_id === id) {
      return train;
    }
  }
  return null;
}
