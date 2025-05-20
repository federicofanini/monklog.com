import {
  MdBatchPrediction,
  MdAppShortcut,
  MdBusiness,
  MdPhotoLibrary,
  MdLocationOn,
  MdMan4,
} from "react-icons/md";

export const sidebarItems = [
  {
    icon: MdMan4,
    label: "Monk Mode",
    path: `/monk`,
  },
  {
    icon: MdBusiness,
    label: "Profile",
    path: `/business/profile`,
  },
  {
    icon: MdLocationOn,
    label: "Location",
    path: `/business/location`,
  },
  {
    icon: MdPhotoLibrary,
    label: "Gallery",
    path: `/business/gallery`,
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
    label: "Feedback",
    path: `/business/feedback`,
  },
  {
    icon: MdAppShortcut,
    label: "Mobile App",
    path: `/business/mobile-app`,
  },
];
