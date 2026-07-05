import { Composition } from "remotion";
import { Ad } from "./Ad";

export const RemotionRoot = () => (
  <Composition
    id="Ad"
    component={Ad}
    durationInFrames={900}
    fps={30}
    width={1280}
    height={720}
  />
);
