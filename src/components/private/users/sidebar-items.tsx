import {
  MdBatchPrediction,
  MdAppShortcut,
  MdPhotoLibrary,
  MdLocationOn,
  MdMan4,
  MdAssistantPhoto,
} from "react-icons/md";

export const sidebarItems = [
  {
    icon: MdMan4,
    label: "Monk Mode",
    path: `/monk`,
  },
  {
    icon: MdAssistantPhoto,
    label: "History",
    path: `/monk/history`,
  },
  {
    icon: MdLocationOn,
    label: "Log",
    path: `/monk/log`,
  },
  {
    icon: MdPhotoLibrary,
    label: "Mentor",
    path: `/monk/mentor`,
  },
  //{
  //  icon: MdSportsGymnastics,
  //  label: "Athletes",
  //  path: `/business/athletes`,
  //},
  //{
  //  icon: Dumbbell,
  //  label: "Workouts",
  //  path: `/business/workouts`,
  //},
  {
    icon: MdBatchPrediction,
    label: "Profile",
    path: `/monk/profile`,
  },
  {
    icon: MdAppShortcut,
    label: "Settings",
    path: `/monk/settings`,
  },
];
