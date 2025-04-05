import {
  EffectComposer,
  Noise,
  ToneMapping,
} from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';

const Effects = () => {
  return (
    <EffectComposer multisampling={8}>
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />

      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
    </EffectComposer>
  );
};

export default Effects;
