import {
  MdDashboard,
  MdBatchPrediction,
  MdAppShortcut,
  MdBusiness,
  MdPhotoLibrary,
  MdLocationOn,
} from "react-icons/md";

export const sidebarItems = [
  {
    icon: MdDashboard,
    label: "Dashboard",
    path: `/business`,
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
