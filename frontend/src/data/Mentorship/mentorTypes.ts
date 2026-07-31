export type ButtonType = {
  label: string;
  link?: string; 
};

export type ImageType = {
  src: string;
  type: "horizontal" | "vertical";
  position: "left" | "right";
};

export type MentorSection = {
  header: string;
  text: string;
  buttons: ButtonType[];
  image?: ImageType;
  isActive?: boolean;
};
